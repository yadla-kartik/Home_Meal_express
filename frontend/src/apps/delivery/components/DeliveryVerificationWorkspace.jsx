import React from 'react'
import { motion as Motion } from 'framer-motion'
import {
  Bike,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  PackageCheck,
  ShieldCheck,
  Store,
  XCircle,
} from 'lucide-react'

const demoOrder = {
  id: 'HME-2451',
  restaurant: 'Sithal Kitchen',
  customer: 'Aarav Sharma',
  pickup: 'Platform 2, Durg Station',
  drop: 'B3 Coach, Seat 42',
  amount: '₹186',
  distance: '2.4 km',
  eta: '18 min',
  items: '2 meals',
}

const demoOrders = [
  demoOrder,
  {
    id: 'HME-2452',
    restaurant: 'Golu Home Meals',
    customer: 'Nisha Verma',
    pickup: 'Gate 1, Raipur Station',
    drop: 'A1 Coach, Seat 18',
    amount: 'Rs. 224',
    distance: '1.8 km',
    eta: '14 min',
    items: '3 meals',
    priority: 'Express',
  },
  {
    id: 'HME-2453',
    restaurant: 'Ramu Kitchen',
    customer: 'Kabir Mehta',
    pickup: 'Food counter, Durg Station',
    drop: 'S4 Coach, Seat 65',
    amount: 'Rs. 132',
    distance: '3.1 km',
    eta: '22 min',
    items: '1 meal',
    priority: 'Standard',
  },
]

demoOrders[0].priority = 'Hot meal'
demoOrders[0].amount = 'Rs. 186'

function StatusProgressRing() {
  const radius = 46
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative mt-4 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(16,185,129,0.16)"
          strokeWidth="10"
        />
        <Motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#deliveryApprovedStatusGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="deliveryApprovedStatusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 m-auto flex h-20 w-20 flex-col items-center justify-center rounded-full border border-emerald-100 bg-white shadow-[var(--theme-shadow-soft)]">
        <p className="text-[25px] font-bold leading-none text-emerald-600">100%</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
          live
        </p>
      </div>
    </div>
  )
}

function ActiveOrderRequest() {
  const [selectedOrderId, setSelectedOrderId] = React.useState(demoOrders[0].id)
  const selectedOrder = demoOrders.find((order) => order.id === selectedOrderId) || demoOrders[0]

  return (
    <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
      <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Incoming orders
            </p>
            <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
              Available delivery requests
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--theme-muted)]">
              Select an order card to inspect pickup details and choose whether to accept it.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {demoOrders.length} live requests
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {demoOrders.map((order) => {
            const selected = order.id === selectedOrder.id

            return (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-[20px] border p-4 text-left transition ${
                  selected
                    ? 'border-emerald-300 bg-[linear-gradient(135deg,#ecfdf5,#ffffff)] shadow-[0_14px_28px_rgba(16,185,129,0.12)]'
                    : 'border-emerald-100 bg-white hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[var(--theme-shadow-soft)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Order #{order.id}
                    </p>
                    <h4 className="mt-1 truncate text-base font-bold text-[var(--theme-text)]">
                      {order.restaurant}
                    </h4>
                    <p className="mt-1 text-[12.5px] font-medium text-[var(--theme-muted)]">
                      {order.items} for {order.customer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{order.amount}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[var(--theme-muted)]">{order.eta}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[order.priority, order.distance, order.drop].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-[11px] font-semibold text-[var(--theme-text)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Delivery action
        </p>
        <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
          Accept order #{selectedOrder.id}?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
          Details for the selected request are shown here. Real order data can plug into this same layout later.
        </p>

        <div className="mt-5 rounded-[24px] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5,#ffffff)] p-4 shadow-[var(--theme-shadow-soft)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-emerald-600 shadow-[var(--theme-shadow-soft)]">
              <PackageCheck size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Selected request
                  </p>
                  <h4 className="mt-1 text-xl font-bold text-[var(--theme-text)]">
                    {selectedOrder.items} from {selectedOrder.restaurant}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{selectedOrder.amount}</p>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-[18px] border border-emerald-100 bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    <Store size={13} />
                    Pickup
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--theme-text)]">{selectedOrder.pickup}</p>
                </div>
                <div className="rounded-[18px] border border-emerald-100 bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    <MapPin size={13} />
                    Drop
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--theme-text)]">{selectedOrder.drop}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[selectedOrder.customer, selectedOrder.distance, selectedOrder.eta].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--theme-text)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-emerald-600 shadow-[var(--theme-shadow-soft)]">
              <Navigation size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--theme-text)]">Fast pickup suggested</p>
              <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
                Reach pickup within {selectedOrder.eta} to keep the delivery on schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-[16px] border border-emerald-200 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700"
          >
            Accept order
          </button>
          <button
            type="button"
            className="rounded-[16px] border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

function DeliveryVerificationWorkspace({ status = 'pending', rejectionReason = '', onReregister }) {
  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'
  const statusLabel = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'
  const approvedAccent = isApproved ? 'text-emerald-700' : 'text-[var(--theme-accent)]'
  const approvedPanelBorder = isApproved ? 'border-emerald-100' : 'border-[var(--theme-chip-border)]'
  const approvedPanelBg = isApproved
    ? 'bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]'
    : 'bg-[linear-gradient(180deg,#fff7ef_0%,#fff1e6_100%)]'

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-4"
    >
      <div className={`overflow-hidden rounded-[30px] border ${approvedPanelBorder} ${approvedPanelBg} p-4 shadow-[var(--theme-shadow-card)] sm:p-5`}>
        <div className={`rounded-[24px] border ${isApproved ? 'border-emerald-100 shadow-[0_8px_40px_rgba(16,185,129,0.08)]' : 'border-[rgba(249,115,22,0.12)] shadow-[0_8px_40px_rgba(249,115,22,0.07)]'} bg-[rgba(255,255,255,0.76)] p-5 backdrop-blur-sm sm:p-6`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className={`inline-flex items-center gap-2 rounded-full border ${isApproved ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[var(--theme-chip-border)] bg-[rgba(255,255,255,0.72)] text-[var(--theme-accent)]'} px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em]`}>
                <ShieldCheck size={13} />
                Delivery verification
              </div>

              <h2
                className="mt-4 max-w-2xl text-[26px] font-semibold leading-[1.08] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {isApproved ? 'Your delivery profile is' : isRejected ? 'Your delivery profile needs' : 'Your delivery profile is'}
                <span className={`font-semibold italic ${isApproved ? 'text-emerald-600' : 'text-[var(--theme-accent)]'}`}>
                  {isApproved ? ' active' : isRejected ? ' changes' : ' under review'}
                </span>.
              </h2>

              <p className="mt-4 max-w-3xl text-[13px] leading-7 text-[var(--theme-muted)] sm:text-[14px]">
                {isApproved
                  ? 'Your registration has been approved. Available delivery requests can now appear on your dashboard.'
                  : isRejected
                    ? 'The admin team reviewed your registration and requested a correction before activation.'
                    : 'Your registration has been received successfully. The admin team is now reviewing your delivery details before activation.'}
              </p>
            </div>

            <div
              className={`rounded-[24px] border px-5 py-4 text-center shadow-[var(--theme-shadow-soft)] ${
                isApproved
                  ? 'border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)]'
                  : 'border-[rgba(249,115,22,0.14)] bg-white/90'
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${approvedAccent}`}>
                Current status
              </p>
              {isApproved ? (
                <StatusProgressRing />
              ) : (
                <>
                  <p className="mt-2 text-2xl font-bold text-[var(--theme-text)]">{statusLabel}</p>
                  <p className="mt-1 text-xs text-[var(--theme-muted)]">
                    {isRejected ? 'Action required' : 'Admin verification'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isApproved ? (
        <ActiveOrderRequest />
      ) : (
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`rounded-[26px] border ${isApproved ? 'border-emerald-100' : 'border-[var(--theme-chip-border)]'} bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${approvedAccent}`}>
            Review stage
          </p>
          <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
            {isApproved ? 'Delivery access active' : isRejected ? 'Update requested' : 'Verification in progress'}
          </h3>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: CheckCircle2,
                title: 'Profile submitted',
                desc: 'Your rider details and uploaded documents have been received.',
              },
              {
                icon: isRejected ? XCircle : isApproved ? CheckCircle2 : Clock3,
                title: isRejected ? 'Admin requested changes' : isApproved ? 'Admin approved profile' : 'Admin review running',
                desc: isRejected
                  ? rejectionReason || 'Please review your details and submit the corrected registration again.'
                  : isApproved
                    ? 'Your delivery profile is active and ready for live assignment flow.'
                    : 'The team is validating your profile, service area and delivery readiness.',
              },
              {
                icon: Bike,
                title: isApproved ? 'Ready for assignments' : isRejected ? 'Resubmit profile' : 'Go live next',
                desc: isApproved
                  ? 'Pickup requests and delivery actions can appear here when available.'
                  : isRejected
                    ? 'Correct the requested details to move your profile back into review.'
                    : 'Assignments and dashboard actions unlock as soon as approval is complete.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className={`rounded-[18px] border p-4 ${isApproved ? 'border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)]' : 'border-[rgba(249,115,22,0.14)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)]'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl ${isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'}`}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">{item.title}</p>
                      <p className="mt-1 text-[12.5px] leading-6 text-[var(--theme-muted)]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={`rounded-[26px] border ${isApproved ? 'border-emerald-100' : 'border-[var(--theme-chip-border)]'} bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${approvedAccent}`}>
            What to expect
          </p>
          <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
            {isApproved ? 'Available delivery work' : isRejected ? 'Next correction step' : 'What opens after approval'}
          </h3>

          <div className="mt-5 space-y-3">
            {[
              isApproved ? 'Available order requests will now be visible here when the system assigns them.' : 'Pickup request cards will start appearing in your dashboard.',
              isApproved ? 'Keep your availability and delivery readiness up to date.' : 'Route and shift tools will unlock for active delivery work.',
              isApproved ? 'Partner status and assignment summaries can update live.' : 'Partner status and assignment summaries will begin updating live.',
            ].map((line) => (
              <div
                key={line}
                className={`rounded-[18px] border px-4 py-3 ${isApproved ? 'border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)]' : 'border-[rgba(249,115,22,0.14)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)]'}`}
              >
                <p className="text-[13px] font-semibold leading-6 text-[var(--theme-text)]">{line}</p>
              </div>
            ))}
          </div>

          <div className={`mt-5 rounded-[20px] border p-4 ${isApproved ? 'border-emerald-100 bg-emerald-50/70' : 'border-[rgba(249,115,22,0.16)] bg-[var(--theme-accent-soft)]/70'}`}>
            <p className="text-sm font-semibold text-[var(--theme-text)]">
              {isApproved ? 'You are active now.' : isRejected ? 'Please correct and resubmit your registration.' : 'Wait for approval. No action is needed right now.'}
            </p>
            <p className="mt-1 text-[12.5px] leading-6 text-[var(--theme-muted)]">
              {isApproved
                ? 'Order requests will show here as soon as they are available for your delivery profile.'
                : isRejected
                  ? rejectionReason || 'The admin team needs an update before approval.'
                  : 'If the admin team needs any update, your delivery profile can be reviewed again after the requested changes.'}
            </p>
            {isRejected ? (
              <button
                type="button"
                onClick={onReregister}
                className="mt-4 rounded-[14px] bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(249,115,22,0.22)]"
              >
                Update registration
              </button>
            ) : null}
          </div>
        </div>
      </div>
      )}
    </Motion.section>
  )
}

export default DeliveryVerificationWorkspace
