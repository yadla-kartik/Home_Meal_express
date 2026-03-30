import React from 'react'
import {
  BadgeCheck,
  CircleAlert,
  LayoutDashboard,
  MapPinned,
  ReceiptIndianRupee,
  ShieldCheck,
  UserRoundCheck,
  Users,
} from 'lucide-react'
import Navbar from './Navbar'

const summaryCards = [
  { label: 'Chef Requests', value: '24', icon: UserRoundCheck },
  { label: 'Delivery Partners', value: '18', icon: Users },
  { label: 'Open Issues', value: '07', icon: CircleAlert },
]

const reviewQueue = [
  { title: 'Chef KYC approvals', detail: '8 chefs waiting for station verification' },
  { title: 'Menu moderation', detail: '5 fresh menus need content review' },
  { title: 'Delivery onboarding', detail: '3 riders pending route assignment' },
]

const insights = [
  { title: 'Zone Health', text: 'Nagpur, Raipur and Bilaspur are running smooth with low delay risk.', icon: MapPinned },
  { title: 'Revenue Pulse', text: 'Today platform collections are stable with stronger lunch-hour demand.', icon: ReceiptIndianRupee },
  { title: 'Trust Layer', text: 'Most recent chef and delivery submissions passed verification checks.', icon: ShieldCheck },
]

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-8 pt-22 sm:px-6 lg:px-8">
        <section className="theme-card-lg overflow-hidden rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#fffdf9_48%,#fff2e6)] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--theme-accent)]">
                <LayoutDashboard size={14} />
                Admin Control Center
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[var(--theme-text)] sm:text-4xl">
                One place to review chefs, riders, orders and platform activity.
              </h1>
              <p className="theme-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                Keep the TrainEats network moving with quick moderation, smarter station visibility and a cleaner overview of daily operations.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {summaryCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div key={card.label} className="rounded-[22px] border border-[var(--theme-chip-border)] bg-white/88 p-4 shadow-[var(--theme-shadow-soft)]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                          {card.label}
                        </span>
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                          <Icon size={18} />
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-[var(--theme-text)]">{card.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-white/92 p-5 shadow-[var(--theme-shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <BadgeCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-text)]">Verification Queue</p>
                    <p className="theme-muted mt-1 text-xs">Priority requests are ready for admin approval</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#f97316,#fb923c)] p-5 text-white shadow-[var(--theme-shadow-button)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Operations Snapshot</p>
                <p className="mt-2 text-2xl font-bold">Stable platform flow</p>
                <p className="mt-2 text-sm text-white/85">Most active stations are tracking healthy delivery and chef response rates.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Approval Queue</p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">What needs attention now</h2>

            <div className="mt-5 space-y-3">
              {reviewQueue.map((item, index) => (
                <div key={item.title} className="rounded-[22px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
                        Queue {index + 1}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[var(--theme-text)]">{item.title}</p>
                    </div>
                    <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--theme-accent)]">
                      Pending
                    </span>
                  </div>
                  <p className="theme-muted mt-3 text-sm leading-6">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Platform Insights</p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">Quick admin readouts</h2>

            <div className="mt-5 space-y-3">
              {insights.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/40 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--theme-text)]">{item.title}</p>
                      <p className="theme-muted mt-1 text-sm leading-6">{item.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
