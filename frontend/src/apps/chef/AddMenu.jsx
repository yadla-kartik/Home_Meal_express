import React from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ImagePlus,
  IndianRupee,
  Plus,
  Save,
  Sparkles,
  Tags,
  Trash2,
  UtensilsCrossed,
  Leaf,
  Drumstick,
  Cookie,
  Coffee,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import {
  generateChefDishDescription,
  generateChefDishImage,
  generateChefDishPriceGuidance,
  getChefMenuDraft,
  publishChefMenu,
  saveChefMenuDraft,
} from '../../../services/chefAuthService'

const emptyDish = {
  id: '',
  name: '',
  description: '',
  price: '',
  category: 'Veg',
  prepTime: '20',
  available: true,
  servingSize: '1 person',
  spiceLevel: 'Medium',
  addOns: '',
  tags: ['Homemade'],
  stations: ['Raipur'],
  imageMode: '',
  imageUrl: '',
  priceGuidance: null,
}

const categories = [
  { id: 'Veg', title: 'Veg', desc: 'Pure vegetarian dishes', icon: Leaf },
  { id: 'Non-Veg', title: 'Non-Veg', desc: 'Contains meat or egg', icon: Drumstick },
  { id: 'Snacks', title: 'Snacks', desc: 'Light bites and fast food', icon: Cookie },
  { id: 'Breakfast', title: 'Breakfast', desc: 'Morning specials', icon: Coffee },
  { id: 'Thali', title: 'Thali', desc: 'Complete meal combos', icon: UtensilsCrossed },
]
const spiceLevels = ['Mild', 'Medium', 'Spicy']
const tagOptions = ['Healthy', 'Homemade', 'Low Oil', 'Quick', 'Protein Rich']

const fieldCls = 'theme-input min-h-10 rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium'
const labelCls = 'text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]'

const normalizeDishFromApi = (dish = {}) => ({
  id: dish.dishId || `dish-${Date.now()}`,
  name: dish.name || '',
  description: dish.description || '',
  price: dish.price ? String(dish.price) : '',
  category: dish.category || 'Veg',
  prepTime: dish.prepTime ? String(dish.prepTime) : '20',
  available: typeof dish.available === 'boolean' ? dish.available : true,
  servingSize: dish.servingSize || '1 person',
  spiceLevel: dish.spiceLevel || 'Medium',
  addOns: dish.addOns || '',
  tags: Array.isArray(dish.tags) && dish.tags.length ? dish.tags : ['Homemade'],
  stations: Array.isArray(dish.stations) && dish.stations.length ? dish.stations : ['Raipur'],
  imageMode: dish.imageMode || '',
  imageUrl: dish.imageUrl || '',
  priceGuidance: dish.priceGuidance || null,
})

const toApiDish = (dish, index) => ({
  dishId: dish.id,
  name: dish.name.trim(),
  description: dish.description.trim(),
  price: Number(dish.price || 0),
  category: dish.category,
  prepTime: Number(dish.prepTime || 0),
  available: Boolean(dish.available),
  servingSize: dish.servingSize.trim(),
  spiceLevel: dish.spiceLevel,
  addOns: dish.addOns.trim(),
  tags: Array.isArray(dish.tags) ? dish.tags : [],
  stations: Array.isArray(dish.stations) ? dish.stations : [],
  imageMode: dish.imageMode || '',
  imageUrl: dish.imageUrl || '',
  sortOrder: index,
  priceGuidance: dish.priceGuidance || null,
})

const buildPriceGuidanceSignature = (dish = {}) => {
  const tags = Array.isArray(dish.tags) ? [...dish.tags].sort().join('|') : ''
  return [
    (dish.name || '').trim().toLowerCase(),
    Number(dish.price || 0),
    (dish.category || 'Veg').trim().toLowerCase(),
    (dish.spiceLevel || 'Medium').trim().toLowerCase(),
    (dish.servingSize || '1 person').trim().toLowerCase(),
    tags.toLowerCase(),
  ].join('::')
}

