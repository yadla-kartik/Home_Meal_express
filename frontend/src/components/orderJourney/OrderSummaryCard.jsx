import React from 'react'
import { ReceiptText } from 'lucide-react'
import { calculateOrderSummary, formatMoney } from './orderJourneyUtils'

function OrderSummaryCard({ draft, title = 'Order Summary' }) {
  const items = Array.isArray(draft?.items) ? draft.items : []
  const summary = draft?.summary || calculateOrderSummary(items)

  return (
    <div className="theme-card sticky top-24 rounded-[22px] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
            Checkout
          </p>
          <h2 className="mt-1 text-[17px] font-black text-[var(--theme-text)]">{title}</h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
          <ReceiptText size={17} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {items.slice(0, 4).map((item, index) => (
          <div
            key={`${item?.dishId || item?.id}-${index}`}
            className="flex items-start justify-between gap-3 rounded-[14px] border border-[color:var(--theme-surface-border)] bg-white px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-[var(--theme-text)]">{item?.name}</p>
              <p className="mt-0.5 text-[11px] text-[var(--theme-muted)]">Qty {item?.quantity}</p>
            </div>
            <p className="shrink-0 text-[12px] font-black text-[var(--theme-text)]">
              {formatMoney(Number(item?.price || 0) * Number(item?.quantity || 0))}
            </p>
          </div>
        ))}
        {items.length > 4 ? (
          <p className="px-1 text-[11px] font-semibold text-[var(--theme-muted)]">
            +{items.length - 4} more item{items.length - 4 > 1 ? 's' : ''}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/55 p-3 text-[12px]">
        <div className="flex justify-between gap-3 text-[var(--theme-muted)]">
          <span>Subtotal</span>
          <span className="font-bold text-[var(--theme-text)]">{formatMoney(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-3 text-[var(--theme-muted)]">
          <span>GST</span>
          <span className="font-bold text-[var(--theme-text)]">{formatMoney(summary.gstAmount)}</span>
        </div>
        <div className="flex justify-between gap-3 text-[var(--theme-muted)]">
          <span>Delivery</span>
          <span className="font-bold text-[var(--theme-text)]">{formatMoney(summary.deliveryCharge)}</span>
        </div>
        <div className="h-px bg-[color:var(--theme-surface-border)]" />
        <div className="flex items-center justify-between gap-3">
          <span className="font-black text-[var(--theme-text)]">Total</span>
          <span className="text-[18px] font-black text-[var(--theme-accent)]">{formatMoney(summary.totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryCard
