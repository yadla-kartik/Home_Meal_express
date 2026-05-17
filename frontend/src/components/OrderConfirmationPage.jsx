import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, CircleCheckBig, Receipt, UtensilsCrossed } from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import {
  clearOrderConfirmation,
  formatMoney,
  getPaymentMethodLabel,
  readOrderConfirmation,
} from './orderJourney/orderJourneyUtils'

function BillLine({ label, value, strong = false }) {
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

function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order || readOrderConfirmation()

  const handleStartAgain = () => {
    clearOrderConfirmation()
    sessionStorage.removeItem('pnrSessionData')
    sessionStorage.removeItem('pnrSessionInput')
    sessionStorage.removeItem('pnrJourneyStations')
    sessionStorage.removeItem('pnrSelectedStation')
    navigate('/dashboard')
  }

  if (!order) {
    return (
      <div className="theme-page-shell min-h-screen">
        <Navbar />
        <div className="px-4 pb-10 pt-24 sm:px-6">
          <div className="mx-auto max-w-xl">
            <div className="theme-card rounded-[22px] px-5 py-12 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <Receipt size={28} />
              </div>
              <h1 className="mt-5 text-[24px] font-black text-[var(--theme-text)]">Bill not found</h1>
              <p className="mt-2 text-[13px] leading-6 text-[var(--theme-muted)]">
                The final order session was not found. Start a new meal order from the dashboard.
              </p>
              <button
                type="button"
                onClick={handleStartAgain}
                className="theme-primary-button mt-6 inline-flex items-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-bold"
              >
                Start New Order
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-page-shell min-h-screen">
      <Navbar />

      <div className="px-4 pb-10 pt-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="theme-card rounded-[22px] p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 border-b border-[color:var(--theme-surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <CircleCheckBig size={14} />
                  Order Placed
                </div>
                <h1 className="mt-3 text-[24px] font-black text-[var(--theme-text)]">Final Bill</h1>
                <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
                  Invoice {order.invoiceNumber || order.orderId} saved with online payment details.
                </p>
              </div>

              <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-4 py-3 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Paid</p>
                <p className="text-[26px] font-black text-[var(--theme-accent)]">{formatMoney(order.totalAmount)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-3">
                <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">
                        Payment
                      </p>
                      <p className="mt-1 text-[15px] font-black capitalize text-[var(--theme-text)]">
                        {order.paymentStatus || 'Paid'}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      <BadgeCheck size={12} />
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] font-semibold text-[var(--theme-muted)]">
                    Reference: <span className="text-[var(--theme-text)]">{order.paymentReference || 'Processing'}</span>
                  </p>
                </div>

                <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                  <h2 className="text-[17px] font-black text-[var(--theme-text)]">Ordered items</h2>
                  <div className="mt-3 space-y-2.5">
                    {(order.items || []).map((item, index) => (
                      <Motion.div
                        key={`${item.dishId || item.id}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.22 }}
                        className="flex gap-3 rounded-[15px] border border-[color:var(--theme-surface-border)] bg-slate-50/70 p-3"
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-white text-[var(--theme-accent)]">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <UtensilsCrossed size={18} />
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
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/65 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
                    Bill Summary
                  </p>
                  <div className="mt-4 space-y-3">
                    <BillLine label="Subtotal" value={formatMoney(order.subtotal)} />
                    <BillLine label={`Food GST (${Math.round(Number(order.gstRate || 0) * 100)}%)`} value={formatMoney(order.gstAmount)} />
                    <BillLine label="Delivery" value={formatMoney(order.deliveryCharge)} />
                    <div className="h-px bg-[color:var(--theme-surface-border)]" />
                    <BillLine label="Total paid" value={formatMoney(order.totalAmount)} strong />
                  </div>
                </div>

                <div className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Chef</p>
                  <p className="mt-1 text-[14px] font-black text-[var(--theme-text)]">{order.chef?.name || 'Selected chef'}</p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Delivery stop</p>
                  <p className="mt-1 text-[13px] font-bold text-[var(--theme-text)]">
                    {order.selectedStation?.name || order.stationCode || 'Selected station'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartAgain}
                  className="theme-primary-button inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-bold"
                >
                  Order Another Meal
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="theme-soft-button w-full rounded-[16px] px-5 py-3 text-[13px] font-bold"
                >
                  Dashboard
                </button>
              </aside>
            </div>
          </Motion.section>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
