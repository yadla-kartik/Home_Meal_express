const chefAuth = require('../models/chefAuth')
const chefMenu = require('../models/chefMenu')
const axios = require('axios')

const DEFAULT_MENU_STATUS = 'draft'
const POLLINATIONS_BASE_URL = process.env.POLLINATIONS_BASE_URL || 'https://gen.pollinations.ai'
const POLLINATIONS_TIMEOUT_MS = Number(process.env.POLLINATIONS_TIMEOUT_MS || 45000)
const POLLINATIONS_IMAGE_MODEL = process.env.POLLINATIONS_IMAGE_MODEL
  ? process.env.POLLINATIONS_IMAGE_MODEL.trim()
  : ''
const POLLINATIONS_IMAGE_FALLBACK_MODEL = process.env.POLLINATIONS_IMAGE_FALLBACK_MODEL || 'flux'
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 20000)

const pollinationsLog = (...args) => {
  console.log('[Pollinations]', ...args)
}

const geminiLog = (...args) => {
  console.log('[Gemini]', ...args)
}

const PRICE_RANGE_CAPS = {
  Veg: 280,
  'Non-Veg': 420,
  Snacks: 180,
  Breakfast: 160,
  Thali: 260,
}

const toTrimmedString = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback
  return value.trim()
}

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toStringArray = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

const toIsoDateOrNull = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getPriceCeilingForDish = (dish = {}) => {
  const category = toTrimmedString(dish.category, 'Veg')
  return PRICE_RANGE_CAPS[category] || 320
}

const getPollinationsHeaders = () => {
  const apiKey = process.env.POLLINATIONS_API_KEY || ''
  return apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
}

const getPollinationsErrorDetails = (err) => ({
  status: err.response?.status || null,
  statusText: err.response?.statusText || '',
  message: err.response?.data?.error?.message || err.response?.data?.message || err.message,
})

const shouldRetryPollinationsImage = (err) => {
  const message = getPollinationsErrorDetails(err).message.toLowerCase()
  return (
    message.includes('no active flux servers available') ||
    message.includes('no active') ||
    message.includes('server unavailable')
  )
}

const getGenerationTextModel = () => {
  const configuredModel = process.env.POLLINATIONS_TEXT_MODEL || 'openai'
  if (configuredModel.toLowerCase().includes('safety')) {
    pollinationsLog('text model override applied', {
      configuredModel,
      usedModel: 'openai',
      reason: 'safety models classify prompts instead of writing food content',
    })
    return 'openai'
  }
  return configuredModel
}

const cleanAiText = (value) => {
  if (typeof value !== 'string') return ''
  return value
    .replace(/^```(?:text)?/i, '')
    .replace(/```$/i, '')
    .replace(/^["']|["']$/g, '')
    .trim()
}

const extractJsonBlock = (value) => {
  const text = cleanAiText(value)
  const blockMatch = text.match(/```json\s*([\s\S]*?)```/i)
  if (blockMatch?.[1]) return blockMatch[1].trim()
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1)
  }
  return text
}

const isSafetyClassifierText = (value) => {
  const text = cleanAiText(value).toLowerCase()
  return (
    text.startsWith('safety:') ||
    text.includes('categories:') ||
    text.includes('safe\ncategories') ||
    text.includes('unsafe\ncategories')
  )
}

const isUsefulImagePrompt = (value, dish = {}) => {
  const text = cleanAiText(value)
  const dishName = toTrimmedString(dish.name).toLowerCase()
  if (!text || isSafetyClassifierText(text)) return false
  if (text.length < 45) return false
  if (dishName && !text.toLowerCase().includes(dishName.toLowerCase())) return false
  return true
}

const makeFallbackImagePrompt = (dish = {}) => {
  const dishName = toTrimmedString(dish.name, 'homemade Indian meal')

  return `Ultra realistic homemade ${dishName},
premium food photography,
authentic Indian plating,
fresh ingredients,
warm cinematic lighting,
highly detailed,
restaurant style presentation,
DSLR quality,
shallow depth of field,
appetizing and fresh,
no text,
no logo,
no watermark`
}

