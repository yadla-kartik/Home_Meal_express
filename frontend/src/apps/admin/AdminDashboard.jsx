import React from 'react'
import {
  BadgeCheck,
  Clock3,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Store,
  UserRound,
} from 'lucide-react'
import Navbar from './Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  approveChefApproval,
  getChefApprovals,
  rejectChefApproval,
} from '../../../services/adminAuthService'
import { getAdminSocket } from '../../../services/socket'

const BACKEND_URL = 'http://localhost:5000'

const formatDate = (value) => {
  if (!value) return 'Just now'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const buildImageUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${BACKEND_URL}${path}`
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
          {label}
        </p>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-[var(--theme-text)]">{value}</p>
    </div>
  )
}

function QueueItem({ approval, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[22px] border p-4 text-left transition ${
        isSelected
          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/45 shadow-[var(--theme-shadow-button)]'
          : 'border-[var(--theme-chip-border)] bg-white shadow-[var(--theme-shadow-soft)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--theme-text)]">{approval.kitchenName}</p>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            {approval.chef.name}  {approval.cuisine}
          </p>
        </div>
        <span className="rounded-full border border-[var(--theme-chip-border)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
          Pending
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--theme-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} />
          {approval.nearestStation}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={14} />
          {formatDate(approval.createdAt)}
        </span>
      </div>
    </button>
  )
}

function DetailPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffaf4,#fff)] p-3">
      <div className="flex items-center gap-2 text-[var(--theme-accent)]">
        <Icon size={15} />
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-[var(--theme-text)]">{value}</p>
    </div>
  )
}

function AdminDashboard() {
  const [approvals, setApprovals] = React.useState([])
  const [selectedId, setSelectedId] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActing, setIsActing] = React.useState('')

  React.useEffect(() => {
    let isMounted = true

    const loadApprovals = async () => {
      const res = await getChefApprovals('pending')
      if (!isMounted) return

      const nextApprovals = Array.isArray(res?.approvals) ? res.approvals : []
      setApprovals(nextApprovals)
      setSelectedId((prev) => {
        if (prev && nextApprovals.some((item) => item.id === prev)) return prev
        return nextApprovals[0]?.id || ''
      })
      setIsLoading(false)
    }

    loadApprovals()

    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    const socket = getAdminSocket()

    socket.connect()
    socket.emit('join-admin-room')

    const handleCreated = (approval) => {
      setApprovals((prev) => {
        if (prev.some((item) => item.id === approval.id)) return prev
        return [approval, ...prev]
      })
      setSelectedId((prev) => prev || approval.id)
    }

    const handleUpdated = (approval) => {
      setApprovals((prev) => prev.filter((item) => item.id !== approval.id))
      setSelectedId((prev) => {
        if (prev !== approval.id) return prev
        return ''
      })
    }

    socket.on('chef:approval-created', handleCreated)
    socket.on('chef:approval-updated', handleUpdated)

    return () => {
      socket.off('chef:approval-created', handleCreated)
      socket.off('chef:approval-updated', handleUpdated)
      socket.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (!approvals.length) {
      setSelectedId('')
      return
    }

    if (!selectedId || !approvals.some((item) => item.id === selectedId)) {
      setSelectedId(approvals[0].id)
    }
  }, [approvals, selectedId])

  const selectedApproval = approvals.find((item) => item.id === selectedId) || approvals[0] || null

  const handleDecision = async (type) => {
    if (!selectedApproval || isActing) return

    setIsActing(type)
    const response = type === 'approve'
      ? await approveChefApproval(selectedApproval.id)
      : await rejectChefApproval(selectedApproval.id)
    setIsActing('')

    if (!response?.approval && !response?.message?.includes('successfully')) {
      window.alert(response?.message || 'Unable to update chef approval')
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading admin approvals..." />
  }

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <section className="theme-card-lg rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#fffdf9_48%,#fff4eb)] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                <ShieldCheck size={14} />
                Approval control
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[var(--theme-text)] sm:text-4xl">
                Review new chef registrations the moment they arrive.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted)]">
                Every new chef registration appears here in real time. Open a request, review the details and accept or reject it instantly.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Pending now" value={String(approvals.length)} icon={Clock3} />
              <StatCard label="Live queue" value={approvals.length ? 'Active' : 'Quiet'} icon={ShieldAlert} />
              <StatCard label="Updates" value="Realtime" icon={BadgeCheck} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                  Pending chefs
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">Approval queue</h2>
              </div>
              <span className="rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--theme-accent)]">
                {approvals.length} waiting
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {approvals.length ? (
                approvals.map((approval) => (
                  <QueueItem
                    key={approval.id}
                    approval={approval}
                    isSelected={selectedApproval?.id === approval.id}
                    onSelect={() => setSelectedId(approval.id)}
                  />
                ))
              ) : (
                <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/35 p-6 text-center">
                  <p className="text-lg font-semibold text-[var(--theme-text)]">No pending chef approvals</p>
                  <p className="mt-2 text-sm text-[var(--theme-muted)]">
                    New chef registration requests will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="theme-card rounded-[28px] p-5 sm:p-6">
            {selectedApproval ? (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                      Chef details
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
                      {selectedApproval.kitchenName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                      Review the chef profile, station reach and uploaded documents before approving access.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision('reject')}
                      disabled={Boolean(isActing)}
                      className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isActing === 'reject' ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision('approve')}
                      disabled={Boolean(isActing)}
                      className="rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isActing === 'approve' ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DetailPill icon={UserRound} label="Chef" value={selectedApproval.chef.name} />
                  <DetailPill icon={Phone} label="Phone" value={selectedApproval.chef.phone} />
                  <DetailPill icon={Store} label="Cuisine" value={selectedApproval.cuisine}/>
                  <DetailPill icon={MapPin} label="Nearest station" value={selectedApproval.nearestStation} />
                </div>

                <div className="mt-5 rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffaf4,#fff)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                    Service profile
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <p className="text-sm text-[var(--theme-text)]"><span className="font-semibold">Experience:</span> {selectedApproval.experience} years</p>
                    <p className="text-sm text-[var(--theme-text)]"><span className="font-semibold">Max orders:</span> {selectedApproval.maxOrders} per day</p>
                    <p className="text-sm text-[var(--theme-text)]"><span className="font-semibold">Timing:</span> {selectedApproval.openTime} - {selectedApproval.closeTime}</p>
                    <p className="text-sm text-[var(--theme-text)]"><span className="font-semibold">Prep time:</span> {selectedApproval.prepTime} mins</p>
                  </div>
                  <p className="mt-3 text-sm text-[var(--theme-text)]">
                    <span className="font-semibold">Address:</span> {selectedApproval.addressLine}, {selectedApproval.city}, {selectedApproval.state} - {selectedApproval.zip}
                  </p>
                  <p className="mt-2 text-sm text-[var(--theme-text)]">
                    <span className="font-semibold">Available days:</span> {selectedApproval.availableDays.join(', ') || 'Not provided'}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      Chef photo
                    </p>
                    <img
                      src={buildImageUrl(selectedApproval.documents.chefPhoto)}
                      alt={selectedApproval.chef.name}
                      className="mt-3 h-64 w-full rounded-[20px] object-cover"
                    />
                  </div>
                  <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      ID proof
                    </p>
                    <img
                      src={buildImageUrl(selectedApproval.documents.idProof)}
                      alt="Chef ID proof"
                      className="mt-3 h-64 w-full rounded-[20px] object-cover"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/25 p-6 text-center">
                <div>
                  <p className="text-xl font-semibold text-[var(--theme-text)]">Queue is clear right now</p>
                  <p className="mt-2 text-sm text-[var(--theme-muted)]">
                    As soon as a chef submits registration, this panel will update in real time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