const hasCurrentPriceWarning = (dish = {}) => {
  if (!dish?.priceGuidance?.warningMessage) return false
  if (dish.priceGuidance.status === 'ok') return false
  return dish.priceGuidance.checkedSignature === buildPriceGuidanceSignature(dish)
}

function MenuSavedPopup({ isOpen, onContinue }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.16)] px-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-sm overflow-visible rounded-[26px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,239,0.96))] px-6 pb-6 pt-12 shadow-[0_26px_58px_rgba(15,23,42,0.18)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent)]" />

        <div className="absolute -top-9 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(180deg,#fff6ee,#ffe7d1)] shadow-[0_12px_24px_rgba(249,115,22,0.2)]">
          <CheckCircle2 size={34} className="text-[#16a34a]" />
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-[var(--theme-text)]">
          Menu saved successfully
        </h2>

        <p className="mt-2 text-center text-sm leading-6 text-[var(--theme-muted)]">
          Your menu has been added successfully. Continue to the dashboard to manage the next chef actions.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
          : 'border-slate-200 bg-white text-[var(--theme-muted)] hover:border-[var(--theme-chip-border)]'
      }`}
    >
      {children}
    </button>
  )
}

function DishPreview({ dish, selected, onClick, onRemove }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full rounded-[14px] border p-2 text-left transition ${
        selected
          ? 'border-[var(--theme-accent)] bg-[linear-gradient(180deg,#fffaf4,#fff3e7)] shadow-[0_4px_12px_rgba(249,115,22,0.08)]'
          : 'border-[rgba(249,115,22,0.14)] bg-white hover:-translate-y-0.5 hover:shadow-sm'
      }`}
    >
      <div className="flex gap-2.5 items-center">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#ffffff)] text-[var(--theme-accent)]">
          {dish.imageUrl ? (
            <img src={dish.imageUrl} alt={dish.name || 'Dish'} className="h-full w-full object-cover" />
          ) : (
            <UtensilsCrossed size={16} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[13px] font-bold text-[var(--theme-text)]">
              {dish.name || 'Untitled dish'}
            </h3>
            <span className="shrink-0 font-bold text-[13px] text-[var(--theme-accent)]">
              ₹{dish.price || '0'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[var(--theme-muted)]">
                {dish.category}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-[var(--theme-muted)]">
                {dish.prepTime}m
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className={`text-[10px] font-semibold ${
                dish.available ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {dish.available ? 'Avail' : 'Paused'}
              </span>
            </div>
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation()
                onRemove()
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  event.stopPropagation()
                  onRemove()
                }
              }}
              className="text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 p-0.5"
              title="Remove dish"
            >
              <Trash2 size={13} />
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

function AddMenu() {
  const navigate = useNavigate()
  const fileInputRef = React.useRef(null)
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false)
  const [isGeneratingDescAI, setIsGeneratingDescAI] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [aiImageMessage, setAiImageMessage] = React.useState('')
  const [showSavedPopup, setShowSavedPopup] = React.useState(false)
  const [customTagInput, setCustomTagInput] = React.useState('')
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
  const [dishes, setDishes] = React.useState([])
  const [selectedId, setSelectedId] = React.useState('')
  const [isCheckingPrice, setIsCheckingPrice] = React.useState(false)
  const priceCheckRequestRef = React.useRef(0)
  const selectedDish = dishes.find((dish) => dish.id === selectedId) || dishes[0] || null

  React.useEffect(() => {
    let isMounted = true

    const loadDraft = async () => {
      const res = await getChefMenuDraft()
      if (!isMounted) return

      const nextDishes = Array.isArray(res?.menu?.dishes)
        ? res.menu.dishes.map(normalizeDishFromApi)
        : []

      setDishes(nextDishes)
      setSelectedId(nextDishes[0]?.id || '')
      setIsLoading(false)
    }

    loadDraft()

    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    setAiImageMessage('')
  }, [selectedId])

  React.useEffect(() => {
    if (!selectedDish?.id) {
      setIsCheckingPrice(false)
      return undefined
    }

    const priceValue = Number(selectedDish.price || 0)
    if (!selectedDish.name.trim() || priceValue <= 0) {
      setIsCheckingPrice(false)
      return undefined
    }

    const currentSignature = buildPriceGuidanceSignature(selectedDish)
    if (selectedDish.priceGuidance?.checkedSignature === currentSignature) {
      setIsCheckingPrice(false)
      return undefined
    }

    const requestId = priceCheckRequestRef.current + 1
    priceCheckRequestRef.current = requestId

    const timer = window.setTimeout(async () => {
      setIsCheckingPrice(true)
      const response = await generateChefDishPriceGuidance({
        name: selectedDish.name,
        price: priceValue,
        category: selectedDish.category,
        spiceLevel: selectedDish.spiceLevel,
        servingSize: selectedDish.servingSize,
        tags: selectedDish.tags,
      })

      if (priceCheckRequestRef.current !== requestId) return

      setIsCheckingPrice(false)

      console.log('[AddMenu AI price] response received', {
        dishName: selectedDish.name,
        enteredPrice: priceValue,
        success: Boolean(response?.guidance),
        message: response?.message || '',
        guidance: response?.guidance || null,
      })

      if (!response?.guidance) return

      setDishes((prev) => prev.map((dish) => (
        dish.id === selectedDish.id ? { ...dish, priceGuidance: response.guidance } : dish
      )))
    }, 700)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    selectedDish?.id,
    selectedDish?.name,
    selectedDish?.price,
    selectedDish?.category,
    selectedDish?.spiceLevel,
    selectedDish?.servingSize,
    JSON.stringify(selectedDish?.tags || []),
  ])

  const updateDish = (key, value) => {
    if (!selectedDish) return
    setDishes((prev) => prev.map((dish) => (
      dish.id === selectedDish.id ? { ...dish, [key]: value } : dish
    )))
  }

  const toggleArrayValue = (key, value) => {
    if (!selectedDish) return
    const current = selectedDish[key] || []
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    updateDish(key, next)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAiImageMessage('')
      updateDish('imageUrl', url)
      updateDish('imageMode', 'upload')
    }
  }

  const getSelectedDishPayload = () => {
    if (!selectedDish) return null

    return {
      name: selectedDish.name,
      description: selectedDish.description,
      category: selectedDish.category,
      spiceLevel: selectedDish.spiceLevel,
      tags: selectedDish.tags,
    }
  }

  const handleGenerateAI = async () => {
    if (!selectedDish) return
    if (!selectedDish.name) {
      alert("Please enter a dish name first to generate an AI image.")
      return
    }

    const payload = getSelectedDishPayload()
    console.log('[AddMenu AI image] request started', {
      dishName: payload.name,
      category: payload.category,
      hasDescription: Boolean(payload.description),
    })
    setAiImageMessage('')
    updateDish('imageMode', 'ai')
    setIsGeneratingAI(true)

    const response = await generateChefDishImage(payload)

    setIsGeneratingAI(false)

    console.log('[AddMenu AI image] response received', {
      success: Boolean(response?.imageUrl),
      message: response?.message || '',
      modelUsed: response?.modelUsed || '',
      imageUrlType: response?.imageUrl?.startsWith('data:image') ? 'data-url' : typeof response?.imageUrl,
      imageUrlLength: response?.imageUrl?.length || 0,
    })

    if (!response?.imageUrl) {
      setAiImageMessage(response?.message || 'Something went wrong. Please upload your own image.')
      updateDish('imageMode', '')
      return
    }

    updateDish('imageUrl', response.imageUrl)
    updateDish('imageMode', 'ai')
  }

  const handleGenerateDescriptionAI = async () => {
    if (!selectedDish) return
    if (!selectedDish.name) {
      alert("Please enter a dish name first to generate a description.")
      return
    }

    const payload = getSelectedDishPayload()
    console.log('[AddMenu AI description] request started', {
      dishName: payload.name,
      category: payload.category,
    })
    setIsGeneratingDescAI(true)

    const response = await generateChefDishDescription(payload)

    setIsGeneratingDescAI(false)

    console.log('[AddMenu AI description] response received', {
      success: Boolean(response?.description),
      message: response?.message || '',
      descriptionLength: response?.description?.length || 0,
    })

    if (!response?.description) {
      alert(response?.message || 'Unable to generate description right now.')
      return
    }

    updateDish('description', response.description)
  }

  const addDish = () => {
    const nextDish = {
      ...emptyDish,
      id: `dish-${Date.now()}`,
      name: '',
    }
    setDishes((prev) => [nextDish, ...prev])
    setSelectedId(nextDish.id)
  }

  const removeDish = (dishId) => {
    setDishes((prev) => {
      const next = prev.filter((dish) => dish.id !== dishId)
      if (selectedId === dishId) {
        setSelectedId(next[0]?.id || '')
      }
      return next
    })
  }

  const handleSaveMenu = async () => {
    if (!dishes.length || isSaving) {
      if (!dishes.length) {
        alert('Add at least one dish before saving your menu.')
      }
      return
    }

    setIsSaving(true)

    const draftResponse = await saveChefMenuDraft({
      dishes: dishes.map((dish, index) => toApiDish(dish, index)),
    })

    if (!draftResponse?.menu && !draftResponse?.message?.includes('successfully')) {
      setIsSaving(false)
      alert(draftResponse?.message || 'Unable to save menu draft.')
      return
    }

    const publishResponse = await publishChefMenu()
    setIsSaving(false)

    if (!publishResponse?.menu && !publishResponse?.message?.includes('successfully')) {
      alert(publishResponse?.message || 'Unable to save your menu.')
      return
    }

    setShowSavedPopup(true)
  }

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar isRegistered onRegisterClick={() => navigate('/chef/register')} />

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-8 pt-22 sm:px-6 lg:px-8">
        <section className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/chef/dashboard')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:bg-slate-50 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
          <button
            type="button"
            onClick={addDish}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:scale-105"
          >
            <Plus size={16} />
            Add dish
          </button>
        </section>

        <section className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-accent)]">
                  Menu items
                </p>
                <p className="mt-0.5 text-xs font-medium text-[var(--theme-muted)]">
                  {dishes.length} dish{dishes.length === 1 ? '' : 'es'} added
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveMenu}
                disabled={isLoading || isSaving}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-2 text-[11px] font-semibold text-[var(--theme-accent)] transition hover:border-[var(--theme-accent)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={14} />
                {isSaving ? 'Saving...' : 'Save your menu'}
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {dishes.length ? (
                dishes.map((dish) => (
                  <DishPreview
                    key={dish.id}
                    dish={dish}
                    selected={dish.id === selectedDish?.id}
                    onClick={() => setSelectedId(dish.id)}
                    onRemove={() => removeDish(dish.id)}
                  />
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/45 p-5 text-center">
                  <p className="text-sm font-semibold text-[var(--theme-text)]">No dishes yet</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--theme-muted)]">Add your first dish to start building the menu.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-card)] sm:p-5">
            {isLoading ? (
              <div className="rounded-[22px] border border-dashed border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/45 p-8 text-center">
                <p className="text-sm font-semibold text-[var(--theme-text)]">Loading your menu...</p>
              </div>
            ) : selectedDish ? (
              <div className="grid gap-5">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col gap-3 rounded-[24px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(135deg,#fffaf4,#ffffff)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--theme-chip-border)] bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                      {selectedDish.imageUrl ? (
                        <img
                          src={selectedDish.imageUrl}
                          alt="Dish"
                          className="h-full w-full object-cover"
                          onLoad={() => console.log('[AddMenu AI image] image rendered in preview')}
                          onError={() => {
                            console.log('[AddMenu AI image] preview image failed to load', {
                              imageUrlLength: selectedDish.imageUrl?.length || 0,
                              imageMode: selectedDish.imageMode,
                            })
                            setAiImageMessage('Generated image could not be shown. Please upload your own image.')
                          }}
                        />
                      ) : isGeneratingAI ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent"></div>
                      ) : (
                        <ImagePlus size={22} />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--theme-text)]">Dish image</p>
                      <p className="mt-0.5 text-[11px] leading-5 text-[var(--theme-muted)]">
                        Upload your own image or generate an AI dish image based on name.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ToggleChip active={selectedDish.imageMode === 'upload'} onClick={() => fileInputRef.current?.click()}>
                      Upload
                    </ToggleChip>
                    <ToggleChip active={selectedDish.imageMode === 'ai'} onClick={handleGenerateAI}>
                      <span className="inline-flex items-center gap-1.5">
                        {isGeneratingAI ? 'Generating...' : <><Sparkles size={12} /> AI image</>}
                      </span>
                    </ToggleChip>
                  </div>
                </div>
                {aiImageMessage ? (
                  <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                    {aiImageMessage}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className={labelCls}>Dish name</span>
                    <input className={fieldCls} value={selectedDish.name} onChange={(event) => updateDish('name', event.target.value)} placeholder="Paneer thali" />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Price</span>
                    <div className="theme-input relative flex min-h-10 items-center rounded-[14px] px-3.5 py-2.5 pr-10">
                      <IndianRupee size={14} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent pr-1 text-[13px] font-medium outline-none" value={selectedDish.price} onChange={(event) => updateDish('price', event.target.value.replace(/\D/g, ''))} placeholder="149" />
                      <span className="pointer-events-none absolute right-3 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center">
                        {isCheckingPrice ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent" />
                        ) : null}
                      </span>
                    </div>
                    <div className="min-h-[68px] pt-1">
                      {hasCurrentPriceWarning(selectedDish) ? (
                      <div className="rounded-[16px] border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-600">
                        <p className="inline-flex items-start gap-2 font-semibold">
                          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                          <span>{selectedDish.priceGuidance.warningMessage}</span>
                        </p>
                        {(selectedDish.priceGuidance.suggestedMin || selectedDish.priceGuidance.suggestedMax) ? (
                          <p className="mt-1 pl-6 text-[10px] font-semibold text-red-500">
                            Suggested range: Rs {selectedDish.priceGuidance.suggestedMin || 0} - Rs {selectedDish.priceGuidance.suggestedMax || 0}
                          </p>
                        ) : null}
                      </div>
                      ) : (
                        <div className="invisible rounded-[16px] border border-transparent px-3 py-2.5 text-[11px]">
                          <p className="font-semibold">Price guidance placeholder</p>
                          <p className="mt-1 text-[10px]">Suggested range placeholder</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <div className="grid gap-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className={labelCls}>Description</span>
                      <button
                        type="button"
                        onClick={handleGenerateDescriptionAI}
                        disabled={isGeneratingDescAI}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fffaf4,#ffffff)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-accent)] transition hover:border-[var(--theme-accent)] disabled:opacity-70"
                      >
                        {isGeneratingDescAI ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent"></div>
                        ) : (
                          <Sparkles size={10} />
                        )}
                        {isGeneratingDescAI ? 'Generating...' : 'AI Generate'}
                      </button>
                    </div>
                    <textarea className="theme-input min-h-16 rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium resize-none leading-relaxed" value={selectedDish.description} onChange={(event) => updateDish('description', event.target.value)} placeholder="Briefly describe your dish." />
                  </div>
                  <div className="grid gap-2 relative">
                    <span className={labelCls}>Category</span>
                    
                    {isCategoryOpen && (
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                    )}

                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className={`${fieldCls} flex items-center justify-between bg-white text-left transition hover:border-[var(--theme-accent)] relative z-20`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedDish.category}
                      </span>
                      <ChevronDown size={14} className={`text-[var(--theme-muted)] transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCategoryOpen && (
                      <div className="absolute top-full mt-2 w-full z-30 rounded-[20px] border border-[var(--theme-chip-border)] bg-[#fcfaf8] p-1.5 shadow-[0_12px_32px_rgba(249,115,22,0.1)]">
                        <div className="flex flex-col gap-0.5">
                          {categories.map((cat) => {
                            const Icon = cat.icon
                            const isSelected = selectedDish.category === cat.id
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  updateDish('category', cat.id)
                                  setIsCategoryOpen(false)
                                }}
                                className={`group flex w-full items-center gap-2.5 rounded-[14px] p-2 text-left transition-all ${
                                  isSelected
                                    ? 'bg-white shadow-[0_2px_8px_rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)]'
                                    : 'border border-transparent hover:bg-white hover:border-[rgba(249,115,22,0.1)] hover:shadow-[0_2px_8px_rgba(249,115,22,0.04)]'
                                }`}
                              >
                                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-colors ${isSelected ? 'text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]' : 'text-slate-400 bg-slate-100 group-hover:text-[var(--theme-accent)]'}`}>
                                  <Icon size={15} strokeWidth={isSelected ? 2.5 : 2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[12px] font-bold ${isSelected ? 'text-[var(--theme-text)]' : 'text-slate-600 group-hover:text-[var(--theme-text)]'}`}>{cat.title}</p>
                                  <p className="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">{cat.desc}</p>
                                </div>
                                <ChevronRight size={13} className={`transition-colors ${isSelected ? 'text-[var(--theme-accent)]' : 'text-transparent group-hover:text-slate-300'}`} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="grid gap-2">
                    <span className={labelCls}>Preparation time</span>
                    <div className="theme-input flex min-h-10 items-center gap-2 rounded-[14px] px-3.5 py-2.5">
                      <Clock3 size={14} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent text-[13px] font-medium outline-none" value={selectedDish.prepTime} onChange={(event) => updateDish('prepTime', event.target.value.replace(/\D/g, ''))} placeholder="20" />
                      <span className="text-[11px] font-semibold text-[var(--theme-muted)]">min</span>
                    </div>
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Serving size</span>
                    <input className={fieldCls} value={selectedDish.servingSize} onChange={(event) => updateDish('servingSize', event.target.value)} placeholder="1 person" />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Add-ons</span>
                    <input className={fieldCls} value={selectedDish.addOns} onChange={(event) => updateDish('addOns', event.target.value)} placeholder="Extra roti, curd" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={labelCls}>Spice level</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {spiceLevels.map((level) => (
                        <ToggleChip key={level} active={selectedDish.spiceLevel === level} onClick={() => updateDish('spiceLevel', level)}>
                          {level}
                        </ToggleChip>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={labelCls}>Availability</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ToggleChip active={selectedDish.available} onClick={() => updateDish('available', true)}>Available</ToggleChip>
                      <ToggleChip active={!selectedDish.available} onClick={() => updateDish('available', false)}>Paused</ToggleChip>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4 md:col-span-2">
                    <p className={`${labelCls} inline-flex items-center gap-2`}><Tags size={13} /> Tags</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {Array.from(new Set([...tagOptions, ...(selectedDish.tags || [])])).map((tag) => (
                        <ToggleChip key={tag} active={selectedDish.tags.includes(tag)} onClick={() => toggleArrayValue('tags', tag)}>
                          {tag}
                        </ToggleChip>
                      ))}
                      
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const val = customTagInput.trim()
                        if (val && !(selectedDish.tags || []).includes(val)) {
                          updateDish('tags', [...(selectedDish.tags || []), val])
                        }
                        setCustomTagInput('')
                      }} className="flex items-center gap-1.5 ml-1">
                        <input
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          placeholder="+ Add tag..."
                          className="w-[100px] rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--theme-text)] outline-none transition-all placeholder:text-slate-400 focus:w-[130px] focus:border-[var(--theme-accent)] focus:bg-[var(--theme-accent-soft)]"
                        />
                      </form>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/45 p-8 text-center">
                <p className="text-sm font-semibold text-[var(--theme-text)]">No dishes yet</p>
                <p className="mt-2 text-xs leading-5 text-[var(--theme-muted)]">
                  Add your first dish to start building your menu.
                </p>
                <button
                  type="button"
                  onClick={addDish}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)]"
                >
                  <Plus size={16} />
                  Add first dish
                </button>
              </div>
            )}
          </section>
        </section>
      </main>

      <MenuSavedPopup
        isOpen={showSavedPopup}
        onContinue={() => navigate('/chef/dashboard', { state: { hideChefPopup: true, chefRegistered: true } })}
      />
    </div>
  )
}

export default AddMenu
