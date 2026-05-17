import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  NotebookPen,
  Package,
  PackageCheck,
  ShoppingBag,
  Store,
  User,
  UtensilsCrossed,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  acceptChefOrder,
  getChefOrders,
  markChefOrderItemDone,
  markChefOrderReadyForPickup,
} from '../../../../services/chefAuthService'
import { getChefSocket } from '../../../../services/socket'
import { formatMoney } from '../../../components/orderJourney/orderJourneyUtils'

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

const getPassengerLabel = (order) => {
  const firstPassenger = order?.passengers?.[0]
  if (!firstPassenger) return 'Passenger'

  return [firstPassenger.coach, firstPassenger.berth].filter(Boolean).join(' - ') || 'Passenger'
}

const getChefStatusLabel = (status) => {
  if (status === 'accepted') return 'Accepted'
  if (status === 'preparing') return 'Preparing'
  if (status === 'ready_for_pickup') return 'Ready for pickup'
  if (status === 'completed') return 'Completed'
  if (status === 'cancelled') return 'Cancelled'
  return 'New request'
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
              <PackageCheck size={40} />
            </div>

            <h3 className="text-2xl font-black tracking-tight text-[var(--theme-text)]">Ready for pickup</h3>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--theme-muted)]">
              This order has moved to past orders and is ready for the delivery pickup flow.
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
  const navigate = useNavigate()
  const [activeOrders, setActiveOrders] = useState([])
  const [pastOrders, setPastOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')
  const [showCompletePopup, setShowCompletePopup] = useState(false)

  const selectedOrder = activeOrders.find((order) => order.orderId === selectedOrderId) || activeOrders[0] || null

  const upsertActiveOrder = (order) => {
    if (!order?.orderId) return

    setActiveOrders((prev) => {
      if (['ready_for_pickup', 'completed', 'cancelled'].includes(order.chefStatus)) {
        return prev.filter((item) => item.orderId !== order.orderId)
      }

      const exists = prev.some((item) => item.orderId === order.orderId)
      const next = exists
        ? prev.map((item) => (item.orderId === order.orderId ? order : item))
        : [order, ...prev]
      return next
    })

    if (['ready_for_pickup', 'completed', 'cancelled'].includes(order.chefStatus)) {
      setPastOrders((prev) => {
        const exists = prev.some((item) => item.orderId === order.orderId)
        return exists ? prev.map((item) => (item.orderId === order.orderId ? order : item)) : [order, ...prev]
      })
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    setError('')

    const [activeRes, pastRes] = await Promise.all([
      getChefOrders('active'),
      getChefOrders('past'),
    ])

    if (activeRes?.success) {
      const nextActive = Array.isArray(activeRes.data) ? activeRes.data : []
      setActiveOrders(nextActive)
      setSelectedOrderId((current) => current || nextActive[0]?.orderId || '')
    } else {
      setError(activeRes?.message || 'Unable to load live orders.')
    }

    if (pastRes?.success) {
      setPastOrders(Array.isArray(pastRes.data) ? pastRes.data : [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    const socket = getChefSocket()

    const handleNewOrder = (order) => {
      upsertActiveOrder(order)
      setSelectedOrderId(order?.orderId || '')
    }
    const handleOrderUpdate = (order) => {
      upsertActiveOrder(order)
    }

    socket.on('chef:new-order', handleNewOrder)
    socket.on('chef:order-updated', handleOrderUpdate)
    socket.on('chef:order-ready-for-pickup', handleOrderUpdate)

    return () => {
      socket.off('chef:new-order', handleNewOrder)
      socket.off('chef:order-updated', handleOrderUpdate)
      socket.off('chef:order-ready-for-pickup', handleOrderUpdate)
    }
  }, [])

  const allItemsDone = useMemo(() => {
    if (!selectedOrder?.items?.length) return false
    return selectedOrder.items.every((item) => item.isPrepared)
  }, [selectedOrder])

  const isOrderAccepted = ['accepted', 'preparing'].includes(selectedOrder?.chefStatus)

  const handleAccept = async (orderId) => {
    setActionLoading(`accept:${orderId}`)
    const response = await acceptChefOrder(orderId)
    setActionLoading('')

    if (response?.success) {
      upsertActiveOrder(response.data)
      setSelectedOrderId(response.data.orderId)
    } else {
      setError(response?.message || 'Unable to accept order.')
    }
  }

  const handleItemDone = async (orderId, itemIndex) => {
    setActionLoading(`item:${orderId}:${itemIndex}`)
    const response = await markChefOrderItemDone(orderId, itemIndex)
    setActionLoading('')

    if (response?.success) {
      upsertActiveOrder(response.data)
    } else {
      setError(response?.message || 'Unable to mark item done.')
    }
  }

  const handleReadyForPickup = async (orderId) => {
    setActionLoading(`ready:${orderId}`)
    const response = await markChefOrderReadyForPickup(orderId)
    setActionLoading('')

    if (response?.success) {
      upsertActiveOrder(response.data)
      setSelectedOrderId('')
      setShowCompletePopup(true)
    } else {
      setError(response?.message || 'Unable to mark order ready.')
    }
  }

  return (
    <motion.section
      className="w-full py-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <CompletePopup isOpen={showCompletePopup} onClose={() => setShowCompletePopup(false)} />

      <div className="grid gap-5">
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
                Your kitchen is <span className="text-orange-500">ready for orders</span>.
              </h2>
              <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[var(--theme-muted)]">
                Paid customer orders now appear here in real time as soon as checkout is completed.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Menu dishes</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">{dishCount}</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Live orders</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">{activeOrders.length}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/chef/orders')}
                  className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-100/70"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Past orders</p>
                  <p className="text-sm font-black text-[var(--theme-text)]">{pastOrders.length}</p>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:min-w-[240px]">
              <Link
                to="/chef/menu"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-[var(--theme-shadow-button)] transition hover:bg-orange-600 active:scale-95"
              >
                Edit menu
                <NotebookPen size={14} />
              </Link>
              <button
                type="button"
                onClick={loadOrders}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-2.5 text-[10px] font-bold text-orange-700"
              >
                <PackageCheck size={14} />
                Refresh orders
              </button>
            </div>
          </div>
        </motion.div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid min-h-[320px] place-items-center rounded-[28px] border border-[var(--theme-surface-border)] bg-white">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--theme-muted)]">
              <Loader2 size={18} className="animate-spin text-orange-500" />
              Loading live orders
            </div>
          </div>
        ) : !activeOrders.length ? (
          <div className="rounded-[28px] border border-[var(--theme-surface-border)] bg-white p-10 text-center shadow-[var(--theme-shadow-card)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
              <ShoppingBag size={28} />
            </div>
            <h3 className="mt-4 text-xl font-black text-[var(--theme-text)]">No live orders right now</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--theme-muted)]">
              New paid orders will appear here instantly when customers place an order from your kitchen.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Live Requests</p>
                  <h3 className="mt-1 text-lg font-black text-[var(--theme-text)]">Order Summary</h3>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-600">
                  {activeOrders.length} Active
                </span>
              </div>

              <div className="grid gap-3">
                {activeOrders.map((order) => (
                  <button
                    key={order.orderId}
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className={`group relative flex items-center justify-between overflow-hidden rounded-[22px] border p-4 transition-all duration-300 ${
                      selectedOrder?.orderId === order.orderId
                        ? 'translate-x-1 border-orange-500 bg-orange-50/40 shadow-md'
                        : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                        selectedOrder?.orderId === order.orderId ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'
                      }`}>
                        <ShoppingBag size={18} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                            {order.invoiceNumber || order.orderId.slice(-6)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                          <span className={`text-[9px] font-bold ${order.chefStatus === 'new' ? 'text-slate-400' : 'text-emerald-600'}`}>
                            {getChefStatusLabel(order.chefStatus)}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[var(--theme-text)]">{getPassengerLabel(order)}</h4>
                      </div>
                    </div>
                    {order.chefStatus !== 'new' ? (
                      <div className="rounded-full bg-emerald-100 p-1 text-emerald-600">
                        <Check size={12} />
                      </div>
                    ) : (
                      <ChevronRight size={16} className={`transition-transform ${selectedOrder?.orderId === order.orderId ? 'translate-x-1 text-orange-500' : 'text-slate-300'}`} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedOrder && (
                <motion.div
                  key={selectedOrder.orderId}
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
                        <h3 className="text-lg font-black text-[var(--theme-text)]">{selectedOrder.invoiceNumber || selectedOrder.orderId}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Total Bill</p>
                      <p className="text-lg font-black text-emerald-600">{formatMoney(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <div className="mb-1.5 flex items-center gap-2">
                          <User size={12} className="text-orange-500" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Passenger</span>
                        </div>
                        <p className="text-sm font-black text-[var(--theme-text)]">{getPassengerLabel(selectedOrder)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <div className="mb-1.5 flex items-center gap-2">
                          <Clock3 size={12} className="text-orange-500" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Status</span>
                        </div>
                        <p className="text-sm font-black text-[var(--theme-text)]">{getChefStatusLabel(selectedOrder.chefStatus)}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Package size={14} className="text-orange-500" />
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-[var(--theme-text)]">Meal Items</h4>
                      </div>
                      <div className="space-y-3">
                        {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                          <div key={`${item.dishId}-${index}`} className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              {isOrderAccepted && (
                                <button
                                  type="button"
                                  disabled={item.isPrepared || actionLoading === `item:${selectedOrder.orderId}:${index}`}
                                  onClick={() => handleItemDone(selectedOrder.orderId, index)}
                                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed ${
                                    item.isPrepared
                                      ? 'bg-emerald-500 text-white shadow-sm'
                                      : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                                  }`}
                                >
                                  {item.isPrepared ? (
                                    <>
                                      <Check size={10} strokeWidth={4} />
                                      Done
                                    </>
                                  ) : actionLoading === `item:${selectedOrder.orderId}:${index}` ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : (
                                    'Mark Done'
                                  )}
                                </button>
                              )}
                              <span className="grid h-5 w-5 place-items-center rounded-md bg-orange-50 text-[10px] font-black text-orange-600">{item.quantity}x</span>
                              <span className={`truncate text-xs font-bold transition-colors ${item.isPrepared ? 'text-slate-400 line-through italic' : 'text-slate-600'}`}>
                                {item.name}
                              </span>
                            </div>
                            <span className="shrink-0 text-xs font-black text-[var(--theme-text)]">
                              {formatMoney(item.lineTotal || Number(item.price || 0) * Number(item.quantity || 0))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <Store size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Delivery Point</p>
                        <p className="text-xs font-bold text-[var(--theme-text)]">
                          {selectedOrder.selectedStation?.name || selectedOrder.selectedStation?.code || 'Selected station'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {isOrderAccepted ? (
                        <motion.button
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          disabled={!allItemsDone || actionLoading === `ready:${selectedOrder.orderId}`}
                          onClick={() => handleReadyForPickup(selectedOrder.orderId)}
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[11px] font-black uppercase tracking-wider text-white shadow-lg transition-all active:scale-95
                            ${allItemsDone
                              ? 'bg-orange-500 shadow-orange-200 hover:-translate-y-0.5 hover:bg-orange-600'
                              : 'cursor-not-allowed bg-slate-300 opacity-70 shadow-none'}`}
                        >
                          {actionLoading === `ready:${selectedOrder.orderId}` ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Ready for pickup
                        </motion.button>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-500 transition hover:bg-red-50 hover:text-red-500">
                            <XCircle size={16} />
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(selectedOrder.orderId)}
                            disabled={actionLoading === `accept:${selectedOrder.orderId}`}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 active:scale-95 disabled:opacity-60"
                          >
                            {actionLoading === `accept:${selectedOrder.orderId}` ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
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
        )}
      </div>
    </motion.section>
  )
}

export default ChefLiveWorkspace
