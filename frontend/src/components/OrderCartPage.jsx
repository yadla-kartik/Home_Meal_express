import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  ArrowRight,
  CircleAlert,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import OrderJourneyShell from './orderJourney/OrderJourneyShell'
import OrderSummaryCard from './orderJourney/OrderSummaryCard'
import {
  calculateOrderSummary,
  clearOrderDraft,
  doesDraftMatchRoute,
  formatMoney,
  readOrderDraft,
  writeOrderDraft,
} from './orderJourney/orderJourneyUtils'

function OrderCartPage() {
  const { stationCode, chefId } = useParams()
  const navigate = useNavigate()
  const [draft, setDraft] = React.useState(() => readOrderDraft())

  React.useEffect(() => {
    setDraft(readOrderDraft())
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

  const persistItems = (items) => {
    if (!hasMatchingDraft) return

    if (!items.length) {
      clearOrderDraft()
      setDraft({
        ...draft,
        items: [],
        summary: calculateOrderSummary([]),
      })
      return
    }

    const nextDraft = { ...draft, items }
    writeOrderDraft(nextDraft)
    setDraft({
      ...nextDraft,
      summary: calculateOrderSummary(items),
    })
  }

  const handleQuantityChange = (dishId, delta) => {
    if (!hasMatchingDraft) return

    const nextItems = (draft?.items || [])
      .map((item) =>
        (item.dishId || item.id) === dishId
          ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + delta) }
          : item,
      )
      .filter((item) => Number(item.quantity || 0) > 0)

    persistItems(nextItems)
  }

  const handleRemove = (dishId) => {
    if (!hasMatchingDraft) return
    persistItems((draft?.items || []).filter((item) => (item.dishId || item.id) !== dishId))
  }

  const handleBackToMenu = () => navigate(`/station/${stationCode}/chef/${chefId}`)
  const handleContinue = () => navigate(`/station/${stationCode}/chef/${chefId}/billing`)

  return (
    <OrderJourneyShell
      draft={safeDraft}
      currentStep="cart"
      title="Review Your Cart"
      description="Yahan user apne selected dishes, quantities, aur station delivery selection ko double-check karega before billing."
      onBack={handleBackToMenu}
      backLabel="Back to Menu"
      sidebar={<OrderSummaryCard draft={safeDraft} />}
    >
      {!hasMatchingDraft || !safeDraft.items?.length ? (
        <div className="theme-card overflow-hidden rounded-[30px]">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-[28px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
              <ShoppingBag size={34} />
            </div>
            <h2 className="mt-6 text-[24px] font-black text-[var(--theme-text)]">Cart is empty right now</h2>
            <p className="mt-3 max-w-md text-[14px] leading-7 text-[var(--theme-muted)]">
              Menu se dishes add karte hi yahan poora order breakdown dikh jayega. Abhi ke liye chef menu par wapas chalte hain.
            </p>
            <button
              type="button"
              onClick={handleBackToMenu}
              className="theme-primary-button mt-8 inline-flex items-center gap-2 rounded-[18px] px-6 py-3 text-[14px] font-semibold"
            >
              Browse Menu Again
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="theme-card rounded-[30px] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  Cart Control
                </p>
                <h2 className="mt-2 text-[24px] font-black text-[var(--theme-text)]">
                  Add more or adjust portions
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[var(--theme-muted)]">
                  User menu par wapas jaa sakta hai ya yahi se quantity change karke next billing step par move kar sakta hai.
                </p>
              </div>

              <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-6 text-amber-700">
                Delivery will be prepared for
                <span className="ml-1 font-semibold">
                  {safeDraft.selectedStation?.name} ({safeDraft.selectedStation?.code})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {safeDraft.items.map((item, index) => (
              <Motion.div
                key={`${item.dishId || item.id}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.28 }}
                className="theme-card rounded-[28px] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.92),rgba(255,255,255,0.96))] text-[var(--theme-accent)]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full rounded-[24px] object-cover" />
                    ) : (
                      <UtensilsCrossed size={28} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[18px] font-bold text-[var(--theme-text)]">{item.name}</h3>
                      <span className="rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-accent)]">
                        {item.category || 'Meal'}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--theme-muted)]">
                      {item.description || 'Freshly prepared train-delivery meal selected from the chef menu.'}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] font-medium text-[var(--theme-muted)]">
                      <span>{formatMoney(item.price)} each</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--theme-muted)]/40" />
                      <span>{item.servingSize || 'Single serving'}</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--theme-muted)]/40" />
                      <span>{item.spiceLevel || 'Medium spice'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <p className="text-[20px] font-black text-[var(--theme-text)]">
                      {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-[color:var(--theme-surface-border)] bg-white p-1 shadow-[var(--theme-shadow-soft)]">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.dishId || item.id, -1)}
                          className="grid h-10 w-10 place-items-center rounded-full text-[var(--theme-text)] transition hover:bg-slate-100"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="min-w-[42px] text-center text-[15px] font-bold text-[var(--theme-text)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.dishId || item.id, 1)}
                          className="grid h-10 w-10 place-items-center rounded-full bg-[var(--theme-accent)] text-white transition hover:opacity-90"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.dishId || item.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-[12px] font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,247,238,0.9),rgba(255,255,255,0.94))] px-5 py-4 text-[13px] leading-6 text-[var(--theme-muted)]">
              <div className="flex items-center gap-2 font-semibold text-[var(--theme-accent)]">
                <CircleAlert size={15} />
                Tip for this step
              </div>
              <p className="mt-2">
                User yahan se direct menu par wapas jaa sakta hai agar aur items add karne hain, ya phir billing screen par continue kar sakta hai.
              </p>
            </div>

            <button
              type="button"
              onClick={handleBackToMenu}
              className="theme-soft-button rounded-[18px] px-5 py-3 text-[14px] font-semibold"
            >
              Add More Items
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[18px] px-6 py-3 text-[14px] font-semibold"
            >
              Continue to Billing
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </OrderJourneyShell>
  )
}

export default OrderCartPage
