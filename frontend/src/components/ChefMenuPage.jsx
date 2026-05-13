import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  UtensilsCrossed,
  MapPin,
  ChefHat,
  Clock,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Heart,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import {
  getStationChefMenu,
  createJourneyOrder,
} from '../../services/userAuthService'

const PNR_DATA_SESSION_KEY = 'pnrSessionData'
const PNR_INPUT_SESSION_KEY = 'pnrSessionInput'
const SELECTED_STATION_SESSION_KEY = 'pnrSelectedStation'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function OrderSavedPopup({ orderMeta, onClose, onBack }) {
  if (!orderMeta) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.2)] px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-sm rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_26px_58px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={30} />
        </div>

        <h2 className="mt-4 text-center text-xl font-black text-slate-900">Order Saved</h2>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Your journey order has been saved in the backend. Payment can continue from the next step when you wire it in.
        </p>

        <div className="mt-4 rounded-[18px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
          <p className="font-black text-slate-700">Order ID</p>
          <p className="mt-1 break-all font-semibold text-orange-500">{orderMeta.orderId}</p>
          <p className="mt-2 text-[12px] font-semibold text-slate-500">
            {orderMeta.totalItems} items • Rs {orderMeta.subtotal}
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Back to stations
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            Stay here
          </button>
        </div>
      </div>
    </div>
  )
}

