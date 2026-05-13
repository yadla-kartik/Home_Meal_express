export const ORDER_DRAFT_SESSION_KEY = 'hmeOrderDraft'
export const ORDER_CONFIRMATION_SESSION_KEY = 'hmeOrderConfirmation'
export const FOOD_GST_RATE = 0.05
export const DELIVERY_CHARGE = 30
export const DEFAULT_PAYMENT_MODE = 'online'
export const DEFAULT_PAYMENT_PROVIDER = 'demo_gateway'

export const ONLINE_PAYMENT_OPTIONS = [
  {
    id: 'upi',
    title: 'UPI',
    subtitle: 'Fastest for train orders',
    description: 'Pay instantly using any UPI app linked to your account.',
  },
  {
    id: 'card',
    title: 'Cards',
    subtitle: 'Debit or credit card',
    description: 'Secure checkout using your saved or new card details later.',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'Direct bank payment',
    description: 'Continue with your bank login in the next integration step.',
  },
]

const hasWindow = () => typeof window !== 'undefined'

export const roundCurrency = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100

export const formatMoney = (value) => {
  const amount = Number(value || 0)
  const hasDecimals = Math.abs(amount % 1) > 0

  return `Rs ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}

export const calculateOrderSummary = (items = []) => {
  const normalizedItems = Array.isArray(items) ? items : []
  const totalItems = normalizedItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
  const subtotal = roundCurrency(
    normalizedItems.reduce((sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 0), 0),
  )
  const gstAmount = roundCurrency(subtotal * FOOD_GST_RATE)
  const totalAmount = roundCurrency(subtotal + gstAmount + DELIVERY_CHARGE)

  return {
    totalItems,
    subtotal,
    gstRate: FOOD_GST_RATE,
    gstAmount,
    deliveryCharge: DELIVERY_CHARGE,
    totalAmount,
    currency: 'INR',
  }
}

export const buildDraftItemsFromMenu = (menuItems = [], cart = {}) =>
  menuItems
    .filter((item) => Number(cart[item.id] || 0) > 0)
    .map((item) => ({
      dishId: item.id,
      name: item.name,
      description: item.desc || '',
      price: Number(item.price || 0),
      quantity: Number(cart[item.id] || 0),
      category: item.category || 'Main Course',
      imageUrl: item.imageUrl || '',
      isVeg: Boolean(item.isVeg),
      servingSize: item.servingSize || '',
      spiceLevel: item.spiceLevel || '',
    }))

export const buildCartStateFromDraft = (draft) => {
  if (!draft?.items?.length) return {}

  return draft.items.reduce((accumulator, item) => {
    const dishId = item?.dishId || item?.id
    if (!dishId) return accumulator

    accumulator[dishId] = Math.max(1, Number(item?.quantity || 1))
    return accumulator
  }, {})
}

const readSessionValue = (key) => {
  if (!hasWindow()) return null

  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeSessionValue = (key, value) => {
  if (!hasWindow()) return
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

const removeSessionValue = (key) => {
  if (!hasWindow()) return
  window.sessionStorage.removeItem(key)
}

export const readOrderDraft = () => readSessionValue(ORDER_DRAFT_SESSION_KEY)

export const writeOrderDraft = (draft) => {
  if (!draft) return

  const items = Array.isArray(draft.items) ? draft.items : []
  writeSessionValue(ORDER_DRAFT_SESSION_KEY, {
    ...draft,
    items,
    summary: calculateOrderSummary(items),
  })
}

export const clearOrderDraft = () => removeSessionValue(ORDER_DRAFT_SESSION_KEY)

export const readOrderConfirmation = () => readSessionValue(ORDER_CONFIRMATION_SESSION_KEY)

export const writeOrderConfirmation = (order) => {
  if (!order) return
  writeSessionValue(ORDER_CONFIRMATION_SESSION_KEY, order)
}

export const clearOrderConfirmation = () => removeSessionValue(ORDER_CONFIRMATION_SESSION_KEY)

export const doesDraftMatchRoute = (draft, stationCode, chefId) =>
  String(draft?.stationCode || '').toUpperCase() === String(stationCode || '').toUpperCase()
  && String(draft?.chefId || '') === String(chefId || '')

export const getPaymentMethodLabel = (method) => {
  const match = ONLINE_PAYMENT_OPTIONS.find((option) => option.id === method)
  return match?.title || 'Online Payment'
}
