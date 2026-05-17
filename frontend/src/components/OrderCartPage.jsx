import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react'
import { saveOrderDraft } from '../../services/userAuthService'
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
      currentStep: 'cart',
      payment: safeDraft.payment,
    })
  }, [chefId, hasMatchingDraft, safeDraft, summary])

  const persistItems = (items) => {
    if (!hasMatchingDraft) return

    if (!items.length) {
      clearOrderDraft()
      setDraft({ ...draft, items: [], summary: calculateOrderSummary([]) })
      return
    }

    const nextDraft = { ...draft, items }
    writeOrderDraft(nextDraft)
    setDraft({ ...nextDraft, summary: calculateOrderSummary(items) })
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
      currentStep="cart"
      title="Review Cart"
      description="Review your selected dishes, adjust quantities, then continue to billing."
      onBack={handleBackToMenu}
      backLabel="Menu"
      sidebar={safeDraft.items?.length ? <OrderSummaryCard draft={safeDraft} /> : null}
    >
      {!hasMatchingDraft || !safeDraft.items?.length ? (
        <div className="theme-card rounded-[22px] px-5 py-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
            <ShoppingBag size={28} />
          </div>
          <h2 className="mt-5 text-[22px] font-black text-[var(--theme-text)]">Cart is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[var(--theme-muted)]">
            Your selected dishes will appear here after you add items from the menu.
          </p>
          <button
            type="button"
            onClick={handleBackToMenu}
            className="theme-primary-button mt-6 inline-flex items-center gap-2 rounded-[16px] px-5 py-2.5 text-[13px] font-bold"
          >
            Browse Menu
            <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div className="theme-card rounded-[22px] p-4 sm:p-5">
          <div className="flex flex-col gap-3 border-b border-[color:var(--theme-surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
                {summary.totalItems} item{summary.totalItems > 1 ? 's' : ''} selected
              </p>
              <h2 className="mt-1 text-[21px] font-black text-[var(--theme-text)]">Your meal cart</h2>
            </div>
            <button
              type="button"
              onClick={handleBackToMenu}
              className="theme-soft-button w-fit rounded-[14px] px-4 py-2 text-[12px] font-bold"
            >
              Add More
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {safeDraft.items.map((item, index) => (
              <Motion.div
                key={`${item.dishId || item.id}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.22 }}
                className="rounded-[18px] border border-[color:var(--theme-surface-border)] bg-white p-3"
              >
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-slate-50 text-[var(--theme-accent)]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <UtensilsCrossed size={22} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-black text-[var(--theme-text)]">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[var(--theme-muted)]">
                          {item.description || item.category || 'Fresh meal from chef menu.'}
                        </p>
                      </div>
                      <p className="shrink-0 text-[15px] font-black text-[var(--theme-text)]">
                        {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[12px] font-semibold text-[var(--theme-muted)]">
                        {formatMoney(item.price)} each
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-[14px] border border-[color:var(--theme-surface-border)] bg-white p-1">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.dishId || item.id, -1)}
                            className="grid h-8 w-8 place-items-center rounded-[10px] text-[var(--theme-text)] transition hover:bg-slate-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[32px] text-center text-[13px] font-black text-[var(--theme-text)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.dishId || item.id, 1)}
                            className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--theme-accent)] text-white transition hover:opacity-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.dishId || item.id)}
                          className="grid h-9 w-9 place-items-center rounded-[12px] border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[color:var(--theme-surface-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted)]">Payable</p>
              <p className="mt-1 text-[24px] font-black text-[var(--theme-accent)]">{formatMoney(summary.totalAmount)}</p>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-bold"
            >
              Continue to Billing
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </OrderJourneyShell>
  )
}

export default OrderCartPage