function ChefMenuPage() {
  const { stationCode, chefId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [chef, setChef] = React.useState(null)
  const [menuItems, setMenuItems] = React.useState([])
  const [cart, setCart] = React.useState({})
  const [activeCategory, setActiveCategory] = React.useState('All Items')
  const [loading, setLoading] = React.useState(true)
  const [savingOrder, setSavingOrder] = React.useState(false)
  const [error, setError] = React.useState('')
  const [savedOrder, setSavedOrder] = React.useState(null)

  const pnrData = location.state?.pnrData
    || JSON.parse(sessionStorage.getItem(PNR_DATA_SESSION_KEY) || 'null')
  const selectedStation = location.state?.selectedStation
    || JSON.parse(sessionStorage.getItem(SELECTED_STATION_SESSION_KEY) || 'null')
    || { code: stationCode, name: stationCode }

  React.useEffect(() => {
    let isMounted = true

    const loadChefMenu = async () => {
      setLoading(true)
      setError('')

      const response = await getStationChefMenu(stationCode, chefId, selectedStation?.name || stationCode)

      if (!isMounted) return

      if (!response?.success) {
        setError(response?.message || 'Unable to load chef menu.')
        setLoading(false)
        return
      }

      setChef(response?.data?.chef || null)
      setMenuItems(Array.isArray(response?.data?.menuItems) ? response.data.menuItems : [])
      setLoading(false)
    }

    loadChefMenu()

    return () => {
      isMounted = false
    }
  }, [stationCode, chefId, selectedStation?.name])

  const addToCart = (item) =>
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))

  const removeFromCart = (item) =>
    setCart((prev) => {
      const next = { ...prev }
      if (next[item.id] > 1) next[item.id] -= 1
      else delete next[item.id]
      return next
    })

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const totalPrice = menuItems.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0)

  const handlePlaceOrder = async () => {
    if (!pnrData?.trainNumber) {
      setError('PNR session expired. Please search your PNR again.')
      return
    }

    if (!totalItems) return

    setSavingOrder(true)
    const pnrInput = sessionStorage.getItem(PNR_INPUT_SESSION_KEY) || pnrData?.pnr || ''

    const response = await createJourneyOrder({
      pnr: pnrInput,
      pnrData,
      stationCode,
      chefId,
      items: menuItems
        .filter((item) => cart[item.id])
        .map((item) => ({
          dishId: item.id,
          quantity: cart[item.id],
        })),
    })

    setSavingOrder(false)

    if (!response?.success) {
      setError(response?.message || 'Unable to save your journey order.')
      return
    }

    setSavedOrder(response?.data || null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-16">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 size={26} className="animate-spin text-orange-500" />
            <p className="text-sm font-semibold text-slate-500">Loading chef menu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !chef) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4 pt-16">
          <div className="max-w-sm text-center">
            <p className="text-lg font-black text-slate-800">Chef menu unavailable</p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const categories = ['All Items', ...new Set(menuItems.map((item) => item.category))]
  const filteredCategories = activeCategory === 'All Items' ? categories.slice(1) : [activeCategory]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="pb-20 pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2 border-b border-slate-100 py-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 transition-colors hover:text-orange-500 sm:text-[11px]"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                <span>BACK</span>
              </button>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[9px]">Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:text-rose-500 sm:h-8 sm:w-8">
                <Heart size={14} />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:text-blue-500 sm:h-8 sm:w-8">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-4 md:flex-row">
            <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white shadow-md sm:h-14 sm:w-14 sm:text-xl">
                {chef?.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-center gap-1.5 sm:justify-start">
                  <h1 className="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg">{chef?.name}'s Kitchen</h1>
                  <div className="rounded border border-orange-200 bg-orange-100 px-1 py-0.5 text-[6px] font-black uppercase tracking-widest text-orange-600 sm:text-[7px]">
                    Home Chef
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] font-bold text-slate-400 sm:justify-start sm:text-[10px]">
                  <span className="flex items-center gap-1"><MapPin size={9} className="text-rose-500" /> {selectedStation?.name} ({stationCode})</span>
                  <span className="hidden h-0.5 w-0.5 rounded-full bg-slate-300 sm:block" />
                  <span className="flex items-center gap-1"><UtensilsCrossed size={9} className="text-orange-500" /> {chef?.specialty}</span>
                </div>
              </div>

              <div className="flex w-full justify-center gap-1.5 sm:w-auto">
                <div className="flex min-w-[60px] items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1">
                  <Star size={10} className="text-amber-500" fill="currentColor" />
                  <span className="text-[10px] font-black text-slate-800 sm:text-[11px]">{chef?.rating}</span>
                </div>
                <div className="flex min-w-[60px] items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-800 sm:text-[11px]">{chef?.prepTime || '35m'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-16 z-20 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="scrollbar-hide no-scrollbar flex items-center gap-4 overflow-x-auto py-2.5 sm:gap-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative shrink-0 px-1 text-[9px] font-black uppercase tracking-wider transition-all sm:text-[10px] ${
                    activeCategory === category ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {category}
                  {activeCategory === category ? (
                    <Motion.div layoutId="activeCat" className="absolute -bottom-[10px] left-0 right-0 h-0.5 rounded-full bg-orange-500" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {error}
            </div>
          ) : null}

          <div className="space-y-6 sm:space-y-8">
            {filteredCategories.map((category) => (
              <div key={category}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 sm:text-[11px]">{category}</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {menuItems.filter((item) => item.category === category).map((item, index) => (
                    <Motion.div
                      key={item.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.02 }}
                      className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2 transition-all duration-200 hover:border-orange-200 hover:shadow-sm"
                    >
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50 text-slate-200">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <UtensilsCrossed size={20} className="opacity-20" />
                        )}

                        {index === 0 ? (
                          <div className="absolute left-0 right-0 top-0 bg-orange-500 py-0.5 text-center">
                            <span className="text-[4px] font-black uppercase text-white">TOP</span>
                          </div>
                        ) : null}

                        <div className={`absolute bottom-0.5 left-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-sm border bg-white ${
                          item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                        }`}>
                          <div className={`h-1 w-1 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                      </div>

                      <div className="flex h-14 min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h3 className="truncate text-[10px] font-black leading-tight text-slate-800 sm:text-[11px]">{item.name}</h3>
                          <p className="line-clamp-1 text-[8px] font-medium leading-tight text-slate-400 sm:text-[9px]">{item.desc}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-black text-slate-900 sm:text-[12px]">Rs {item.price}</p>

                          <div className="relative">
                            <AnimatePresence mode="wait">
                              {cart[item.id] ? (
                                <Motion.div
                                  key="counter"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex items-center gap-1 rounded-md border border-slate-900 bg-white p-0.5"
                                >
                                  <button onClick={() => removeFromCart(item)} className="flex h-4 w-4 items-center justify-center rounded text-slate-900 hover:bg-slate-50">
                                    <Minus size={8} strokeWidth={3} />
                                  </button>
                                  <span className="min-w-[10px] text-center text-[9px] font-black text-slate-900">{cart[item.id]}</span>
                                  <button onClick={() => addToCart(item)} className="flex h-4 w-4 items-center justify-center rounded bg-slate-900 text-white hover:bg-slate-800">
                                    <Plus size={8} strokeWidth={3} />
                                  </button>
                                </Motion.div>
                              ) : (
                                <button onClick={() => addToCart(item)} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[8px] font-black text-emerald-600 transition-all hover:border-slate-900 hover:text-slate-900">
                                  ADD
                                </button>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {totalItems > 0 ? (
          <Motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed inset-x-4 bottom-2 z-50 flex justify-center"
          >
            <div className="flex w-full max-w-xl items-center justify-between rounded-lg border border-white/5 bg-slate-950 p-2 pr-3 shadow-2xl">
              <div className="flex flex-col pl-3">
                <p className="text-[6px] font-black uppercase tracking-widest text-slate-500">{totalItems} ITEMS</p>
                <p className="text-sm font-black text-white">Rs {totalPrice}</p>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={savingOrder}
                className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-2 text-[10px] font-black text-white shadow-lg transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingOrder ? <Loader2 size={12} className="animate-spin" /> : 'SAVE ORDER'}
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>

      <OrderSavedPopup
        orderMeta={savedOrder}
        onClose={() => setSavedOrder(null)}
        onBack={() => navigate(`/pnr/${sessionStorage.getItem(PNR_INPUT_SESSION_KEY) || pnrData?.pnr || ''}`)}
      />
    </div>
  )
}

export default ChefMenuPage
