import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { createJourneyOrder } from '../../services/userAuthService'
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
  const [processing, setProcessing] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const nextDraft = readOrderDraft()
    setDraft(nextDraft)
    setSelectedMethod(nextDraft?.payment?.method || 'upi')
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

  const persistPaymentChoice = (method) => {
    setSelectedMethod(method)
    setError('')

    if (!hasMatchingDraft) return

    const nextDraft = {
      ...draft,
      payment: {
        mode: DEFAULT_PAYMENT_MODE,
        method,
        provider: DEFAULT_PAYMENT_PROVIDER,
      },
    }

    writeOrderDraft(nextDraft)
    setDraft({
      ...nextDraft,
      summary: calculateOrderSummary(nextDraft.items),
    })
  }

  const handleBack = () => navigate(`/station/${stationCode}/chef/${chefId}/billing`)

  const handlePayNow = async () => {
    if (!hasMatchingDraft || !safeDraft.items?.length) {
      navigate(`/station/${stationCode}/chef/${chefId}`)
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
      draft={safeDraft}
      currentStep="payment"
      title="Choose Online Payment"
      description="Cash on delivery remove karke yahan sirf online payment options rakhe gaye hain. Final place-order action isi step se backend me save hoga."
      onBack={handleBack}
      backLabel="Back to Billing"
      sidebar={<OrderSummaryCard draft={safeDraft} title="Payable Summary" showHint={false} />}
    >
      <div className="space-y-5">
        <div className="theme-card rounded-[30px] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                Online Payment Only
              </p>
              <h2 className="mt-2 text-[24px] font-black text-[var(--theme-text)]">
                Select how the user will pay
              </h2>
              <p className="mt-2 text-[14px] leading-7 text-[var(--theme-muted)]">
                Abhi ke liye normal online selection screen rakhi gayi hai. Gateway integration baad me aasani se wire ki ja sakti hai.
              </p>
            </div>

            <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] leading-6 text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={15} />
                Secure placeholder payment flow
              </div>
              <p className="mt-1">Selected method and total amount backend DB me store hoga.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {ONLINE_PAYMENT_OPTIONS.map((option, index) => {
            const Icon = METHOD_ICONS[option.id] || CreditCard
            const isActive = selectedMethod === option.id

            return (
              <Motion.button
                key={option.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.28 }}
                onClick={() => persistPaymentChoice(option.id)}
                className={`text-left transition ${
                  isActive
                    ? 'theme-card rounded-[30px] border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,rgba(255,244,234,0.98),rgba(255,255,255,0.98))] p-5 shadow-[var(--theme-shadow-card-lg)]'
                    : 'theme-card rounded-[30px] p-5 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`grid h-14 w-14 place-items-center rounded-[22px] border ${
                      isActive
                        ? 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                        : 'border-[color:var(--theme-surface-border)] bg-white text-[var(--theme-muted)]'
                    }`}>
                      <Icon size={22} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-[18px] font-bold text-[var(--theme-text)]">{option.title}</h3>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                            <BadgeCheck size={12} />
                            Selected
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] font-medium text-[var(--theme-accent)]">{option.subtitle}</p>
                      <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--theme-muted)]">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-[color:var(--theme-surface-border)] bg-white px-4 py-3 text-right shadow-[var(--theme-shadow-soft)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                      Pay now
                    </p>
                    <p className="mt-1 text-[18px] font-black text-[var(--theme-text)]">{formatMoney(summary.totalAmount)}</p>
                  </div>
                </div>
              </Motion.button>
            )
          })}
        </div>

        {error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-[13px] leading-6 text-rose-700">
            <div className="flex items-center gap-2 font-semibold">
              <CircleAlert size={16} />
              Payment step needs attention
            </div>
            <p className="mt-2">{error}</p>
          </div>
        ) : null}

        <div className="theme-card rounded-[30px] p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                Final action
              </p>
              <h3 className="mt-2 text-[22px] font-black text-[var(--theme-text)]">
                Confirm payment and place the order
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-[var(--theme-muted)]">
                Is button ke baad backend final order create karega, invoice number generate karega, aur payment method/reference save karega.
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.9),rgba(255,255,255,0.96))] px-5 py-4 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                Selected method
              </p>
              <p className="mt-1 text-[18px] font-black capitalize text-[var(--theme-text)]">{selectedMethod}</p>
              <p className="mt-2 text-[26px] font-black text-[var(--theme-accent)]">{formatMoney(summary.totalAmount)}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div className="rounded-[24px] border border-[color:var(--theme-surface-border)] bg-white px-5 py-4 text-[13px] leading-6 text-[var(--theme-muted)]">
              Order will be stored with payment mode `online`, chosen payment method, total billing, chef snapshot, station details, and passenger-linked PNR data.
            </div>

            <button
              type="button"
              onClick={handleBack}
              disabled={processing}
              className="theme-soft-button rounded-[18px] px-5 py-3 text-[14px] font-semibold disabled:opacity-60"
            >
              Back to Billing
            </button>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={processing || !hasMatchingDraft || !safeDraft.items?.length}
              className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[18px] px-6 py-3 text-[14px] font-semibold disabled:opacity-60"
            >
              {processing ? <Loader2 size={16} className="animate-spin" /> : 'Pay & Place Order'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </OrderJourneyShell>
  )
}

export default OrderPaymentPage
