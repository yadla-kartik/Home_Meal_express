import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  CookingPot,
  MapPinned,
  NotebookPen,
  PackageCheck,
  ShoppingBag,
  TimerReset,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Package,
  User,
  Zap,
  ChevronRight,
  Navigation,
  Store,
  Check,
  Bike,
  ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'

const tempOrders = [
  {
    id: 'ORD-101',
    customer: 'Aarav Sharma',
    coach: 'B2',
    seat: '31',
    items: [
      { name: 'Veg Thali', qty: 2, price: '₹320' },
      { name: 'Masala Chaas', qty: 1, price: '₹40' }
    ],
    station: 'Raipur Junction',
    deliveryIn: '18 min',
    total: '360',
    status: 'New Request',
  },
  {
    id: 'ORD-102',
    customer: 'Nisha Verma',
    coach: 'S4',
    seat: '14',
    items: [
      { name: 'Breakfast Combo', qty: 1, price: '₹149' }
    ],
    station: 'Durg',
    deliveryIn: '32 min',
    total: '149',
    status: 'New Request',
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function CompletePopup({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/20 bg-white p-8 text-center shadow-[0_32px_80px_rgba(0,0,0,0.2)]"
          >
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-500 shadow-sm">
              <div className="relative">
                <ShieldCheck size={40} />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white border-4 border-white"
                >
                  <Check size={14} strokeWidth={4} />
                </motion.div>
              </div>
            </div>
            
            <h3 className="text-2xl font-black tracking-tight text-[var(--theme-text)]">Order Ready!</h3>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--theme-muted)]">
              Great job! The delivery boy will <span className="font-bold text-[var(--theme-accent)]">shortly contact you</span> for the pickup.
            </p>
            
            <button
              onClick={onClose}
              className="mt-8 w-full rounded-2xl bg-orange-500 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ChefLiveWorkspace({ dishCount = 0 }) {
  const [selectedOrder, setSelectedOrder] = useState(tempOrders[0])
  const [acceptedOrders, setAcceptedOrders] = useState(new Set())
  const [checkedItems, setCheckedItems] = useState({}) 
  const [showCompletePopup, setShowCompletePopup] = useState(false)

  const handleAccept = (id) => {
    const next = new Set(acceptedOrders)
    next.add(id)
    setAcceptedOrders(next)
  }

  const toggleItem = (orderId, index) => {
    setCheckedItems(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [index]: !prev[orderId]?.[index]
      }
    }))
  }

  const allItemsChecked = useMemo(() => {
    if (!selectedOrder || !selectedOrder.items) return false
    const orderChecks = checkedItems[selectedOrder.id] || {}
    return selectedOrder.items.every((_, i) => orderChecks[i])
  }, [selectedOrder, checkedItems])

  const isOrderAccepted = acceptedOrders.has(selectedOrder?.id)

  return (
    <motion.section
      className="w-full py-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <CompletePopup isOpen={showCompletePopup} onClose={() => setShowCompletePopup(false)} />
      
      <div className="grid gap-5">
        {/* Sleek Top Banner */}
        <motion.div
          variants={itemVariants}
          className="rounded-[24px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-700">
                <BadgeCheck size={12} />
                Kitchen live
              </div>

              <h2 className="mt-3 text-xl font-black tracking-tight text-[var(--theme-text)] sm:text-2xl">
                Orders lene ke liye <span className="text-orange-500">ready ho</span>.
              </h2>
              <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[var(--theme-muted)]">
                Your menu is saved, your chef profile is approved, and the dashboard is now ready to surface live meal requests.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Menu dishes</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">{dishCount}</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Order state</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">Ready</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Stations</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">Active</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:min-w-[240px]">
              <Link
                to="/chef/menu"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-[var(--theme-shadow-button)] transition hover:bg-orange-600 active:scale-95"
              >
                Manage menu
                <NotebookPen size={14} />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-2.5 text-[10px] font-bold text-orange-700">
                <PackageCheck size={14} />
                Orders section unlocked
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two-Column Action Layout */}
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: Summary of Orders */}
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">New Requests</p>
                <h3 className="mt-1 text-lg font-black text-[var(--theme-text)]">Order Summary</h3>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-600">
                {tempOrders.length} Active
              </span>
            </div>

            <div className="grid gap-3">
              {tempOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-[22px] border p-4 transition-all duration-300 ${
                    selectedOrder?.id === order.id
                      ? 'border-orange-500 bg-orange-50/40 shadow-md translate-x-1'
                      : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'
                    }`}>
                      <ShoppingBag size={18} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-orange-500">{order.id}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className={`text-[9px] font-bold ${acceptedOrders.has(order.id) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {acceptedOrders.has(order.id) ? 'Preparing' : `${order.deliveryIn} left`}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[var(--theme-text)]">{order.customer}</h4>
                    </div>
                  </div>
                  {acceptedOrders.has(order.id) ? (
                    <div className="rounded-full bg-emerald-100 p-1 text-emerald-600">
                      <Check size={12} />
                    </div>
                  ) : (
                    <ChevronRight size={16} className={`transition-transform ${selectedOrder?.id === order.id ? 'text-orange-500 translate-x-1' : 'text-slate-300'}`} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Selected Order Details */}
          <AnimatePresence mode="wait">
            {selectedOrder && (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
              >
                <div className="flex items-center justify-between border-b border-slate-50 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-500 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Selected Request</p>
                      <h3 className="text-lg font-black text-[var(--theme-text)]">{selectedOrder.id}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Total Payout</p>
                    <p className="text-lg font-black text-emerald-600">₹{selectedOrder.total}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {/* Customer & Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <User size={12} className="text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Passenger</span>
                      </div>
                      <p className="text-sm font-black text-[var(--theme-text)]">{selectedOrder.customer}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Navigation size={12} className="text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Coach/Seat</span>
                      </div>
                      <p className="text-sm font-black text-[var(--theme-text)]">{selectedOrder.coach} - {selectedOrder.seat}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package size={14} className="text-orange-500" />
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[var(--theme-text)]">Meal Items</h4>
                    </div>
                    <div className="space-y-3">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isOrderAccepted && (
                              <button
                                onClick={() => toggleItem(selectedOrder.id, i)}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                                  checkedItems[selectedOrder.id]?.[i]
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                                }`}
                              >
                                {checkedItems[selectedOrder.id]?.[i] ? (
                                  <>
                                    <Check size={10} strokeWidth={4} />
                                    Done
                                  </>
                                ) : (
                                  'Mark Done'
                                )}
                              </button>
                            )}
                            <span className="grid h-5 w-5 place-items-center rounded-md bg-orange-50 text-[10px] font-black text-orange-600">{item.qty}x</span>
                            <span className={`text-xs font-bold transition-colors ${checkedItems[selectedOrder.id]?.[i] ? 'text-slate-400 line-through italic' : 'text-slate-600'}`}>
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-black text-[var(--theme-text)]">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <Store size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Delivery Point</p>
                      <p className="text-xs font-bold text-[var(--theme-text)]">{selectedOrder.station}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    {isOrderAccepted ? (
                      <motion.button
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        disabled={!allItemsChecked}
                        onClick={() => setShowCompletePopup(true)}
                        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[11px] font-black uppercase tracking-wider text-white transition-all active:scale-95 shadow-lg
                          ${allItemsChecked 
                            ? 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 shadow-orange-200' 
                            : 'bg-slate-300 cursor-not-allowed opacity-70 shadow-none'}`}
                      >
                        <CheckCircle2 size={16} />
                        Ready to be picked up
                      </motion.button>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500 transition hover:bg-red-50 hover:text-red-500">
                          <XCircle size={16} />
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(selectedOrder.id)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:-translate-y-0.5 active:scale-95"
                        >
                          <CheckCircle2 size={16} />
                          Accept Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

export default ChefLiveWorkspace
