import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CreditCard,
  Landmark,
  Loader2,
  Smartphone,
} from 'lucide-react'
import { createJourneyOrder, saveOrderDraft } from '../../services/userAuthService'
import OrderJourneyShell from './orderJourney/OrderJourneyShell'
import OrderSummaryCard from './orderJourney/OrderSummaryCard'
import {
  calculateOrderSummary,
  clearOrderDraft,
  DEFAULT_PAYMENT_MODE,
  DEFAULT_PAYMENT_PROVIDER,
  doesDraftMatchRoute,
  formatMoney,
  ONLINE_PAYMENT_OPTIONS,
  readOrderDraft,
  writeOrderConfirmation,
  writeOrderDraft,
} from './orderJourney/orderJourneyUtils'

const METHOD_ICONS = {
  upi: Smartphone,
  card: CreditCard,
  netbanking: Landmark,
}

function OrderPaymentPage() {
  const { stationCode, chefId } = useParams()
  const navigate = useNavigate()
  const [draft, setDraft] = React.useState(() => readOrderDraft())
  const [selectedMethod, setSelectedMethod] = React.useState('upi')
  const [upiId, setUpiId] = React.useState('')
  const [processing, setProcessing] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const nextDraft = readOrderDraft()
    setDraft(nextDraft)
    setSelectedMethod(nextDraft?.payment?.method || 'upi')
    setUpiId(nextDraft?.payment?.upiId || '')
  }, [stationCode, chefId])

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
      currentStep: 'payment',
      payment: {
        mode: DEFAULT_PAYMENT_MODE,
        method: selectedMethod,
        provider: DEFAULT_PAYMENT_PROVIDER,
        upiId,
      },
    })
  }, [chefId, hasMatchingDraft, safeDraft, selectedMethod, summary, upiId])

  const savePaymentDraft = (method, nextUpiId = upiId) => {
    if (!hasMatchingDraft) return

    const nextDraft = {
      ...draft,
      payment: {
        mode: DEFAULT_PAYMENT_MODE,
        method,
        provider: DEFAULT_PAYMENT_PROVIDER,
        upiId: nextUpiId,
      },
    }

    writeOrderDraft(nextDraft)
    setDraft({ ...nextDraft, summary: calculateOrderSummary(nextDraft.items) })
  }

  const persistPaymentChoice = (method) => {
    setSelectedMethod(method)
    setError('')
    savePaymentDraft(method)
  }

  const handleUpiChange = (event) => {
    const value = event.target.value
    setUpiId(value)
    savePaymentDraft(selectedMethod, value)
  }

  const handleBack = () => navigate(`/station/${stationCode}/chef/${chefId}/billing`)

  const handlePayNow = async () => {
    if (!hasMatchingDraft || !safeDraft.items?.length) {
      navigate(`/station/${stationCode}/chef/${chefId}`)
      return
    }

    if (selectedMethod === 'upi' && !upiId.trim()) {
      setError('Please enter a UPI ID to continue with payment.')
      return
    }

    setProcessing(true)
    setError('')

    const response = await createJourneyOrder({
      pnr: safeDraft.pnrInput || safeDraft.pnrData?.pnr || '',
      pnrData: safeDraft.pnrData,
      stationCode,
      chefId,
      items: safeDraft.items.map((item) => ({
        dishId: item.dishId || item.id,
        quantity: item.quantity,
      })),
      payment: {
        mode: DEFAULT_PAYMENT_MODE,
        method: selectedMethod,
        provider: DEFAULT_PAYMENT_PROVIDER,
        upiId: selectedMethod === 'upi' ? upiId.trim() : '',
      },
      source: 'pnr',
    })

    setProcessing(false)

    if (!response?.success || !response?.data) {
      setError(response?.message || 'Unable to complete online payment right now.')
      return
    }

    writeOrderConfirmation(response.data)
    clearOrderDraft()
    navigate(`/station/${stationCode}/chef/${chefId}/bill`, {
      state: { order: response.data },
      replace: true,
    })
  }

  return (
    <OrderJourneyShell
      currentStep="payment"
      title="Payment"
      description="Choose an online payment method, enter a UPI ID when needed, and place the order."
      onBack={handleBack}
      backLabel="Billing"
      sidebar={<OrderSummaryCard draft={safeDraft} title="Payable" />}
    >
      <div className="theme-card rounded-[22px] p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-[color:var(--theme-surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
              Online Payment
            </p>
            <h2 className="mt-1 text-[22px] font-black text-[var(--theme-text)]">Choose method</h2>
          </div>
          <div className="rounded-[16px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Pay</p>
            <p className="text-[20px] font-black text-[var(--theme-accent)]">{formatMoney(summary.totalAmount)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {ONLINE_PAYMENT_OPTIONS.map((option) => {
            const Icon = METHOD_ICONS[option.id] || CreditCard
            const isActive = selectedMethod === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => persistPaymentChoice(option.id)}
                className={`rounded-[18px] border p-3 text-left transition ${
                  isActive
                    ? 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] shadow-[var(--theme-shadow-soft)]'
                    : 'border-[color:var(--theme-surface-border)] bg-white hover:border-[var(--theme-chip-border)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-[14px] ${isActive ? 'bg-[var(--theme-accent)] text-white' : 'bg-slate-50 text-[var(--theme-muted)]'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-black text-[var(--theme-text)]">{option.title}</h3>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                          <BadgeCheck size={11} />
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[12px] text-[var(--theme-muted)]">{option.subtitle}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedMethod === 'upi' ? (
          <div className="mt-4 rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-4">
            <label htmlFor="upiId" className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--theme-muted)]">
              UPI ID
            </label>
            <input
              id="upiId"
              type="text"
              value={upiId}
              onChange={handleUpiChange}
              placeholder="name@upi"
              className="mt-2 w-full rounded-[14px] border border-[color:var(--theme-surface-border)] bg-slate-50 px-4 py-3 text-[14px] font-semibold text-[var(--theme-text)] outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
            />
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] font-semibold leading-5 text-rose-700">
            <span className="inline-flex items-center gap-2">
              <CircleAlert size={15} />
              {error}
            </span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleBack}
            disabled={processing}
            className="theme-soft-button rounded-[16px] px-5 py-3 text-[13px] font-bold disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={processing || !hasMatchingDraft || !safeDraft.items?.length}
            className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-bold disabled:opacity-60"
          >
            {processing ? <Loader2 size={15} className="animate-spin" /> : 'Done & Place Order'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </OrderJourneyShell>
  )
}

export default OrderPaymentPage
