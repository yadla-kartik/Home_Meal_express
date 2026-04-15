import React from 'react'
import {
  CheckCircle,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Store,
  UserRound,
  X,
  XCircle,
  ArrowLeft,
} from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import {
  approveChefApproval,
  getChefApprovals,
  rejectChefApproval,
} from '../../../../services/adminAuthService'
import { getAdminSocket } from '../../../../services/socket'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const surfaceShellCls =
  'rounded-[22px] border border-[var(--theme-chip-border)] bg-white shadow-[var(--theme-shadow-card)]'

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

const mergeApprovals = (current, incoming) => {
  const map = new Map()
  current.forEach((item) => map.set(item.id, item))
  incoming.forEach((item) => map.set(item.id, item))
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
  )
}

function QueueItem({ approval, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
        isSelected
          ? 'border-[rgba(249,115,22,0.34)] bg-[linear-gradient(180deg,#fff9f4_0%,#ffeddc_58%,#ffe4cb_100%)] shadow-[0_16px_32px_rgba(249,115,22,0.14)]'
          : 'border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] shadow-[0_8px_18px_rgba(15,23,42,0.04)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[var(--theme-text)]">{approval.kitchenName}</p>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            {approval.chef.name} · {approval.cuisine}
          </p>
        </div>
        <span
          className={`rounded-full border border-[rgba(249,115,22,0.18)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)] ${
            isSelected ? 'bg-white' : 'bg-[#fff7ef]'
          }`}
        >
          Pending
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-[var(--theme-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} />
          {approval.nearestStation}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} />
          {formatDate(approval.createdAt)}
        </span>
      </div>
    </button>
  )
}

function DetailPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3">
      <div className="flex items-center gap-2 text-[var(--theme-accent)]">
        <Icon size={13} />
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-2 text-[13px] font-semibold text-[var(--theme-text)]">{value}</p>
    </div>
  )
}

const getFileName = (path, fallback) => {
  if (!path) return fallback
  const clean = path.split('?')[0]
  const parts = clean.split('/')
  return parts[parts.length - 1] || fallback
}

function ImageCard({ label, imagePath, alt, onOpen }) {
  const imageUrl = buildImageUrl(imagePath)
  const fileName = getFileName(imagePath, label)

  return (
    <div className="rounded-[16px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
            {label}
          </p>
          <p className="mt-1 truncate text-[12px] font-semibold text-[var(--theme-text)]">
            {fileName}
          </p>
        </div>

        <a
          href={imageUrl}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,115,22,0.16)] bg-[var(--theme-accent-soft)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--theme-accent)] transition hover:bg-white"
        >
          <Download size={12} />
          Download
        </a>
      </div>

      <button
        type="button"
        onClick={() => onOpen({ label, imageUrl, fileName, alt })}
        className="group mt-3 block w-full overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,#fffaf4,#fff)] outline-none ring-0 transition hover:-translate-y-0.5"
      >
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,#fffaf4,#fff)]">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full cursor-pointer object-contain bg-[#fffdfa] p-1 transition duration-300 group-hover:scale-[1.02]"
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgba(15,23,42,0.06)_76%,rgba(15,23,42,0.24)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-[var(--theme-text)] shadow-[0_10px_24px_rgba(15,23,42,0.16)] opacity-0 transition duration-300 group-hover:opacity-100">
            <ExternalLink size={12} />
            Open
          </span>
        </div>
      </button>
    </div>
  )
}

