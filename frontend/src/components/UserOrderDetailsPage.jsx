import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  ArrowLeft,
  BadgeCheck,
  ChefHat,
  Clock3,
  Loader2,
  MapPin,
  PackageCheck,
  ReceiptText,
  TrainFront,
  UtensilsCrossed,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import { getUserOrderDetails, userCookieCheck } from '../../services/userAuthService'
import { getUserSocket } from '../../services/socket'
import { formatMoney, getPaymentMethodLabel } from './orderJourney/orderJourneyUtils'

const getActiveStep = (order) => {
  if (order?.orderStatus === 'cancelled') return -1
  if (order?.deliveryStatus === 'delivered' || order?.orderStatus === 'completed') return 4
  if (order?.deliveryStatus === 'picked_up' || order?.orderStatus === 'out_for_delivery') return 3
  if (order?.chefStatus === 'ready_for_pickup') return 3
  if (order?.chefStatus === 'prepared' || order?.preparedAt) return 2
  if (order?.chefStatus === 'preparing') return 2
  if (order?.chefStatus === 'accepted') return 1
  if (order?.orderStatus === 'placed') return 0
  if (order?.paymentStatus === 'paid') return 0
  return 0
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? 'text-[15px] font-black text-[var(--theme-text)]' : 'text-[13px] font-semibold text-[var(--theme-muted)]'}>
        {label}
      </span>
      <span className={strong ? 'text-[22px] font-black text-[var(--theme-accent)]' : 'text-[14px] font-black text-[var(--theme-text)]'}>
        {value}
      </span>
    </div>
  )
}

function UserOrderDetailsPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const statusSteps = React.useMemo(() => [
    { key: 'placed', label: 'Order placed' },
    { key: 'chef', label: 'Chef accepted' },
    {
      key: 'prepared',
      label: order?.chefStatus === 'preparing' && !order?.preparedAt ? 'Preparing' : 'Prepared',
    },
    {
      key: 'delivery',
      label: order?.chefStatus === 'ready_for_pickup' && order?.deliveryStatus !== 'picked_up'
        ? 'Ready pickup'
        : 'Out for delivery',
    },
    { key: 'delivered', label: 'Delivered' },
  ], [order?.chefStatus, order?.preparedAt, order?.deliveryStatus])

  React.useEffect(() => {
    let alive = true

    const loadOrder = async () => {
      setLoading(true)
      setError('')

      const response = await getUserOrderDetails(orderId)
      if (!alive) return

      if (response?.success) {
        setOrder(response.data)
      } else {
        setError(response?.message || 'Unable to load order details.')
      }

      setLoading(false)
    }

    loadOrder()

    return () => {
      alive = false
    }
  }, [orderId])

  React.useEffect(() => {
    let mounted = true
    let socket = null

    const connectUserSocket = async () => {
      const response = await userCookieCheck()
      const userId = response?.user?._id || response?.user?.id
      if (!mounted || !userId) return

      socket = getUserSocket()
      const joinUserRoom = () => socket.emit('join-user-room', userId)

      socket.on('connect', joinUserRoom)
      socket.connect()
      if (socket.connected) {
        joinUserRoom()
      }

      const handleOrderUpdate = (payload) => {
        const nextOrder = payload?.order || payload
        if (String(nextOrder?.orderId || nextOrder?.id || '') === String(orderId)) {
          setOrder((current) => ({ ...(current || {}), ...nextOrder }))
        }
      }

      socket.on('user:order-updated', handleOrderUpdate)

      return () => {
        socket.off('connect', joinUserRoom)
        socket.off('user:order-updated', handleOrderUpdate)
      }
    }

    let cleanupPromise = connectUserSocket()

    return () => {
      mounted = false
      Promise.resolve(cleanupPromise).then((cleanup) => {
        if (typeof cleanup === 'function') cleanup()
      })
    }
  }, [orderId])

  const activeStep = getActiveStep(order)

  return (
    <div className="theme-page-shell min-h-screen">
      <Navbar />

      <div className="px-4 pb-10 pt-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)] transition hover:bg-[var(--theme-accent)] hover:text-white"
          >
            <ArrowLeft size={13} />
            Dashboard
          </button>

          {loading ? (
            <div className="theme-card grid min-h-[320px] place-items-center rounded-[22px]">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--theme-muted)]">
                <Loader2 size={17} className="animate-spin" />
                Loading order details
              </div>
            </div>
          ) : error ? (
            <div className="theme-card rounded-[22px] p-6 text-center">
              <h1 className="text-[24px] font-black text-[var(--theme-text)]">Order not found</h1>
              <p className="mt-2 text-[13px] leading-6 text-[var(--theme-muted)]">{error}</p>
            </div>
          ) : (
            <Motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="theme-card rounded-[22px] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 border-b border-[color:var(--theme-surface-border)] pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    <BadgeCheck size={13} />
                    {order.orderStatus || 'Placed'}
                  </div>
                  <h1 className="mt-3 text-[24px] font-black text-[var(--theme-text)]">Order Details</h1>
                  <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
                    Invoice {order.invoiceNumber || order.orderId} · PNR {order.pnr}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-4 py-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Total</p>
                  <p className="text-[26px] font-black text-[var(--theme-accent)]">{formatMoney(order.totalAmount)}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                    <h2 className="text-[17px] font-black text-[var(--theme-text)]">Order progress</h2>
                    <div className="mt-4 grid gap-2 sm:grid-cols-5">
                      {statusSteps.map((step, index) => {
                        const isActive = index <= activeStep

                        return (
                          <div
                            key={step.key}
                            className={`rounded-[14px] border px-3 py-2 ${
                              isActive
                                ? 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                                : 'border-[color:var(--theme-surface-border)] bg-slate-50 text-[var(--theme-muted)]'
                            }`}
                          >
                            <p className="text-[10px] font-black uppercase tracking-[0.1em]">Step {index + 1}</p>
                            <p className="mt-1 text-[12px] font-bold leading-4">{step.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                    <h2 className="text-[17px] font-black text-[var(--theme-text)]">Dishes</h2>
                    <div className="mt-3 space-y-2.5">
                      {(order.items || []).map((item, index) => (
                        <div
                          key={`${item.dishId || item.id}-${index}`}
                          className="flex gap-3 rounded-[15px] border border-[color:var(--theme-surface-border)] bg-slate-50/70 p-3"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white text-[var(--theme-accent)]">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <UtensilsCrossed size={20} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-[14px] font-black text-[var(--theme-text)]">{item.name}</p>
                                <p className="mt-0.5 text-[11px] text-[var(--theme-muted)]">
                                  Qty {item.quantity} - {item.category || 'Meal'}
                                </p>
                              </div>
                              <p className="shrink-0 text-[13px] font-black text-[var(--theme-text)]">
                                {formatMoney(item.lineTotal || Number(item.price || 0) * Number(item.quantity || 0))}
                              </p>
                            </div>
                            {item.description ? (
                              <p className="mt-1 line-clamp-2 text-[11.5px] leading-5 text-[var(--theme-muted)]">{item.description}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="space-y-3">
                  <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Trip basics</p>
                    <div className="mt-3 space-y-3 text-[13px] font-bold text-[var(--theme-text)]">
                      <p className="flex items-center gap-2"><TrainFront size={15} className="text-[var(--theme-accent)]" /> {order.trainName || 'Train journey'}</p>
                      <p className="flex items-center gap-2"><MapPin size={15} className="text-[var(--theme-accent)]" /> {order.selectedStation?.name || order.stationCode || 'Selected station'}</p>
                      <p className="flex items-center gap-2"><ChefHat size={15} className="text-[var(--theme-accent)]" /> {order.chef?.name || 'Home chef'}</p>
                      <p className="flex items-center gap-2"><Clock3 size={15} className="text-[var(--theme-accent)]" /> {order.dateOfJourney || 'Journey date'}</p>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Payment</p>
                    <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      <PackageCheck size={12} />
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                    <p className="mt-3 text-[12px] font-semibold text-[var(--theme-muted)]">
                      Reference: <span className="text-[var(--theme-text)]">{order.paymentReference || 'Processing'}</span>
                    </p>
                    {order.paymentUpiId ? (
                      <p className="mt-1 text-[12px] font-semibold text-[var(--theme-muted)]">
                        UPI: <span className="text-[var(--theme-text)]">{order.paymentUpiId}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/65 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">Bill Summary</p>
                    <div className="mt-4 space-y-3">
                      <SummaryRow label="Subtotal" value={formatMoney(order.subtotal)} />
                      <SummaryRow label={`Food GST (${Math.round(Number(order.gstRate || 0) * 100)}%)`} value={formatMoney(order.gstAmount)} />
                      <SummaryRow label="Delivery" value={formatMoney(order.deliveryCharge)} />
                      <div className="h-px bg-[color:var(--theme-surface-border)]" />
                      <SummaryRow label="Total" value={formatMoney(order.totalAmount)} strong />
                    </div>
                  </div>
                </aside>
              </div>
            </Motion.section>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserOrderDetailsPage
