import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Heart,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import { getStationChefMenu, saveOrderDraft } from '../../services/userAuthService'
import {
  buildCartStateFromDraft,
  buildDraftItemsFromMenu,
  calculateOrderSummary,
  clearOrderConfirmation,
  clearOrderDraft,
  doesDraftMatchRoute,
  formatMoney,
  readOrderDraft,
  writeOrderDraft,
} from './orderJourney/orderJourneyUtils'

const PNR_DATA_SESSION_KEY = 'pnrSessionData'
const PNR_INPUT_SESSION_KEY = 'pnrSessionInput'
const SELECTED_STATION_SESSION_KEY = 'pnrSelectedStation'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
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
  const [error, setError] = React.useState('')

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

      const nextChef = response?.data?.chef || null
      const nextMenuItems = Array.isArray(response?.data?.menuItems) ? response.data.menuItems : []
      const existingDraft = readOrderDraft()

      setChef(nextChef)
      setMenuItems(nextMenuItems)
      saveOrderDraft({
        pnr: sessionStorage.getItem(PNR_INPUT_SESSION_KEY) || pnrData?.pnr || '',
        pnrData,
        selectedStation,
        chefId,
        chef: nextChef,
        menuItems: nextMenuItems,
        currentStep: 'menu',
      })
      setCart(
        doesDraftMatchRoute(existingDraft, stationCode, chefId)
          ? buildCartStateFromDraft(existingDraft)
          : {},
      )
      setLoading(false)
    }

    loadChefMenu()

    return () => {
      isMounted = false
    }
  }, [stationCode, chefId, selectedStation?.name])

  React.useEffect(() => {
    if (!chef || !pnrData) return

    const items = buildDraftItemsFromMenu(menuItems, cart)
    const existingDraft = readOrderDraft()

    if (!items.length) {
      if (doesDraftMatchRoute(existingDraft, stationCode, chefId)) {
        clearOrderDraft()
      }
      return
    }

    clearOrderConfirmation()
    const summary = calculateOrderSummary(items)
    writeOrderDraft({
      pnrInput: sessionStorage.getItem(PNR_INPUT_SESSION_KEY) || pnrData?.pnr || '',
      pnrData,
      stationCode,
      chefId,
      selectedStation,
      chef,
      items,
      payment: doesDraftMatchRoute(existingDraft, stationCode, chefId) ? existingDraft?.payment : undefined,
    })
    saveOrderDraft({
      pnr: sessionStorage.getItem(PNR_INPUT_SESSION_KEY) || pnrData?.pnr || '',
      pnrData,
      selectedStation,
      chefId,
      chef,
      menuItems,
      cartItems: items,
      billing: summary,
      currentStep: 'menu',
      payment: doesDraftMatchRoute(existingDraft, stationCode, chefId) ? existingDraft?.payment : undefined,
    })
  }, [cart, chef, menuItems, pnrData, selectedStation, stationCode, chefId])

  const addToCart = (item) =>
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))

  const removeFromCart = (item) =>
    setCart((prev) => {
      const next = { ...prev }
      if (next[item.id] > 1) next[item.id] -= 1
      else delete next[item.id]
      return next
    })

  const draftItems = buildDraftItemsFromMenu(menuItems, cart)
  const summary = calculateOrderSummary(draftItems)

  const handleReviewCart = () => {
    if (!summary.totalItems) return
    navigate(`/station/${stationCode}/chef/${chefId}/cart`)
  }

  if (loading) {
    return (
      <div className="theme-page-shell min-h-screen">
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
      <div className="theme-page-shell min-h-screen">
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
    <div className="theme-page-shell min-h-screen">
      <Navbar />

      <div className="pb-24 pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2 border-b border-slate-100 py-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-[var(--theme-accent)] hover:text-white sm:text-[11px]"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                <span>Back</span>
              </button>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[9px]">Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:text-rose-500 sm:h-8 sm:w-8">
                <Heart size={14} />
              </button>
              <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:text-blue-500 sm:h-8 sm:w-8">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(135deg,rgba(255,248,241,0.98),rgba(255,255,255,0.96))] p-5 shadow-[var(--theme-shadow-card)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-slate-900 text-xl font-black text-white shadow-md">
                  {chef?.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                    <h1 className="truncate text-xl font-black tracking-tight text-slate-900">{chef?.name}'s Kitchen</h1>
                    <div className="rounded border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-orange-600">
                      Home Chef
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-slate-400 sm:justify-start">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-rose-500" />
                      {selectedStation?.name} ({stationCode})
                    </span>
                    <span className="hidden h-0.5 w-0.5 rounded-full bg-slate-300 sm:block" />
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed size={10} className="text-orange-500" />
                      {chef?.specialty}
                    </span>
                  </div>
                </div>

                <div className="flex w-full justify-center gap-2 sm:w-auto">
                  <div className="flex min-w-[74px] items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <Star size={12} className="text-amber-500" fill="currentColor" />
                    <span className="text-[11px] font-black text-slate-800">{chef?.rating}</span>
                  </div>
                  <div className="flex min-w-[74px] items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-[11px] font-black text-slate-800">{chef?.prepTime || '35m'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="sticky top-20 z-20 mt-5 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="scrollbar-hide no-scrollbar inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-2xl border border-[color:var(--theme-surface-border)] bg-white/95 px-2 py-2 align-middle shadow-[var(--theme-shadow-soft)] backdrop-blur-md sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative inline-flex h-9 shrink-0 items-center justify-center rounded-xl px-3 text-[9px] font-semibold uppercase tracking-[0.12em] transition-all sm:text-[10px] ${
                    activeCategory === category
                      ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                      : 'text-[var(--theme-muted)] hover:bg-slate-50 hover:text-[var(--theme-text)]'
                  }`}
                >
                  {category}
                  {activeCategory === category ? (
                    <Motion.div layoutId="activeCat" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[var(--theme-accent)]" />
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
                      className="group flex min-h-[74px] items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 transition-all duration-200 hover:border-[var(--theme-chip-border)] hover:shadow-sm"
                    >
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-50 text-slate-200">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <UtensilsCrossed size={20} className="opacity-20" />
                        )}
                      </div>

                      <div className="flex min-h-14 min-w-0 flex-1 flex-col justify-center">
                        <div>
                          <div className="flex min-w-0 items-center gap-1.5 leading-none">
                            <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border bg-white ${
                              item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            </span>
                            <h3 className="truncate text-[10px] font-black leading-tight text-slate-800 sm:text-[11px]">{item.name}</h3>
                          </div>
                          <p className="mt-1.5 line-clamp-1 text-[8px] font-medium leading-tight text-slate-400 sm:text-[9px]">{item.desc}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-[11px] font-black text-slate-900 sm:text-[12px]">{formatMoney(item.price)}</p>

                          <div className="relative flex items-center">
                            <AnimatePresence mode="wait">
                              {cart[item.id] ? (
                                <Motion.div
                                  key="counter"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex h-9 items-center gap-1 rounded-lg border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] p-1 shadow-[var(--theme-shadow-soft)]"
                                >
                                  <button type="button" onClick={() => removeFromCart(item)} className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--theme-accent)] transition hover:bg-white">
                                    <Minus size={10} strokeWidth={3} />
                                  </button>
                                  <span className="min-w-[18px] text-center text-[11px] font-black text-[var(--theme-text)]">{cart[item.id]}</span>
                                  <button type="button" onClick={() => addToCart(item)} className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--theme-accent)] text-white transition hover:opacity-90">
                                    <Plus size={10} strokeWidth={3} />
                                  </button>
                                </Motion.div>
                              ) : (
                                <button type="button" onClick={() => addToCart(item)} className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--theme-chip-border)] bg-white px-4 text-[10px] font-black text-[var(--theme-accent)] transition-all hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)]">
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
        {summary.totalItems > 0 ? (
          <Motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed inset-x-4 bottom-3 z-50 flex justify-center"
          >
            <div className="flex w-full max-w-2xl items-center justify-between gap-3 rounded-[24px] border border-[var(--theme-chip-border)] bg-white/95 p-3 pr-4 shadow-[var(--theme-shadow-card)] backdrop-blur-xl">
              <div className="flex items-center gap-3 pl-1">
                <div className="grid h-11 w-11 place-items-center rounded-[16px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                  <ShoppingBag size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-semibold text-[var(--theme-muted)]">
                    {summary.totalItems} items in cart
                  </p>
                  <p className="text-base font-bold text-[var(--theme-text)]">{formatMoney(summary.subtotal)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReviewCart}
                className="theme-primary-button flex items-center gap-2 rounded-[16px] px-5 py-3 text-[12px] font-semibold text-white transition hover:-translate-y-0.5 active:scale-95"
              >
                Review cart
                <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default ChefMenuPage
