import React, { useEffect, useState } from 'react'
import { Bike, Clock3, IndianRupee, MapPinned, PackageCheck, Route, ShieldCheck, TimerReset } from 'lucide-react'
import Navbar from './Navbar'
import { deliveryCookieCheck } from '../../../services/deliveryAuthService'

const quickStats = [
  { label: 'Assigned Today', value: '12', icon: PackageCheck },
  { label: 'On-Time Rate', value: '96%', icon: Clock3 },
  { label: 'Today Earnings', value: 'Rs 740', icon: IndianRupee },
]

const activeDeliveries = [
  { id: 'TR-2045', station: 'Raipur Jn', eta: '12 mins', status: 'Pickup ready' },
  { id: 'TR-1098', station: 'Bilaspur Jn', eta: '18 mins', status: 'Seat delivery' },
  { id: 'TR-3321', station: 'Nagpur', eta: '26 mins', status: 'Route planned' },
]

const DeliveryDashboard = () => {
  const [deliveryName, setDeliveryName] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    let isMounted = true

    const syncDeliveryState = async () => {
      const res = await deliveryCookieCheck()
      if (!isMounted || !res?.deliveryBoy) return

      setDeliveryName(res.deliveryBoy.name || '')
      setIsRegistered(Boolean(res.deliveryBoy.isRegistered))
    }

    syncDeliveryState()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar
        deliveryName={deliveryName}
        isRegistered={isRegistered}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-8 pt-22 sm:px-6 lg:px-8">
        <section className="theme-card-lg overflow-hidden rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#fffdf9_48%,#fff2e6)] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--theme-accent)]">
                <Bike size={14} />
                Delivery Partner Hub
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[var(--theme-text)] sm:text-4xl">
                Manage pickups, routes and on-time drops from one clean dashboard.
              </h1>
              <p className="theme-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                Track active deliveries, station pickups and daily progress with the same simple flow your partners already use.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-[22px] border border-[var(--theme-chip-border)] bg-white/88 p-4 shadow-[var(--theme-shadow-soft)]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                          {stat.label}
                        </span>
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                          <Icon size={18} />
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-[var(--theme-text)]">{stat.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-white/92 p-5 shadow-[var(--theme-shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <Route size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-text)]">Route Readiness</p>
                    <p className="theme-muted mt-1 text-xs">3 optimized station routes waiting for dispatch</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-white/92 p-5 shadow-[var(--theme-shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-text)]">Partner Status</p>
                    <p className="theme-muted mt-1 text-xs">Active and ready for station-based assignments</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#f97316,#fb923c)] p-5 text-white shadow-[var(--theme-shadow-button)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Shift Window</p>
                <p className="mt-2 text-2xl font-bold">09:00 AM - 07:00 PM</p>
                <p className="mt-2 text-sm text-white/85">Stay online to receive the next pickup request faster.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Live Deliveries</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">Current order queue</h2>
              </div>
              <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--theme-accent)]">
                Active now
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="rounded-[22px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)]">{delivery.id}</p>
                      <p className="mt-1 text-lg font-semibold text-[var(--theme-text)]">{delivery.station}</p>
                    </div>
                    <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--theme-accent)]">
                      {delivery.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-[var(--theme-muted)]">
                    <TimerReset size={16} />
                    <span>ETA: {delivery.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Delivery Zones</p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">Today&apos;s focus stations</h2>

            <div className="mt-5 space-y-3">
              {['Raipur Junction', 'Bilaspur Junction', 'Durg', 'Nagpur'].map((station, index) => (
                <div key={station} className="flex items-center gap-3 rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/40 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                    <MapPinned size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--theme-text)]">{station}</p>
                    <p className="theme-muted mt-1 text-xs">Priority zone {index + 1} for quick handoff and seat delivery</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DeliveryDashboard

