import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import {
  getDeliveryOrderDetails,
  markDeliveryOrderDelivered,
  markDeliveryOrderPickedUp,
} from '../../../services/deliveryAuthService'
import { getDeliverySocket } from '../../../services/socket'
import { formatMoney } from '../../components/orderJourney/orderJourneyUtils'

const getDeliveryStep = (order) => {
  if (order?.deliveryStatus === 'delivered' || order?.orderStatus === 'completed') return 2
  if (order?.deliveryStatus === 'picked_up' || order?.orderStatus === 'out_for_delivery') return 1
  return 0
}

function DeliveryOrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [actionLoading, setActionLoading] = React.useState(false)
  const [contactText, setContactText] = React.useState('')

  const deliveryStep = getDeliveryStep(order)
  const orderItems = Array.isArray(order?.itemList) ? order.itemList : []

  React.useEffect(() => {
    let alive = true

    const loadOrder = async () => {
      setLoading(true)
      setError('')

      const response = await getDeliveryOrderDetails(orderId)
      if (!alive) return

      if (response?.success) {
        setOrder(response.data)
      } else {
        setError(response?.message || 'Unable to load delivery order.')
      }

      setLoading(false)
    }

    loadOrder()

    return () => {
      alive = false
    }
  }, [orderId])

  React.useEffect(() => {
    const socket = getDeliverySocket()

    const handleOrderUpdate = (payload) => {
      const nextOrder = payload?.order || payload
      if (String(nextOrder?.id || nextOrder?.orderId || '') === String(orderId)) {
        setOrder((current) => ({ ...(current || {}), ...nextOrder }))
      }
    }

    socket.on('delivery:order-updated', handleOrderUpdate)

    return () => {
      socket.off('delivery:order-updated', handleOrderUpdate)
    }
  }, [orderId])

  React.useEffect(() => {
    if (deliveryStep === 2) {
      const timer = setTimeout(() => {
        navigate('/delivery/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [deliveryStep, navigate])

  const handleAction = async () => {
    if (!order?.id || actionLoading || deliveryStep >= 2) return

    setActionLoading(true)
    setError('')
    const response = deliveryStep === 0
      ? await markDeliveryOrderPickedUp(order.id)
      : await markDeliveryOrderDelivered(order.id)
    setActionLoading(false)

    if (response?.success) {
      setOrder(response.data)
    } else {
      setError(response?.message || 'Unable to update delivery status.')
    }
  }

  const handleContactClick = () => {
    setContactText(order?.customerPhone || order?.customerEmail || order?.customerContact || 'Contact not available')
  }

  return (
    <div className="min-h-screen bg-[var(--theme-body-bg)]">
      <Navbar isRegistered={true} deliveryName="Nayan" />

      <main className="mx-auto max-w-3xl px-4 pb-12 pt-24">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/delivery/dashboard')}
          className="group mb-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-accent)]"
        >
          <ChevronLeft size={14} />
          Dashboard
        </motion.button>

        {loading ? (
          <div className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-10 shadow-[var(--theme-shadow-soft)]">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--theme-muted)]">
              <Loader2 size={17} className="animate-spin" />
              Loading delivery order
            </div>
          </div>
        ) : error && !order ? (
          <div className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-8 text-center shadow-[var(--theme-shadow-soft)]">
            <h1 className="text-xl font-black text-[var(--theme-text)]">Order not found</h1>
            <p className="mt-2 text-sm font-semibold text-[var(--theme-muted)]">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
              >
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--theme-accent)]">Live Task</p>
                    <h1 className="mt-0.5 text-xl font-black tracking-tight text-[var(--theme-text)]">
                      Order #{order.invoiceNumber || order.id}
                    </h1>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${deliveryStep === 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {deliveryStep === 0 ? 'Ready to pickup' : deliveryStep === 1 ? 'Out for delivery' : 'Delivered'}
                  </span>
                </div>

                <div className="relative mt-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-12px)] before:w-[1.5px] before:bg-slate-50 before:content-['']">
                  <div className="relative flex gap-4">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${deliveryStep >= 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'} shadow-sm transition-colors duration-500`}>
                      {deliveryStep >= 1 ? <ShieldCheck size={16} /> : <Store size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">Pickup From</p>
                      <h3 className="text-[13px] font-bold text-[var(--theme-text)]">{order.restaurant}</h3>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">{order.kitchenAddress}</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${deliveryStep === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'} shadow-sm transition-colors duration-500`}>
                      {deliveryStep === 2 ? <CheckCircle2 size={16} /> : <Bike size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">Drop To</p>
                      <h3 className="text-[13px] font-bold text-[var(--theme-text)]">
                        {order.trainName} {order.trainNumber ? `(${order.trainNumber})` : ''}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{order.drop || order.customerSeat}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Package size={16} className="text-[var(--theme-accent)]" />
                  <h2 className="text-sm font-black text-[var(--theme-text)]">Order Items</h2>
                </div>
                <div className="space-y-2">
                  {orderItems.map((item, i) => (
                    <div key={`${item.dishId || item.name}-${i}`} className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-[var(--theme-accent)]">{item.quantity || 1}x</span>
                        <p className="text-[12px] font-bold text-[var(--theme-text)]">{item.name}</p>
                      </div>
                      <p className="text-[12px] font-black text-[var(--theme-text)]">
                        {formatMoney(item.lineTotal || Number(item.price || 0) * Number(item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                  {!orderItems.length ? (
                    <div className="rounded-xl bg-slate-50/70 p-3 text-[12px] font-bold text-[var(--theme-muted)]">
                      No order items found.
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-[var(--theme-muted)]">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-[var(--theme-text)]">{order.customer || 'Passenger'}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Passenger</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleContactClick}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-50 py-2.5 text-[var(--theme-accent)] transition hover:bg-orange-100"
                  >
                    <Phone size={14} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Call</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-[var(--theme-text)] transition hover:bg-slate-100">
                    <MessageCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Chat</span>
                  </button>
                </div>
                {contactText ? (
                  <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-[var(--theme-text)]">
                    {contactText}
                  </p>
                ) : null}
              </motion.div>

              <motion.div className="rounded-[22px] bg-[var(--theme-text)] p-5 text-white shadow-lg">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-400">Your Earning</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <h2 className="text-2xl font-black">{order.earningPrice || order.amount}</h2>
                  <span className="text-[10px] font-medium text-slate-400">Fixed</span>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider">Verified Payout</span>
                </div>
              </motion.div>

              <motion.button
                layout
                onClick={handleAction}
                disabled={actionLoading || deliveryStep === 2}
                className={`flex w-full items-center justify-center gap-2 rounded-[18px] py-4 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-lg transition-all active:scale-95 disabled:cursor-default disabled:opacity-80 ${
                  deliveryStep === 0
                    ? 'bg-[var(--theme-accent)] hover:bg-orange-600'
                    : deliveryStep === 1
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-emerald-600'
                }`}
              >
                {deliveryStep === 0 ? (
                  <>{actionLoading ? 'Updating...' : 'Order Picked up'} <ArrowRight size={14} /></>
                ) : deliveryStep === 1 ? (
                  <>{actionLoading ? 'Updating...' : 'Order Delivered'} <CheckCircle2 size={14} /></>
                ) : (
                  <>Completed <ShieldCheck size={14} /></>
                )}
              </motion.button>

              {error ? (
                <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DeliveryOrderDetails
