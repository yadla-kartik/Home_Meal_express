import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, Clock3, PackageCheck, ReceiptText, RefreshCcw, UtensilsCrossed } from 'lucide-react'
import { getUserOrders } from '../../services/userAuthService'
import { formatMoney, getPaymentMethodLabel } from './orderJourney/orderJourneyUtils'

const getOrderProgress = (order) => {
  if (order?.orderStatus === 'cancelled') return { label: 'Cancelled', percent: 100, tone: 'rose' }
  if (order?.chefStatus === 'ready_for_pickup') return { label: 'Ready for pickup', percent: 80, tone: 'orange' }
  if (order?.chefStatus === 'preparing') return { label: 'Preparing', percent: 55, tone: 'orange' }
  if (order?.chefStatus === 'accepted') return { label: 'Chef accepted', percent: 40, tone: 'orange' }
  if (order?.orderStatus === 'placed') return { label: 'Order placed', percent: 35, tone: 'orange' }
  if (order?.paymentStatus === 'paid') return { label: 'Payment received', percent: 25, tone: 'orange' }
  return { label: 'Payment pending', percent: 12, tone: 'slate' }
}

function DashboardOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const loadOrders = React.useCallback(async () => {
    setLoading(true)
    setError('')

    const response = await getUserOrders()
    if (response?.success) {
      setOrders(Array.isArray(response.data) ? response.data : [])
    } else {
      setError(response?.message || 'Unable to load your orders.')
    }

    setLoading(false)
  }, [])

  React.useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto w-full max-w-6xl px-3 pb-16"
    >
      <div className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-white/92 p-4 shadow-[var(--theme-shadow-card)] sm:p-5">
        <div className="flex flex-col gap-3 border-b border-[color:var(--theme-surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
              Meal Orders
            </p>
            <h2 className="mt-1 text-[22px] font-black text-[var(--theme-text)]">Your recent orders</h2>
            <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
              Track your latest meal orders and open the full order details when needed.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="theme-soft-button inline-flex w-fit items-center gap-2 rounded-[14px] px-4 py-2 text-[12px] font-bold disabled:opacity-60"
          >
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid gap-3 py-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-[18px] bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
            {error}
          </div>
        ) : !orders.length ? (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
              <ReceiptText size={24} />
            </div>
            <h3 className="mt-4 text-[18px] font-black text-[var(--theme-text)]">No orders yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-[12.5px] leading-5 text-[var(--theme-muted)]">
              Once you place a meal order, it will appear here with live status and details.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {orders.map((order, index) => {
              const firstItem = order.items?.[0]
              const progress = getOrderProgress(order)

              return (
                <Motion.button
                  key={order.orderId}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.24 }}
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                  className="group rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-3 text-left shadow-[var(--theme-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--theme-chip-border)] hover:shadow-[var(--theme-shadow-card)]"
                >
                  <div className="flex gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-slate-50 text-[var(--theme-accent)]">
                      {firstItem?.imageUrl ? (
                        <img src={firstItem.imageUrl} alt={firstItem.name} className="h-full w-full object-cover" />
                      ) : (
                        <UtensilsCrossed size={22} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-black text-[var(--theme-text)]">
                            {firstItem?.name || 'Meal order'}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[var(--theme-muted)]">
                            {order.totalItems} item{order.totalItems > 1 ? 's' : ''} from {order.chef?.name || 'Home chef'}
                          </p>
                        </div>
                        <p className="shrink-0 text-[15px] font-black text-[var(--theme-accent)]">
                          {formatMoney(order.totalAmount)}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--theme-muted)]">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                          <PackageCheck size={12} />
                          {progress.label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                          <Clock3 size={12} />
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${progress.tone === 'rose' ? 'bg-rose-500' : progress.tone === 'orange' ? 'bg-[var(--theme-accent)]' : 'bg-slate-400'}`}
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[color:var(--theme-surface-border)] pt-3">
                    <p className="text-[11px] font-semibold text-[var(--theme-muted)]">
                      Invoice {order.invoiceNumber || order.orderId}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-black text-[var(--theme-accent)]">
                      Details
                      <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Motion.button>
              )
            })}
          </div>
        )}
      </div>
    </Motion.section>
  )
}

export default DashboardOrders
