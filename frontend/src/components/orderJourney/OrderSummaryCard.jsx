import React from 'react'
import { motion as Motion } from 'framer-motion'
import { ChefHat, Dot, MapPin, ReceiptText, Sparkles } from 'lucide-react'
import { calculateOrderSummary, formatMoney } from './orderJourneyUtils'

function OrderSummaryCard({ draft, title = 'Order Summary', showHint = true }) {
  const items = Array.isArray(draft?.items) ? draft.items : []
  const summary = draft?.summary || calculateOrderSummary(items)

  return (
    <div className="theme-card sticky top-24 overflow-hidden rounded-[28px]">
      <div className="border-b border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.95),rgba(255,255,255,0.95))] px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
              Checkout Snapshot
            </p>
            <h2 className="mt-2 text-[20px] font-black text-[var(--theme-text)]">{title}</h2>
            {showHint ? (
              <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                Review your meal selection, taxes, and train-stop delivery total before moving ahead.
              </p>
            ) : null}
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
            <ReceiptText size={18} />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-[22px] border border-[color:var(--theme-surface-border)] bg-[rgba(248,250,252,0.8)] p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--theme-text)]">
            <ChefHat size={14} className="text-[var(--theme-accent)]" />
            {draft?.chef?.name || 'Selected chef'}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--theme-muted)]">
            <MapPin size={12} className="text-[var(--theme-accent)]/80" />
            {draft?.selectedStation?.name || 'Selected station'}
            <Dot size={14} />
            {draft?.selectedStation?.code || draft?.stationCode || '--'}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <Motion.div
              key={`${item?.dishId || item?.id}-${index}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              className="rounded-[20px] border border-[color:var(--theme-surface-border)] bg-white px-4 py-3 shadow-[var(--theme-shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[var(--theme-text)]">{item?.name}</p>
                  <p className="mt-1 text-[11px] text-[var(--theme-muted)]">
                    Qty {item?.quantity} • {item?.category || 'Meal'}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-bold text-[var(--theme-text)]">
                  {formatMoney(Number(item?.price || 0) * Number(item?.quantity || 0))}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>

        <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,249,244,0.94),rgba(255,255,255,0.98))] p-4">
          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
              <span>Items total</span>
              <span className="font-semibold text-[var(--theme-text)]">{formatMoney(summary.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
              <span>Food GST ({Math.round(summary.gstRate * 100)}%)</span>
              <span className="font-semibold text-[var(--theme-text)]">{formatMoney(summary.gstAmount)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[var(--theme-muted)]">
              <span>Delivery charge</span>
              <span className="font-semibold text-[var(--theme-text)]">{formatMoney(summary.deliveryCharge)}</span>
            </div>
            <div className="h-px bg-[color:var(--theme-surface-border)]" />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-bold text-[var(--theme-text)]">Payable total</span>
              <span className="text-[18px] font-black text-[var(--theme-accent)]">{formatMoney(summary.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] leading-6 text-emerald-700">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles size={14} />
            This total is ready for your payment step and downstream modules.
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryCard
