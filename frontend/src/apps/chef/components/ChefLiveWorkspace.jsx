import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  CookingPot,
  MapPinned,
  NotebookPen,
  PackageCheck,
  ShoppingBag,
  TimerReset,
  UtensilsCrossed,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const tempOrders = [
  {
    id: 'ord-101',
    customer: 'Coach B2, Seat 31',
    items: '2 Veg Thali, 1 Poha Box',
    station: 'Raipur Junction',
    deliveryIn: '18 min',
    total: '377',
    status: 'New order',
  },
  {
    id: 'ord-102',
    customer: 'Coach S4, Seat 14',
    items: '1 Breakfast Combo',
    station: 'Durg',
    deliveryIn: '32 min',
    total: '149',
    status: 'Queued',
  },
]

const insights = [
  'Your profile is approved and your menu is now visible for order flow.',
  'Keep availability updated so incoming orders stay accurate.',
  'Menu edits can be managed anytime from the menu workspace.',
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function ChefLiveWorkspace({ dishCount = 0 }) {
  return (
    <motion.section
      className="w-full py-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="grid gap-5">
        <motion.div
          variants={itemVariants}
          className="theme-card rounded-[28px] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                <BadgeCheck size={14} />
                Kitchen live
              </div>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--theme-text)] sm:text-[38px]">
                Orders lene ke liye ready ho.
              </h2>
              <p className="theme-muted mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
                Your menu is saved, your chef profile is approved, and the dashboard is now ready to surface live meal requests.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-[18px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)] px-4 py-3 shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Menu dishes
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-[var(--theme-text)]">{dishCount}</p>
                </div>
                <div className="rounded-[18px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)] px-4 py-3 shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Order state
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-[var(--theme-text)]">Ready</p>
                </div>
                <div className="rounded-[18px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)] px-4 py-3 shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Stations
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-[var(--theme-text)]">Active</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:min-w-[280px]">
              <Link
                to="/chef/menu"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(5,150,105,0.26)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Manage menu
                <NotebookPen size={16} />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-700">
                <PackageCheck size={16} />
                Your orders section is now unlocked
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={itemVariants}
            className="theme-card rounded-[28px] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Your orders
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
                  Temporary order queue
                </h3>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Basic UI
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {tempOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[22px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f7fffb)] p-4 shadow-[var(--theme-shadow-soft)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        <ShoppingBag size={12} />
                        {order.status}
                      </div>
                      <h4 className="mt-3 text-lg font-bold text-[var(--theme-text)]">{order.customer}</h4>
                      <p className="mt-1 text-sm text-[var(--theme-muted)]">{order.items}</p>
                    </div>

                    <div className="rounded-[18px] border border-emerald-100 bg-white px-4 py-3 text-right shadow-[var(--theme-shadow-soft)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Total
                      </p>
                      <p className="mt-1 text-lg font-bold text-[var(--theme-text)]">Rs. {order.total}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-[var(--theme-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinned size={14} className="text-emerald-600" />
                      {order.station}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={14} className="text-emerald-600" />
                      Delivery in {order.deliveryIn}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              variants={itemVariants}
              className="theme-card rounded-[28px] p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CookingPot size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Kitchen status
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-[var(--theme-text)]">
                    Accepting orders
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {insights.map((line) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 rounded-[20px] border border-emerald-100 bg-white p-3 shadow-[var(--theme-shadow-soft)]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <UtensilsCrossed size={16} />
                    </span>
                    <p className="text-sm font-medium leading-6 text-[var(--theme-text)]">{line}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fff7ef,#fff1e7)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                  <TimerReset size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                    Manage anytime
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-[var(--theme-text)]">
                    Edit your existing menu
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                    Profile menu ke andar se ya yahin se jaa kar dishes edit, add, pause ya manage kar sakte ho.
                  </p>
                  <Link
                    to="/chef/menu"
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-90"
                  >
                    Open menu workspace
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ChefLiveWorkspace