function ChefVerification({ onBack }) {
  const [approvals, setApprovals] = React.useState([])
  const [selectedId, setSelectedId] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActing, setIsActing] = React.useState('')
  const [previewImage, setPreviewImage] = React.useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [rejectError, setRejectError] = React.useState('')

  React.useEffect(() => {
    let isMounted = true

    const loadApprovals = async () => {
      const res = await getChefApprovals('pending')
      if (!isMounted) return

      const nextApprovals = Array.isArray(res?.approvals) ? res.approvals : []
      setApprovals((prev) => {
        const mergedApprovals = mergeApprovals(prev, nextApprovals)
        setSelectedId((selectedPrev) => {
          if (selectedPrev && mergedApprovals.some((item) => item.id === selectedPrev)) {
            return selectedPrev
          }
          return mergedApprovals[0]?.id || ''
        })
        return mergedApprovals
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

    const joinAdminRoom = () => {
      socket.emit('join-admin-room')
    }

    socket.on('connect', joinAdminRoom)
    socket.connect()
    if (socket.connected) {
      joinAdminRoom()
    }

    const handleCreated = (approval) => {
      setApprovals((prev) => mergeApprovals(prev, [approval]))
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
      socket.off('connect', joinAdminRoom)
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

  const closeRejectModal = () => {
    if (isActing === 'reject') return
    setIsRejectModalOpen(false)
    setRejectionReason('')
    setRejectError('')
  }

  const handleApprove = async () => {
    if (!selectedApproval || isActing) return

    setIsActing('approve')
    const response = await approveChefApproval(selectedApproval.id)
    setIsActing('')

    if (!response?.approval && !response?.message?.includes('successfully')) {
      window.alert(response?.message || 'Unable to update chef approval')
    }
  }

  const handleRejectSubmit = async () => {
    if (!selectedApproval || isActing) return

    const trimmedReason = rejectionReason.trim()
    if (!trimmedReason) {
      setRejectError('Please enter a rejection reason')
      return
    }

    setRejectError('')
    setIsActing('reject')
    const response = await rejectChefApproval(selectedApproval.id, trimmedReason)
    setIsActing('')

    if (!response?.approval && !response?.message?.includes('successfully')) {
      setRejectError(response?.message || 'Unable to reject chef approval')
      return
    }

    closeRejectModal()
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading chef approvals..." />
  }

  return (
    <>
      {/* Back button + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            height: '38px',
            width: '38px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '12px',
            border: '1px solid var(--theme-surface-border)',
            background: 'var(--theme-surface)',
            color: 'var(--theme-muted)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--theme-accent)'
            e.currentTarget.style.borderColor = 'var(--theme-accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--theme-muted)'
            e.currentTarget.style.borderColor = 'var(--theme-surface-border)'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--theme-text)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>Chef Verification</h2>
          <p style={{
            fontSize: '12px',
            color: 'var(--theme-muted)',
            marginTop: '2px',
            fontWeight: 500,
          }}>Review and approve pending chef registrations</p>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
        <div className={`${surfaceShellCls} h-fit p-0`}>
          <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
              Pending chefs
            </p>
            <span className="rounded-full border border-[rgba(249,115,22,0.16)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--theme-accent)]">
              {approvals.length} waiting
            </span>
          </div>

          <div className="border-t border-[rgba(249,115,22,0.12)] px-3 pb-3 pt-3">
            <div className="space-y-3">
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
              <div className="rounded-[16px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-5 text-center shadow-[var(--theme-shadow-soft)]">
                <p className="text-base font-semibold text-[var(--theme-text)]">No pending chef approvals</p>
                <p className="mt-2 text-sm text-[var(--theme-muted)]">
                  New chef registration requests will appear here automatically.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {selectedApproval ? (
            <>
              <div className={`${surfaceShellCls} relative overflow-hidden p-4`}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                      Chef details
                    </p>
                    <h2 className="mt-1.5 text-[19px] font-bold text-[var(--theme-text)]">
                      {selectedApproval.kitchenName}
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-5 text-[var(--theme-muted)]">
                      Review the chef profile, station reach and uploaded documents before approving access.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectError('')
                        setRejectionReason('')
                        setIsRejectModalOpen(true)
                      }}
                      disabled={Boolean(isActing)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-[#fecaca] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#dc2626] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={Boolean(isActing)}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-[11px] font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <CheckCircle size={14} />
                      {isActing === 'approve' ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DetailPill icon={UserRound} label="Chef" value={selectedApproval.chef.name} />
                  <DetailPill icon={Phone} label="Phone" value={selectedApproval.chef.phone} />
                  <DetailPill icon={Store} label="Cuisine" value={selectedApproval.cuisine} />
                  <DetailPill icon={MapPin} label="Nearest station" value={selectedApproval.nearestStation} />
                </div>
              </div>

              <div className={`${surfaceShellCls} p-4`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  Service profile
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]"><span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Experience</span><span className="mt-2 block font-semibold">{selectedApproval.experience} years</span></p>
                  <p className="rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]"><span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Max orders / day</span><span className="mt-2 block font-semibold">{selectedApproval.maxOrders} per day</span></p>
                  <p className="rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]"><span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Timing</span><span className="mt-2 block font-semibold">{selectedApproval.openTime} - {selectedApproval.closeTime}</span></p>
                  <p className="rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]"><span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Prep time</span><span className="mt-2 block font-semibold">{selectedApproval.prepTime} mins</span></p>
                </div>
                <p className="mt-3 rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Available days</span>
                  <span className="mt-2 block font-semibold">{selectedApproval.availableDays.join(', ') || 'Not provided'}</span>
                </p>
                <p className="mt-3 rounded-[14px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3 py-3 text-[13px] text-[var(--theme-text)]">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Full address</span>
                  <span className="mt-2 block font-semibold">{selectedApproval.addressLine}, {selectedApproval.city}, {selectedApproval.state} - {selectedApproval.zip}</span>
                </p>
              </div>

              <div className={`${surfaceShellCls} p-4`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      Chef photos &amp; ID proof
                    </p>
                    <p className="mt-1.5 text-[12px] leading-5 text-[var(--theme-muted)]">
                      Open any image to inspect it closely or download the original file.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <ImageCard
                    label="Chef photo"
                    imagePath={selectedApproval.documents.chefPhoto}
                    alt={selectedApproval.chef.name}
                    onOpen={setPreviewImage}
                  />
                  <ImageCard
                    label="ID proof"
                    imagePath={selectedApproval.documents.idProof}
                    alt="Chef ID proof"
                    onOpen={setPreviewImage}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={`${surfaceShellCls} flex min-h-[420px] items-center justify-center p-6 text-center`}>
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,23,42,0.7)] px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.24)] sm:p-5">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex flex-col gap-3 pr-14 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  {previewImage.label}
                </p>
                <p className="mt-1 truncate text-base font-semibold text-[var(--theme-text)]">
                  {previewImage.fileName}
                </p>
              </div>

              <a
                href={previewImage.imageUrl}
                download={previewImage.fileName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)]"
              >
                <Download size={15} />
                Download
              </a>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/25">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.alt}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,23,42,0.58)] px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffdf9,#fff6ee)] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.24)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc2626]">
                  Reject chef request
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
                  Add rejection reason
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                  This reason will be saved and shown to the chef inside the rejected status screen.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRejectModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                Rejection reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value)
                  if (rejectError) setRejectError('')
                }}
                rows={5}
                placeholder="Write why this profile is being rejected and what needs to be corrected."
                className="mt-2 w-full rounded-[22px] border border-[var(--theme-chip-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--theme-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-accent)]"
              />
              {rejectError ? (
                <p className="mt-2 text-sm font-medium text-[#dc2626]">{rejectError}</p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={isActing === 'reject'}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={isActing === 'reject'}
                className="rounded-2xl bg-[#dc2626] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(220,38,38,0.22)] transition hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isActing === 'reject' ? 'Submitting...' : 'Submit rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChefVerification
