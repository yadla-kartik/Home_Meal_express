import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  ArrowRight,
  BadgePercent,
  CircleDollarSign,
  HandCoins,
  Receipt,
  ShieldCheck,
} from 'lucide-react'
import OrderJourneyShell from './orderJourney/OrderJourneyShell'
import OrderSummaryCard from './orderJourney/OrderSummaryCard'
import {
  calculateOrderSummary,
  doesDraftMatchRoute,
  FOOD_GST_RATE,
  formatMoney,
  readOrderDraft,
} from './orderJourney/orderJourneyUtils'

function BillingRow({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[color:var(--theme-surface-border)] bg-white px-4 py-3">
      <span className="text-[13px] font-medium text-[var(--theme-muted)]">{label}</span>
      <span className={`text-[15px] font-bold ${accent ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text)]'}`}>
        {value}
      </span>
    </div>
  )
}

function BillingPageCard({ icon, title, description, children }) {
  return (
    <div className="theme-card rounded-[30px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-[22px] font-black text-[var(--theme-text)]">{title}</h2>
          <p className="mt-2 text-[14px] leading-7 text-[var(--theme-muted)]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function OrderBillingPage() {
  const { stationCode, chefId } = useParams()
  const navigate = useNavigate()
  const draft = readOrderDraft()
  const hasMatchingDraft = doesDraftMatchRoute(draft, stationCode, chefId)
  const safeDraft = hasMatchingDraft
    ? draft
    : {
        stationCode,
        chefId,
        selectedStation: { code: stationCode, name: 'Selected station' },
        chef: { name: 'Selected chef' },
        items: [],
        summary: calculateOrderSummary([]),
      }
  const summary = safeDraft.summary || calculateOrderSummary(safeDraft.items)

  const handleBack = () => navigate(`/station/${stationCode}/chef/${chefId}/cart`)
  const handleContinue = () => {
    if (!hasMatchingDraft || !safeDraft.items?.length) {
      navigate(`/station/${stationCode}/chef/${chefId}`)
      return
    }

    navigate(`/station/${stationCode}/chef/${chefId}/payment`)
  }

  return (
    <OrderJourneyShell
      draft={safeDraft}
      currentStep="billing"
      title="Billing Breakdown"
      description="Is screen par user ko साफ billing dikhni chahiye: items subtotal, food GST, fixed delivery charge, aur final payable total."
      onBack={handleBack}
      backLabel="Back to Cart"
      sidebar={<OrderSummaryCard draft={safeDraft} title="Billing Snapshot" />}
    >
      <div className="space-y-5">
        <BillingPageCard
          icon={<Receipt size={22} />}
          title="Transparent bill before payment"
          description="Aapne jo meals select kiye hain unka poora breakdown yahan ready hai. Backend bhi isi structure ke hisaab se total calculate karke save karega."
        >
          <div className="space-y-3">
            <BillingRow label="Food subtotal" value={formatMoney(summary.subtotal)} />
            <BillingRow label={`Food GST (${Math.round(FOOD_GST_RATE * 100)}%)`} value={formatMoney(summary.gstAmount)} />
            <BillingRow label="Delivery charge" value={formatMoney(summary.deliveryCharge)} />
            <BillingRow label="Total payable" value={formatMoney(summary.totalAmount)} accent />
          </div>
        </BillingPageCard>

        <div className="grid gap-5 xl:grid-cols-2">
          <BillingPageCard
            icon={<BadgePercent size={22} />}
            title="Tax detail"
            description="Food GST ko alag line item me dikhaya gaya hai taaki final payable amount clear aur reusable rahe for future modules."
          >
            <div className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-[rgba(248,250,252,0.82)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-[var(--theme-text)]">GST on food items only</p>
                <p className="text-[17px] font-black text-[var(--theme-accent)]">{formatMoney(summary.gstAmount)}</p>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                Calculation: {formatMoney(summary.subtotal)} x {Math.round(FOOD_GST_RATE * 100)}%
              </p>
            </div>
          </BillingPageCard>

          <BillingPageCard
            icon={<HandCoins size={22} />}
            title="Delivery charge"
            description="Train stop delivery ke liye fixed Rs 30 service charge add kiya gaya hai, jaisa aapne bola tha."
          >
            <div className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-[rgba(248,250,252,0.82)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-[var(--theme-text)]">Station delivery fee</p>
                <p className="text-[17px] font-black text-[var(--theme-accent)]">{formatMoney(summary.deliveryCharge)}</p>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
                Applied once per order for chef handoff and stop-based fulfillment.
              </p>
            </div>
          </BillingPageCard>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="theme-card rounded-[30px] p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[13px] leading-6 text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Billing is locked and ready for online payment
              </div>
              <p className="mt-2">
                Payment step par sirf online mode dikhaya jayega. Backend final order me payment method, invoice amount, aur transaction reference store karega.
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.9),rgba(255,255,255,0.96))] px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                Final payable
              </p>
              <p className="mt-2 text-[30px] font-black text-[var(--theme-accent)]">
                {formatMoney(summary.totalAmount)}
              </p>
            </div>
          </div>
        </Motion.div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-white px-5 py-4 text-[13px] leading-6 text-[var(--theme-muted)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--theme-text)]">
              <CircleDollarSign size={16} className="text-[var(--theme-accent)]" />
              Billing ready
            </div>
            <p className="mt-2">
              Cart se billing aa chuka hai. Agla page payment selection aur final order placement ke liye ready hai.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="theme-soft-button rounded-[18px] px-5 py-3 text-[14px] font-semibold"
          >
            Back to Cart
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[18px] px-6 py-3 text-[14px] font-semibold"
          >
            Continue to Payment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </OrderJourneyShell>
  )
}

export default OrderBillingPage