const makeFallbackDescription = (dish = {}) => {
  const dishName = toTrimmedString(dish.name, 'This dish')
  const category = toTrimmedString(dish.category, 'homemade meal').toLowerCase()
  return `${dishName} is a freshly prepared ${category} with homestyle flavour, balanced spices, and a warm, authentic taste.`
}

const normalizePriceGuidance = (guidance = {}, price = 0) => {
  const status = ['ok', 'high', 'low', 'unknown'].includes(guidance.status) ? guidance.status : 'unknown'
  const suggestedMin = Math.max(0, toNumber(guidance.suggestedMin, 0))
  const inputMax = Math.max(suggestedMin, toNumber(guidance.suggestedMax, 0))
  const priceCeiling = getPriceCeilingForDish(guidance)
  const suggestedMax = Math.min(priceCeiling, inputMax || priceCeiling)
  const boundedSuggestedMin = Math.min(suggestedMin, suggestedMax || suggestedMin)
  const warningMessage = toTrimmedString(guidance.warningMessage)
  const confidence = toTrimmedString(guidance.confidence)
  const checkedAt = toIsoDateOrNull(guidance.checkedAt) || new Date()
  const source = toTrimmedString(guidance.source, 'gemini')

  const defaultWarningMessage =
    status === 'high'
      ? `This price looks higher than the usual homemade market range for ${toTrimmedString(guidance.dishName, 'this dish')}.`
      : ''

  return {
    status,
    suggestedMin: boundedSuggestedMin,
    suggestedMax,
    warningMessage: warningMessage || defaultWarningMessage,
    confidence,
    checkedAt,
    source,
  }
}

const getGeminiApiKey = () => toTrimmedString(process.env.GEMINI_API_KEY)

