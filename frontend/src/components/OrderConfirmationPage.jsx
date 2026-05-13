import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  CircleCheckBig,
  CreditCard,
  MapPin,
  Receipt,
  TrainFront,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import {
  clearOrderConfirmation,
  formatMoney,
  getPaymentMethodLabel,
  readOrderConfirmation,
} from './orderJourney/orderJourneyUtils'

function FloatingOrb({ className }) {
  return (
    <Motion.div
      animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    />
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
        <div className="px-4 pb-12 pt-24 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="theme-card rounded-[34px] px-6 py-16 text-center sm:px-10">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <Receipt size={34} />
              </div>
              <h1 className="mt-6 text-[30px] font-black text-[var(--theme-text)]">Bill not found</h1>
              <p className="mt-3 text-[14px] leading-7 text-[var(--theme-muted)]">
                Final order data session me available nahi mila. Naya meal order start karte hain.
              </p>
              <button
                type="button"
                onClick={handleStartAgain}
                className="theme-primary-button mt-8 inline-flex items-center gap-2 rounded-[18px] px-6 py-3 text-[14px] font-semibold"
              >
                Start New Order
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-page-shell min-h-screen overflow-hidden">
      <Navbar />

      <div className="relative px-4 pb-12 pt-20 sm:px-6">
        <FloatingOrb className="pointer-events-none absolute left-10 top-32 h-28 w-28 rounded-full bg-orange-200/30 blur-3xl" />
        <FloatingOrb className="pointer-events-none absolute right-16 top-48 h-36 w-36 rounded-full bg-sky-200/30 blur-3xl" />
        <FloatingOrb className="pointer-events-none absolute bottom-16 left-1/3 h-32 w-32 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden rounded-[36px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(135deg,rgba(255,247,239,0.98),rgba(255,255,255,0.96),rgba(238,248,255,0.96))] shadow-[var(--theme-shadow-card-lg)]"
          >
            <div className="relative border-b border-[color:var(--theme-surface-border)] px-6 py-8 sm:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_36%)]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <CircleCheckBig size={15} />
                    Order Placed Successfully
                  </div>

                  <h1 className="mt-5 text-[34px] font-black tracking-tight text-[var(--theme-text)] sm:text-[42px]">
                    Final Bill Ready
                  </h1>
                  <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[var(--theme-muted)]">
                    Payment confirm ho chuki hai aur backend order DB me bill, payment method, total amount, station, chef aur PNR-linked details save ho chuke hain.
                  </p>
                </div>

                <div className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white/90 px-5 py-4 text-right shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
                    Amount Paid
                  </p>
                  <p className="mt-2 text-[34px] font-black text-[var(--theme-accent)]">
                    {formatMoney(order.totalAmount)}
                  </p>
                  <p className="mt-2 text-[12px] font-medium text-[var(--theme-muted)]">
                    {order.currency || 'INR'} • {getPaymentMethodLabel(order.paymentMethod)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_420px]">
              <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-[color:var(--theme-surface-border)] bg-white p-5 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-[20px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                          Invoice
                        </p>
                        <p className="mt-1 text-[16px] font-black text-[var(--theme-text)]">
                          {order.invoiceNumber || order.orderId}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-[12px] leading-6 text-[var(--theme-muted)]">
                      Payment reference: <span className="font-semibold text-[var(--theme-text)]">{order.paymentReference || 'Processing'}</span>
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-[color:var(--theme-surface-border)] bg-white p-5 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-[20px] border border-emerald-200 bg-emerald-50 text-emerald-700">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                          Payment Status
                        </p>
                        <p className="mt-1 text-[16px] font-black capitalize text-[var(--theme-text)]">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      <BadgeCheck size={12} />
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[26px] border border-[color:var(--theme-surface-border)] bg-white px-5 py-4 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-2 text-[var(--theme-accent)]">
                      <TrainFront size={16} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                        Journey
                      </p>
                    </div>
                    <p className="mt-3 text-[15px] font-bold text-[var(--theme-text)]">{order.trainName}</p>
                    <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                      {order.boardingStation} to {order.destinationStation}
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-[color:var(--theme-surface-border)] bg-white px-5 py-4 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-2 text-[var(--theme-accent)]">
                      <MapPin size={16} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                        Delivery Stop
                      </p>
                    </div>
                    <p className="mt-3 text-[15px] font-bold text-[var(--theme-text)]">{order.selectedStation?.name}</p>
                    <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                      {order.selectedStation?.code} • Day {order.selectedStation?.day || '1'}
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-[color:var(--theme-surface-border)] bg-white px-5 py-4 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-2 text-[var(--theme-accent)]">
                      <ChefHat size={16} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                        Chef
                      </p>
                    </div>
                    <p className="mt-3 text-[15px] font-bold text-[var(--theme-text)]">{order.chef?.name}</p>
                    <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                      {order.chef?.speciality || order.chef?.cuisine || 'Homestyle meals'}
                    </p>
                  </div>
                </div>

                <div className="rounded-[32px] border border-[color:var(--theme-surface-border)] bg-white p-5 shadow-[var(--theme-shadow-soft)] sm:p-6">
                  <h2 className="text-[22px] font-black text-[var(--theme-text)]">Ordered Items</h2>
                  <div className="mt-5 space-y-3">
                    {(order.items || []).map((item, index) => (
                      <Motion.div
                        key={`${item.dishId || item.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.25 }}
                        className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,249,244,0.85),rgba(255,255,255,0.96))] px-4 py-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[16px] font-bold text-[var(--theme-text)]">{item.name}</p>
                            <p className="mt-1 text-[12px] leading-6 text-[var(--theme-muted)]">
                              Qty {item.quantity} • {item.category || 'Meal'}
                            </p>
                          </div>
                          <p className="text-[15px] font-black text-[var(--theme-text)]">
                            {formatMoney(item.lineTotal || Number(item.price || 0) * Number(item.quantity || 0))}
                          </p>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[color:var(--theme-surface-border)] bg-[rgba(250,250,252,0.86)] px-6 py-6 sm:px-8 lg:border-l lg:border-t-0">
                <div className="rounded-[32px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.95),rgba(255,255,255,0.98))] p-6 shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                    Bill Summary
                  </p>
                  <div className="mt-5 space-y-4 text-[13px]">
                    <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[var(--theme-text)]">{formatMoney(order.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
                      <span>Food GST ({Math.round(Number(order.gstRate || 0) * 100)}%)</span>
                      <span className="font-semibold text-[var(--theme-text)]">{formatMoney(order.gstAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
                      <span>Delivery charge</span>
                      <span className="font-semibold text-[var(--theme-text)]">{formatMoney(order.deliveryCharge)}</span>
                    </div>
                    <div className="h-px bg-[color:var(--theme-surface-border)]" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[15px] font-bold text-[var(--theme-text)]">Total paid</span>
                      <span className="text-[26px] font-black text-[var(--theme-accent)]">{formatMoney(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[28px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[13px] leading-6 text-emerald-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <CircleCheckBig size={16} />
                    Ready for downstream module handoff
                  </div>
                  <p className="mt-2">
                    Is order response me payment method, reference, totals, PNR journey, station, chef aur line items included hain.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={handleStartAgain}
                    className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-[14px] font-semibold"
                  >
                    Order Another Meal
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/pnr/${order.pnr}`)}
                    className="theme-soft-button rounded-[18px] px-5 py-3 text-[14px] font-semibold"
                  >
                    Back to Journey
                  </button>
                </div>
              </div>
            </div>
          </Motion.section>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
