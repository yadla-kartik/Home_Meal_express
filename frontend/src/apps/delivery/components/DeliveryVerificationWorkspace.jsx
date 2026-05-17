import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  Wallet,
  XCircle,
} from 'lucide-react'
import { acceptDeliveryOrder } from '../../../../services/deliveryAuthService'

function StatusProgressRing({ color = '#10b981', secondaryColor = 'rgba(16,185,129,0.16)' }) {
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
          stroke={secondaryColor}
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
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
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

function ActiveOrderRequest({ theme = 'orange', orders = [] }) {
  const navigate = useNavigate()
  const safeOrders = Array.isArray(orders) ? orders : []
  const [selectedOrderId, setSelectedOrderId] = React.useState(safeOrders[0].id)
  const [acceptingOrderId, setAcceptingOrderId] = React.useState('')
  const [acceptError, setAcceptError] = React.useState('')
  const selectedOrder = safeOrders.find((order) => order.id === selectedOrderId) || safeOrders[0]

  React.useEffect(() => {
    if (!safeOrders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(safeOrders[0]?.id || '')
    }
  }, [safeOrders, selectedOrderId])

  if (!safeOrders.length || !selectedOrder) return null

  const isOrange = theme === 'orange'
  const primaryColor = isOrange ? 'orange-600' : 'emerald-600'
  const primaryText = isOrange ? 'text-orange-700' : 'text-emerald-700'
  const primaryBorder = isOrange ? 'border-orange-100' : 'border-emerald-100'
  const primaryBg = isOrange ? 'bg-orange-50' : 'bg-emerald-50'
  const accentText = isOrange ? 'text-orange-600' : 'text-emerald-600'
  const cardBorder = isOrange ? 'border-orange-300' : 'border-emerald-300'
  const cardGradient = isOrange ? 'bg-[linear-gradient(135deg,#fff7ed,#ffffff)]' : 'bg-[linear-gradient(135deg,#ecfdf5,#ffffff)]'
  const buttonShadow = isOrange ? 'shadow-[0_12px_24px_rgba(249,115,22,0.24)]' : 'shadow-[0_12px_24px_rgba(16,185,129,0.24)]'

  const handleAcceptOrder = async () => {
    if (!selectedOrder?.id || acceptingOrderId) return

    setAcceptError('')
    setAcceptingOrderId(selectedOrder.id)
    const response = await acceptDeliveryOrder(selectedOrder.id)
    setAcceptingOrderId('')

    if (response?.success) {
      navigate(`/delivery/order/${response.data?.id || selectedOrder.id}`)
      return
    }

    setAcceptError(response?.message || 'Unable to accept this order right now.')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
      <div className={`rounded-[26px] border ${primaryBorder} bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${primaryText}`}>
              New Orders
            </p>
            <h3 className="mt-1 text-2xl font-black leading-tight text-[var(--theme-text)]">
              Requests
            </h3>
          </div>

          <span className={`inline-flex w-fit items-center gap-2 rounded-full border ${isOrange ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'} px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider`}>
            {safeOrders.length} LIVE
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {safeOrders.map((order) => {
            const selected = order.id === selectedOrder.id

            return (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-[18px] border p-3.5 text-left transition ${
                  selected
                    ? `${cardBorder} ${cardGradient} shadow-sm`
                    : `${primaryBorder} bg-white hover:border-orange-200`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${primaryText}`}>
                      #{order.id}
                    </p>
                    <h4 className="mt-0.5 truncate text-sm font-bold text-[var(--theme-text)]">
                      {order.restaurant}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${accentText}`}>{order.amount}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`rounded-[26px] border ${primaryBorder} bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6`}>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${primaryText}`}>
          Trip Details
        </p>
        <h3 className="mt-1 text-2xl font-black leading-tight text-[var(--theme-text)]">
          Quick View
        </h3>

        <div className={`mt-5 rounded-[20px] border ${primaryBorder} ${cardGradient} p-3.5 shadow-[var(--theme-shadow-soft)]`}>
          <div className="flex items-start gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white ${accentText} shadow-sm`}>
              <PackageCheck size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${primaryText}`}>
                    Selected
                  </p>
                  <h4 className="mt-0.5 text-base font-bold leading-snug text-[var(--theme-text)]">
                    {selectedOrder.items} from {selectedOrder.restaurant}
                  </h4>
                </div>
                <p className={`text-lg font-black ${accentText}`}>{selectedOrder.amount}</p>
              </div>

              <div className="mt-3.5 space-y-2">
                <div className={`rounded-[14px] border ${primaryBorder} bg-white px-3 py-2.5`}>
                  <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${primaryText}`}>
                    <Store size={11} />
                    Kitchen
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-[var(--theme-text)]">{selectedOrder.kitchenAddress}</p>
                </div>

                <div className="flex gap-2">
                  <div className={`flex-1 rounded-[14px] border ${primaryBorder} bg-white px-3 py-2.5`}>
                    <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${primaryText}`}>
                      <Bike size={11} />
                      Train
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold text-[var(--theme-text)]">{selectedOrder.trainName}</p>
                  </div>
                  <div className={`flex-1 rounded-[14px] border ${primaryBorder} bg-white px-3 py-2.5`}>
                    <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${primaryText}`}>
                      <span className="text-[10px] font-bold">#</span>
                      Number
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold text-[var(--theme-text)]">{selectedOrder.trainNumber}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className={`flex-1 rounded-[14px] border ${primaryBorder} bg-white px-3 py-2.5`}>
                    <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${primaryText}`}>
                      <Navigation size={11} />
                      Dist
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold text-[var(--theme-text)]">{selectedOrder.kitchenDistance}</p>
                  </div>
                  <div className={`flex-1 rounded-[14px] border ${primaryBorder} bg-white px-3 py-2.5`}>
                    <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${primaryText}`}>
                      <Clock3 size={11} />
                      Time
                    </p>
                    <p className="mt-0.5 text-[12px] font-bold text-[var(--theme-text)]">{selectedOrder.deliveryTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-5 rounded-[22px] border ${primaryBorder} ${isOrange ? 'bg-orange-50/70' : 'bg-emerald-50/70'} p-4`}>
          <div className="flex items-center gap-3">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white ${accentText} shadow-[var(--theme-shadow-soft)]`}>
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
            onClick={handleAcceptOrder}
            disabled={Boolean(acceptingOrderId)}
            className={`rounded-[16px] border ${isOrange ? 'border-orange-200 bg-orange-600 hover:bg-orange-700' : 'border-emerald-200 bg-emerald-600 hover:bg-emerald-700'} px-5 py-3 text-sm font-semibold text-white ${buttonShadow} transition`}
          >
            {acceptingOrderId === selectedOrder.id ? 'Accepting...' : 'Accept order'}
          </button>
          <button
            type="button"
            className="rounded-[16px] border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Decline
          </button>
        </div>
        {acceptError ? (
          <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            {acceptError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function DeliveryApprovedOverview() {
  const cards = [
    {
      icon: CheckCircle2,
      eyebrow: 'Approved',
      title: 'Profile active',
      desc: 'Your delivery profile has cleared admin verification and is ready for live pickup assignments.',
    },
    {
      icon: Bike,
      eyebrow: 'Next',
      title: 'Wait for orders',
      desc: 'When a meal pickup is assigned, this setup view will be replaced by the live request and quick-view cards.',
    },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.title}
            className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {card.eyebrow}
                </p>
                <h3 className="mt-2 text-[26px] font-bold leading-tight text-[var(--theme-text)]">
                  {card.title}
                </h3>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-[var(--theme-shadow-soft)]">
                <Icon size={21} />
              </span>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-[var(--theme-muted)]">
              {card.desc}
            </p>

            <div className="mt-5 rounded-[20px] border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-sm font-semibold text-[var(--theme-text)]">
                Delivery workspace is ready
              </p>
              <p className="mt-1 text-[12.5px] leading-5 text-[var(--theme-muted)]">
                Keep the dashboard open to receive incoming assignments in real time.
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DeliveryVerificationWorkspace({ status = 'pending', rejectionReason = '', onReregister, activeOrders = [] }) {
  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'
  const hasAssignedOrders = isApproved && Array.isArray(activeOrders) && activeOrders.length > 0
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
      {isApproved && !hasAssignedOrders && (
        <div className={`relative overflow-hidden rounded-[30px] border ${approvedPanelBorder} ${approvedPanelBg} p-4 shadow-[var(--theme-shadow-card)] sm:p-5`}>
          <div className="rounded-[24px] border border-emerald-100 bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_8px_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em]">
                  <ShieldCheck size={13} />
                  Delivery verification
                </div>

                <h2
                  className="mt-4 max-w-2xl text-[26px] font-semibold leading-[1.08] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Your delivery profile is
                  <span className="font-semibold italic text-emerald-600"> active</span>.
                </h2>

                <p className="mt-4 max-w-3xl text-[13px] leading-7 text-[var(--theme-muted)] sm:text-[14px]">
                  Your registration has been approved. Available delivery requests can now appear on your dashboard.
                </p>
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)] px-5 py-4 text-center shadow-[var(--theme-shadow-soft)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Current status
                </p>
                <StatusProgressRing color="#10b981" secondaryColor="rgba(16,185,129,0.16)" />
              </div>
            </div>
          </div>
        </div>
      )}

      {(!isApproved) && (
        <div className={`overflow-hidden rounded-[30px] border ${approvedPanelBorder} ${approvedPanelBg} p-4 shadow-[var(--theme-shadow-card)] sm:p-5`}>
          <div className={`rounded-[24px] border border-[rgba(249,115,22,0.12)] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_8px_40px_rgba(249,115,22,0.07)] backdrop-blur-sm sm:p-6`}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[rgba(255,255,255,0.72)] text-[var(--theme-accent)] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em]">
                  <ShieldCheck size={13} />
                  Delivery verification
                </div>

                <h2
                  className="mt-4 max-w-2xl text-[26px] font-semibold leading-[1.08] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {isRejected ? 'Your delivery profile needs' : 'Your delivery profile is'}
                  <span className="font-semibold italic text-[var(--theme-accent)]">
                    {isRejected ? ' changes' : ' under review'}
                  </span>.
                </h2>

                <p className="mt-4 max-w-3xl text-[13px] leading-7 text-[var(--theme-muted)] sm:text-[14px]">
                  {isRejected
                    ? 'The admin team reviewed your registration and requested a correction before activation.'
                    : 'Your registration has been received successfully. The admin team is now reviewing your delivery details before activation.'}
                </p>
              </div>

              <div className="rounded-[24px] border border-[rgba(249,115,22,0.14)] bg-white/90 px-5 py-4 text-center shadow-[var(--theme-shadow-soft)]">
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${approvedAccent}`}>
                  Current status
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--theme-text)]">{statusLabel}</p>
                <p className="mt-1 text-xs text-[var(--theme-muted)]">
                  {isRejected ? 'Action required' : 'Admin verification'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasAssignedOrders ? (
        <ActiveOrderRequest theme="orange" orders={activeOrders} />
      ) : isApproved ? (
        <DeliveryApprovedOverview />
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
