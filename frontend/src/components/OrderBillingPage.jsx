import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Receipt } from 'lucide-react'
import { saveOrderDraft } from '../../services/userAuthService'
import OrderJourneyShell from './orderJourney/OrderJourneyShell'
import OrderSummaryCard from './orderJourney/OrderSummaryCard'
import {
  calculateOrderSummary,
  doesDraftMatchRoute,
  FOOD_GST_RATE,
  formatMoney,
  readOrderDraft,
} from './orderJourney/orderJourneyUtils'

function BillRow({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${strong ? 'pt-3' : ''}`}>
      <span className={`${strong ? 'text-[15px] font-black text-[var(--theme-text)]' : 'text-[13px] font-semibold text-[var(--theme-muted)]'}`}>
        {label}
      </span>
      <span className={`${strong ? 'text-[22px] font-black text-[var(--theme-accent)]' : 'text-[14px] font-black text-[var(--theme-text)]'}`}>
        {value}
      </span>
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

  React.useEffect(() => {
    if (!hasMatchingDraft || !safeDraft.items?.length) return

    saveOrderDraft({
      pnr: safeDraft.pnrInput || safeDraft.pnrData?.pnr || '',
      pnrData: safeDraft.pnrData,
      selectedStation: safeDraft.selectedStation,
      chefId,
      chef: safeDraft.chef,
      cartItems: safeDraft.items,
      billing: summary,
      currentStep: 'billing',
      payment: safeDraft.payment,
    })
  }, [chefId, hasMatchingDraft, safeDraft, summary])

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
      currentStep="billing"
      title="Billing"
      description="Food subtotal, GST, delivery charge, and the final payable amount are shown clearly."
      onBack={handleBack}
      backLabel="Cart"
      sidebar={<OrderSummaryCard draft={safeDraft} title="Bill Preview" />}
    >
      <div className="theme-card rounded-[22px] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--theme-surface-border)] pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
              Bill Details
            </p>
            <h2 className="mt-1 text-[22px] font-black text-[var(--theme-text)]">Amount payable</h2>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
            <Receipt size={18} />
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
          <div className="space-y-3">
            <BillRow label="Food subtotal" value={formatMoney(summary.subtotal)} />
            <BillRow label={`Food GST (${Math.round(FOOD_GST_RATE * 100)}%)`} value={formatMoney(summary.gstAmount)} />
            <BillRow label="Delivery charge" value={formatMoney(summary.deliveryCharge)} />
            <div className="h-px bg-[color:var(--theme-surface-border)]" />
            <BillRow label="Total payable" value={formatMoney(summary.totalAmount)} strong />
          </div>
        </div>

        <div className="mt-4 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-[12px] font-semibold leading-5 text-emerald-700">
            This bill is ready for online payment. GST and delivery charges will be saved with the final order.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="theme-soft-button rounded-[16px] px-5 py-3 text-[13px] font-bold"
          >
            Back to Cart
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-bold"
          >
            Continue to Payment
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </OrderJourneyShell>
  )
}

export default OrderBillingPage