const callGeminiText = async (prompt) => {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    throw new Error('Gemini API key is missing')
  }

  geminiLog('text request started', {
    model: GEMINI_MODEL,
    promptLength: prompt.length,
  })

  const response = await axios.post(
    `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    },
    {
      timeout: GEMINI_TIMEOUT_MS,
    },
  )

  const text =
    response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('\n')
      .trim() || ''

  geminiLog('text request finished', {
    status: response.status,
    outputLength: text.length,
  })

  return text
}

const buildDishPricePrompt = (dish = {}) => {
  const dishName = toTrimmedString(dish.name)
  const category = toTrimmedString(dish.category, 'Homemade food')
  const price = Math.max(0, toNumber(dish.price, 0))
  const servingSize = toTrimmedString(dish.servingSize, '1 person')
  const spiceLevel = toTrimmedString(dish.spiceLevel, 'Medium')
  const tags = toStringArray(dish.tags).join(', ') || 'Homemade'

  return `You are evaluating whether a chef's homemade food menu price is reasonable in India.

Use practical Indian homemade-meal pricing judgment for common city markets like Raipur, not luxury fine-dining pricing.
Do not browse the internet. Use your general knowledge and return a conservative estimate.
These are homemade meals, so keep price ranges tighter than restaurant pricing.

Dish details:
- Dish name: ${dishName}
- Category: ${category}
- Serving size: ${servingSize}
- Spice level: ${spiceLevel}
- Tags: ${tags}
- Entered price in INR: ${price}

Return strict JSON only with this shape:
{
  "status": "ok" | "high" | "low" | "unknown",
  "suggestedMin": number,
  "suggestedMax": number,
  "warningMessage": string,
  "confidence": "low" | "medium" | "high"
}

Rules:
- Mark "high" only when the entered price is clearly above a normal homemade-market range.
- Mark "ok" when the entered price is within a realistic range.
- Keep the upper range modest for homemade food. Avoid premium restaurant pricing.
- For most homemade veg dishes, usually stay at or below INR 280.
- For homemade non-veg dishes like chicken or mutton biryani, usually stay at or below INR 420.
- Keep suggestedMin and suggestedMax realistic whole-number INR values.
- If status is "high", warningMessage must briefly say the price looks higher than normal.
- If status is "ok", keep warningMessage empty.
- Never mention that you are an AI.
- Return only valid JSON.`
}

const getFallbackPriceGuidance = (dish = {}) => {
  const price = Math.max(0, toNumber(dish.price, 0))
  const ceiling = getPriceCeilingForDish(dish)
  const floor = Math.max(40, Math.round(ceiling * 0.55))
  const status = price > ceiling ? 'high' : 'ok'

  return normalizePriceGuidance(
    {
      dishName: toTrimmedString(dish.name),
      status,
      suggestedMin: floor,
      suggestedMax: ceiling,
      warningMessage:
        status === 'high'
          ? `This price looks higher than the usual homemade market range for ${toTrimmedString(dish.name, 'this dish')}.`
          : '',
      confidence: 'medium',
      checkedAt: new Date().toISOString(),
      source: 'fallback',
    },
    price,
  )
}

const generateDishPriceGuidance = async (dish = {}) => {
  const price = Math.max(0, toNumber(dish.price, 0))
  const dishName = toTrimmedString(dish.name)

  if (!dishName || price <= 0) {
    return null
  }

  const prompt = buildDishPricePrompt(dish)
  const rawText = await callGeminiText(prompt)
  const jsonText = extractJsonBlock(rawText)
  const parsed = JSON.parse(jsonText)

  return normalizePriceGuidance(
    {
      ...parsed,
      dishName,
      checkedAt: new Date().toISOString(),
      source: 'gemini',
    },
    price,
  )
}

const generatePollinationsText = async (prompt) => {
  const model = getGenerationTextModel()

  pollinationsLog('text request started', {
    hasApiKey: Boolean(process.env.POLLINATIONS_API_KEY),
    model,
    promptLength: prompt.length,
  })

  const response = await axios.post(
    `${POLLINATIONS_BASE_URL}/v1/chat/completions`,
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: getPollinationsHeaders(),
      timeout: POLLINATIONS_TIMEOUT_MS,
    },
  )

  const text = cleanAiText(response.data?.choices?.[0]?.message?.content || '')
  pollinationsLog('text request finished', {
    status: response.status,
    outputLength: text.length,
  })

  return text
}

const buildDishContext = (dish = {}) => {
  const tags = toStringArray(dish.tags).join(', ')
  return [
    `Dish name: ${toTrimmedString(dish.name)}`,
    `Category: ${toTrimmedString(dish.category, 'Homemade food')}`,
    `Spice level: ${toTrimmedString(dish.spiceLevel, 'Medium')}`,
    tags ? `Tags: ${tags}` : '',
    toTrimmedString(dish.description) ? `Current description: ${toTrimmedString(dish.description)}` : '',
  ].filter(Boolean).join('\n')
}

const makeImagePrompt = async (dish) => {
  const prompt = `Create one final image-generation prompt for a homemade Indian dish.

Base photography style:
Ultra realistic homemade <dishName>,
premium food photography,
authentic Indian plating,
fresh ingredients,
warm cinematic lighting,
highly detailed,
restaurant style presentation,
DSLR quality,
shallow depth of field,
appetizing and fresh,
no text,
no logo,
no watermark

Dish details:
Dish name: ${toTrimmedString(dish.name)}
Category: ${toTrimmedString(dish.category, 'Homemade food')}
Spice level: ${toTrimmedString(dish.spiceLevel, 'Medium')}
Tags: ${toStringArray(dish.tags).join(', ') || 'Homemade'}
Current description: ${toTrimmedString(dish.description) || 'Not provided'}

Rules:
- Return only the final image prompt.
- Replace <dishName> with the actual dish name.
- Mix the dish details naturally into the base photography style.
- Do not include text, logo, watermark, hands, people, train seats, or packaging labels.
- Keep it realistic, appetizing, and suitable for a food menu image.`

  const generatedPrompt = await generatePollinationsText(prompt)

  if (isUsefulImagePrompt(generatedPrompt, dish)) {
    return generatedPrompt
  }

  const fallbackPrompt = makeFallbackImagePrompt(dish)
  pollinationsLog('image prompt fallback used', {
    generatedPreview: cleanAiText(generatedPrompt).slice(0, 120),
    fallbackPreview: fallbackPrompt.slice(0, 160),
  })
  return fallbackPrompt
}

const makeMenuDescription = async (dish) => {
  const prompt = `Write one customer-facing food menu description for a homemade Indian dish.

Dish name: ${toTrimmedString(dish.name)}
Category: ${toTrimmedString(dish.category, 'Homemade food')}
Spice level: ${toTrimmedString(dish.spiceLevel, 'Medium')}
Tags: ${toStringArray(dish.tags).join(', ') || 'Homemade'}
Current description: ${toTrimmedString(dish.description) || 'Not provided'}

Rules:
- Return only the description.
- 18 to 28 words.
- Make it sound premium, warm, realistic, and appetizing.
- Use natural food language similar to Zomato or Swiggy menu descriptions.
- Mention freshness, homemade taste, texture, spices, or ingredients naturally.
- Keep the tone simple and trustworthy.
- Do not use emojis, hashtags, marketing slogans, quotes, or price.
- Avoid repetitive adjectives.
- Make the dish feel freshly prepared and authentic.`

  const generatedDescription = await generatePollinationsText(prompt)

  if (generatedDescription && !isSafetyClassifierText(generatedDescription)) {
    return generatedDescription
  }

  const fallbackDescription = makeFallbackDescription(dish)
  pollinationsLog('description fallback used', {
    generatedPreview: cleanAiText(generatedDescription).slice(0, 120),
    fallbackPreview: fallbackDescription,
  })
  return fallbackDescription
}

const requestPollinationsImage = async ({ prompt, model }) => {
  pollinationsLog('image generation attempt started', {
    model,
    promptLength: prompt.length,
  })

  const imageResponse = await axios.post(
    `${POLLINATIONS_BASE_URL}/v1/images/generations`,
    {
      prompt,
      n: 1,
      size: '768x576',
      quality: 'medium',
      response_format: 'b64_json',
      safe: 'true',
      ...(model ? { model } : {}),
    },
    {
      headers: getPollinationsHeaders(),
      timeout: POLLINATIONS_TIMEOUT_MS,
    },
  )

  pollinationsLog('image generation attempt finished', {
    model,
    status: imageResponse.status,
    hasBase64: Boolean(imageResponse.data?.data?.[0]?.b64_json),
    hasUrl: Boolean(imageResponse.data?.data?.[0]?.url),
  })

  return imageResponse
}

const downloadImageAsDataUrl = async (url) => {
  const downloadedImage = await axios.get(url, {
    headers: getPollinationsHeaders(),
    responseType: 'arraybuffer',
    timeout: POLLINATIONS_TIMEOUT_MS,
  })
  const contentType = downloadedImage.headers['content-type'] || 'image/jpeg'
  const base64Image = Buffer.from(downloadedImage.data).toString('base64')
  return `data:${contentType};base64,${base64Image}`
}

const requestSimplePollinationsImage = async ({ prompt, model }) => {
  const apiKey = toTrimmedString(process.env.POLLINATIONS_API_KEY)
  const params = new URLSearchParams()

  if (model) params.set('model', model)
  if (apiKey) params.set('key', apiKey)
  params.set('width', '768')
  params.set('height', '576')
  params.set('safe', 'true')

  const imageUrl = `${POLLINATIONS_BASE_URL}/image/${encodeURIComponent(prompt)}?${params.toString()}`

  pollinationsLog('simple image endpoint attempt started', {
    model: model || 'default',
    promptLength: prompt.length,
  })

  return downloadImageAsDataUrl(imageUrl)
}

const normalizeDish = (dish = {}, index = 0) => ({
  dishId: toTrimmedString(dish.dishId || dish.id, `dish-${Date.now()}-${index + 1}`),
  name: toTrimmedString(dish.name),
  description: toTrimmedString(dish.description),
  price: Math.max(0, toNumber(dish.price, 0)),
  category: toTrimmedString(dish.category, 'Veg') || 'Veg',
  prepTime: Math.max(0, toNumber(dish.prepTime, 20)),
  available: typeof dish.available === 'boolean' ? dish.available : true,
  servingSize: toTrimmedString(dish.servingSize, '1 person') || '1 person',
  spiceLevel: toTrimmedString(dish.spiceLevel, 'Medium') || 'Medium',
  addOns: toTrimmedString(dish.addOns),
  tags: toStringArray(dish.tags),
  stations: toStringArray(dish.stations),
  imageMode: ['', 'upload', 'ai'].includes(dish.imageMode) ? dish.imageMode : '',
  imageUrl: toTrimmedString(dish.imageUrl),
  sortOrder: Math.max(0, toNumber(dish.sortOrder, index)),
})

const serializeChefMenu = (menu) => ({
  id: String(menu._id),
  createdBy: menu.createdBy ? String(menu.createdBy) : '',
  status: menu.status || DEFAULT_MENU_STATUS,
  lastSavedAt: menu.lastSavedAt,
  publishedAt: menu.publishedAt,
  createdAt: menu.createdAt,
  updatedAt: menu.updatedAt,
  dishes: Array.isArray(menu.dishes)
    ? menu.dishes.map((dish) => ({
        dishId: dish.dishId || '',
        name: dish.name || '',
        description: dish.description || '',
        price: Number.isFinite(dish.price) ? dish.price : 0,
        category: dish.category || 'Veg',
        prepTime: Number.isFinite(dish.prepTime) ? dish.prepTime : 0,
        available: Boolean(dish.available),
        servingSize: dish.servingSize || '',
        spiceLevel: dish.spiceLevel || '',
        addOns: dish.addOns || '',
        tags: Array.isArray(dish.tags) ? dish.tags : [],
        stations: Array.isArray(dish.stations) ? dish.stations : [],
        imageMode: dish.imageMode || '',
        imageUrl: dish.imageUrl || '',
        sortOrder: Number.isFinite(dish.sortOrder) ? dish.sortOrder : 0,
      }))
    : [],
})

const validatePublishableMenu = (dishes) => {
  if (!dishes.length) return 'Add at least one dish before publishing.'

  const invalidDish = dishes.find(
    (dish) =>
      !dish.name ||
      !dish.category ||
      dish.price <= 0 ||
      dish.prepTime <= 0 ||
      !Array.isArray(dish.stations) ||
      dish.stations.length === 0,
  )

  if (!invalidDish) return ''

  if (!invalidDish.name) return 'Every dish must have a name before publishing.'
  if (invalidDish.price <= 0) return 'Every dish must have a valid price before publishing.'
  if (invalidDish.prepTime <= 0) return 'Every dish must have a valid preparation time before publishing.'
  if (!invalidDish.stations.length) return 'Every dish must be assigned to at least one station before publishing.'

  return 'Please complete all dish details before publishing.'
}

const getChefMenuDraft = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const existingMenu = await chefMenu.findOne({ createdBy: chefId })

    if (!existingMenu) {
      return res.status(200).json({
        menu: {
          createdBy: String(chefId),
          status: DEFAULT_MENU_STATUS,
          dishes: [],
          lastSavedAt: null,
          publishedAt: null,
        },
      })
    }

    return res.status(200).json({
      menu: serializeChefMenu(existingMenu),
    })
  } catch (err) {
    console.error('Error occurred while getChefMenuDraft in chefMenu controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const saveChefMenuDraft = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const chefExists = await chefAuth.exists({ _id: chefId })
    if (!chefExists) {
      return res.status(404).json({ message: 'Chef not found' })
    }

    const rawDishes = Array.isArray(req.body?.dishes) ? req.body.dishes : []
    const normalizedDishes = rawDishes.map((dish, index) => normalizeDish(dish, index))
    const nextStatus =
      req.body?.status === 'published' ? 'published' : DEFAULT_MENU_STATUS

    const savedMenu = await chefMenu.findOneAndUpdate(
      { createdBy: chefId },
      {
        createdBy: chefId,
        status: nextStatus,
        dishes: normalizedDishes,
        lastSavedAt: new Date(),
        ...(nextStatus === 'published' ? { publishedAt: new Date() } : {}),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    )

    return res.status(200).json({
      message: nextStatus === 'published' ? 'Chef menu published successfully' : 'Chef menu draft saved successfully',
      menu: serializeChefMenu(savedMenu),
    })
  } catch (err) {
    console.error('Error occurred while saveChefMenuDraft in chefMenu controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getDishPriceGuidance = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!getGeminiApiKey()) {
      return res.status(400).json({ message: 'Gemini price guidance is not configured yet.' })
    }

    const dishName = toTrimmedString(req.body?.name)
    const price = Math.max(0, toNumber(req.body?.price, 0))

    if (!dishName || price <= 0) {
      return res.status(400).json({ message: 'Dish name and price are required for price guidance.' })
    }

    let guidance

    try {
      guidance = await generateDishPriceGuidance(req.body)
    } catch (guidanceErr) {
      geminiLog('price guidance fallback used', {
        dishName,
        status: guidanceErr.response?.status || null,
        message: guidanceErr.message,
      })
      guidance = getFallbackPriceGuidance(req.body)
    }

    return res.status(200).json({ guidance })
  } catch (err) {
    geminiLog('price guidance request failed', {
      message: err.message,
      status: err.response?.status || null,
    })
    console.error('Error occurred while getDishPriceGuidance in chefMenu controller:', err.message)
    return res.status(502).json({ message: 'Unable to check the price right now.' })
  }
}

const publishChefMenu = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const menu = await chefMenu.findOne({ createdBy: chefId })

    if (!menu) {
      return res.status(404).json({ message: 'Menu draft not found' })
    }

    const validationMessage = validatePublishableMenu(menu.dishes || [])
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage })
    }

    menu.status = 'published'
    menu.lastSavedAt = new Date()
    menu.publishedAt = new Date()
    await menu.save()

    return res.status(200).json({
      message: 'Chef menu published successfully',
      menu: serializeChefMenu(menu),
    })
  } catch (err) {
    console.error('Error occurred while publishChefMenu in chefMenu controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const generateDishImage = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const dishName = toTrimmedString(req.body?.name)
    if (!dishName) {
      return res.status(400).json({ message: 'Please enter a dish name first.' })
    }

    pollinationsLog('dish image generation requested', {
      chefId: String(chefId),
      dishName,
      category: toTrimmedString(req.body?.category),
      hasApiKey: Boolean(process.env.POLLINATIONS_API_KEY),
    })

    const imagePrompt = await makeImagePrompt(req.body)
    if (!imagePrompt) {
      pollinationsLog('image prompt generation returned empty text')
      return res.status(502).json({ message: 'Something went wrong. Please upload your own image.' })
    }

    pollinationsLog('image prompt generated', {
      dishName,
      promptLength: imagePrompt.length,
      promptPreview: imagePrompt.slice(0, 140),
    })

    let imageResponse
    let usedImageModel = POLLINATIONS_IMAGE_MODEL
    let finalImageDataUrl = ''

    try {
      imageResponse = await requestPollinationsImage({
        prompt: imagePrompt,
        model: usedImageModel,
      })
    } catch (primaryErr) {
      const primaryDetails = getPollinationsErrorDetails(primaryErr)
      pollinationsLog('primary image generation failed', {
        model: usedImageModel,
        ...primaryDetails,
      })

      if (
        POLLINATIONS_IMAGE_FALLBACK_MODEL &&
        POLLINATIONS_IMAGE_FALLBACK_MODEL !== usedImageModel &&
        shouldRetryPollinationsImage(primaryErr)
      ) {
        usedImageModel = POLLINATIONS_IMAGE_FALLBACK_MODEL
        pollinationsLog('retrying image generation with fallback model', {
          fallbackModel: usedImageModel,
        })

        imageResponse = await requestPollinationsImage({
          prompt: imagePrompt,
          model: usedImageModel,
        })
      } else {
        throw primaryErr
      }
    }

    if (imageResponse) {
      const b64Image = imageResponse.data?.data?.[0]?.b64_json
      const imageUrl = imageResponse.data?.data?.[0]?.url

      pollinationsLog('image generation response received', {
        model: usedImageModel,
        status: imageResponse.status,
        hasBase64: Boolean(b64Image),
        hasUrl: Boolean(imageUrl),
        revisedPromptLength: imageResponse.data?.data?.[0]?.revised_prompt?.length || 0,
      })

      if (b64Image) {
        finalImageDataUrl = `data:image/png;base64,${b64Image}`
      }

      if (!finalImageDataUrl && imageUrl) {
        finalImageDataUrl = await downloadImageAsDataUrl(imageUrl)
      }
    }

    if (!finalImageDataUrl) {
      try {
        pollinationsLog('trying simple image endpoint fallback', {
          model: usedImageModel,
        })
        finalImageDataUrl = await requestSimplePollinationsImage({
          prompt: imagePrompt,
          model: usedImageModel,
        })
      } catch (simpleErr) {
        pollinationsLog('simple image endpoint fallback failed', getPollinationsErrorDetails(simpleErr))
      }
    }

    if (!finalImageDataUrl) {
      pollinationsLog('image generation response had no image payload')
      return res.status(502).json({ message: 'Something went wrong. Please upload your own image.' })
    }

    return res.status(200).json({
      imageUrl: finalImageDataUrl,
      imageMode: 'ai',
      modelUsed: usedImageModel,
    })
  } catch (err) {
    pollinationsLog('image generation failed', getPollinationsErrorDetails(err))
    console.error('Error occurred while generateDishImage in chefMenu controller:', err.message)
    return res.status(502).json({ message: 'Something went wrong. Please upload your own image.' })
  }
}

const generateDishDescription = async (req, res) => {
  try {
    const chefId = req.user?.id

    if (!chefId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const dishName = toTrimmedString(req.body?.name)
    if (!dishName) {
      return res.status(400).json({ message: 'Please enter a dish name first.' })
    }

    pollinationsLog('dish description generation requested', {
      chefId: String(chefId),
      dishName,
      category: toTrimmedString(req.body?.category),
      hasApiKey: Boolean(process.env.POLLINATIONS_API_KEY),
    })

    const description = await makeMenuDescription(req.body)
    if (!description) {
      pollinationsLog('description generation returned empty text')
      return res.status(502).json({ message: 'Unable to generate description right now.' })
    }

    pollinationsLog('description generation finished', {
      dishName,
      descriptionLength: description.length,
      descriptionPreview: description.slice(0, 120),
    })

    return res.status(200).json({ description })
  } catch (err) {
    pollinationsLog('description generation failed', getPollinationsErrorDetails(err))
    console.error('Error occurred while generateDishDescription in chefMenu controller:', err.message)
    return res.status(502).json({ message: 'Unable to generate description right now.' })
  }
}

module.exports = {
  getChefMenuDraft,
  saveChefMenuDraft,
  getDishPriceGuidance,
  publishChefMenu,
  generateDishImage,
  generateDishDescription,
}
