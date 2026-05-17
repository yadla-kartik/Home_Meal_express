import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  ChefHat,
  Clock3,
  Loader2,
  PackageCheck,
  ReceiptText,
  Store,
  TrainFront,
  UtensilsCrossed,
} from 'lucide-react'
import Navbar from './Navbar'
import { getChefOrderDetails, getChefOrders } from '../../../services/chefAuthService'
import { formatMoney } from '../../components/orderJourney/orderJourneyUtils'

const statusLabel = (status) => {
  if (status === 'ready_for_pickup') return 'Ready for pickup'
  if (status === 'completed') return 'Completed'
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'preparing') return 'Preparing'
  if (status === 'accepted') return 'Accepted'
  return 'Placed'
}

function BillRow({ label, value, strong = false }) {
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

function ChefOrdersPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [orders, setOrders] = React.useState([])
  const [selectedOrder, setSelectedOrder] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let alive = true

    const load = async () => {
      setLoading(true)
      setError('')

      const response = orderId ? await getChefOrderDetails(orderId) : await getChefOrders('past')
      if (!alive) return

      if (response?.success) {
        if (orderId) {
          setSelectedOrder(response.data)
        } else {
          const nextOrders = Array.isArray(response.data) ? response.data : []
          setOrders(nextOrders)
          setSelectedOrder(nextOrders[0] || null)
        }
      } else {
        setError(response?.message || 'Unable to load chef orders.')
      }

      setLoading(false)
    }

    load()

    return () => {
      alive = false
    }
  }, [orderId])

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar isRegistered />

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-8 pt-22 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/chef/dashboard')}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)] transition hover:bg-[var(--theme-accent)] hover:text-white"
        >
          <ArrowLeft size={13} />
          Dashboard
        </button>

        <section className="rounded-[24px] border border-[var(--theme-surface-border)] bg-white p-5 shadow-[var(--theme-shadow-card)]">
          <div className="flex flex-col gap-3 border-b border-[color:var(--theme-surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                Past Orders
              </p>
              <h1 className="mt-1 text-[24px] font-black text-[var(--theme-text)]">Chef order history</h1>
              <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
                Review completed and ready-for-pickup orders with full bill and meal details.
              </p>
            </div>
            <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-4 py-3 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Orders</p>
              <p className="text-[22px] font-black text-[var(--theme-accent)]">{orderId ? 1 : orders.length}</p>
            </div>
          </div>

          {loading ? (
            <div className="grid min-h-[280px] place-items-center">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--theme-muted)]">
                <Loader2 size={18} className="animate-spin text-orange-500" />
                Loading order history
              </div>
            </div>
          ) : error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : !selectedOrder ? (
            <div className="py-12 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
                <ReceiptText size={28} />
              </div>
              <h2 className="mt-4 text-xl font-black text-[var(--theme-text)]">No past orders yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--theme-muted)]">
                Orders will move here after you mark them ready for pickup.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-[330px_minmax(0,1fr)]">
              {!orderId ? (
                <aside className="space-y-2">
                  {orders.map((order) => (
                    <button
                      key={order.orderId}
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full rounded-[18px] border p-3 text-left transition ${
                        selectedOrder?.orderId === order.orderId
                          ? 'border-orange-300 bg-orange-50/70'
                          : 'border-[color:var(--theme-surface-border)] bg-white hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[var(--theme-text)]">{order.invoiceNumber || order.orderId}</p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[var(--theme-muted)]">
                            {statusLabel(order.chefStatus)}
                          </p>
                        </div>
                        <p className="text-sm font-black text-[var(--theme-accent)]">{formatMoney(order.totalAmount)}</p>
                      </div>
                    </button>
                  ))}
                </aside>
              ) : null}

              <div className={orderId ? 'lg:col-span-2' : ''}>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-4">
                    <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                            <BadgeCheck size={12} />
                            {statusLabel(selectedOrder.chefStatus)}
                          </div>
                          <h2 className="mt-3 text-[20px] font-black text-[var(--theme-text)]">{selectedOrder.invoiceNumber || selectedOrder.orderId}</h2>
                          <p className="mt-1 text-[12px] font-semibold text-[var(--theme-muted)]">PNR {selectedOrder.pnr}</p>
                        </div>
                        <p className="text-[24px] font-black text-[var(--theme-accent)]">{formatMoney(selectedOrder.totalAmount)}</p>
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                      <h3 className="text-[17px] font-black text-[var(--theme-text)]">Meal items</h3>
                      <div className="mt-3 space-y-2.5">
                        {(selectedOrder.items || []).map((item, index) => (
                          <div key={`${item.dishId}-${index}`} className="flex gap-3 rounded-[15px] border border-[color:var(--theme-surface-border)] bg-slate-50/70 p-3">
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
                              <p className={`mt-1 text-[11px] font-bold ${item.isPrepared ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {item.isPrepared ? 'Prepared' : 'Not marked done'}
                              </p>
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
                        <p className="flex items-center gap-2"><TrainFront size={15} className="text-[var(--theme-accent)]" /> {selectedOrder.trainName || 'Train journey'}</p>
                        <p className="flex items-center gap-2"><Store size={15} className="text-[var(--theme-accent)]" /> {selectedOrder.selectedStation?.name || selectedOrder.selectedStation?.code || 'Selected station'}</p>
                        <p className="flex items-center gap-2"><ChefHat size={15} className="text-[var(--theme-accent)]" /> {selectedOrder.chef?.kitchenName || selectedOrder.chef?.name || 'Kitchen'}</p>
                        <p className="flex items-center gap-2"><Clock3 size={15} className="text-[var(--theme-accent)]" /> {selectedOrder.readyForPickupAt ? new Date(selectedOrder.readyForPickupAt).toLocaleString() : 'Pickup status pending'}</p>
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/65 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">Bill Summary</p>
                      <div className="mt-4 space-y-3">
                        <BillRow label="Subtotal" value={formatMoney(selectedOrder.subtotal)} />
                        <BillRow label={`Food GST (${Math.round(Number(selectedOrder.gstRate || 0) * 100)}%)`} value={formatMoney(selectedOrder.gstAmount)} />
                        <BillRow label="Delivery" value={formatMoney(selectedOrder.deliveryCharge)} />
                        <div className="h-px bg-[color:var(--theme-surface-border)]" />
                        <BillRow label="Total" value={formatMoney(selectedOrder.totalAmount)} strong />
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ChefOrdersPage
