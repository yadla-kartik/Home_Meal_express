import React, { useEffect, useState } from 'react'
import {
  CheckCircle,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Bike,
  X,
  XCircle,
  ArrowLeft,
  IdCard,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Briefcase,
  User,
  BadgeCheck
} from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import {
  approveDeliveryApproval,
  getDeliveryApprovals,
  rejectDeliveryApproval,
} from '../../../../services/adminAuthService'
import { getAdminSocket } from '../../../../services/socket'

const surfaceShellCls = 'rounded-[22px] border border-[rgba(249,115,22,0.18)] bg-white shadow-[0_4px_24px_rgba(249,115,22,0.03)]'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const normalizeApprovalStatus = (status) => (
  ['pending', 'approved', 'all'].includes(status) ? status : 'pending'
)

const getApprovalModeMeta = (mode) => {
  if (mode === 'all') {
    return {
      apiStatus: 'all',
      title: 'All riders',
      countLabel: 'total',
      emptyTitle: 'No rider profiles yet',
      emptyText: 'Delivery applications will appear here automatically.',
      emptyDetailTitle: 'No rider profiles found',
      emptyDetailText: 'Once riders register, their verification status will appear here.',
    }
  }

  if (mode === 'approved') {
    return {
      apiStatus: 'approved',
      title: 'Verified riders',
      countLabel: 'verified',
      emptyTitle: 'No verified riders',
      emptyText: 'Approved rider profiles will appear here automatically.',
      emptyDetailTitle: 'No rider profiles verified',
      emptyDetailText: 'Profiles approved by admin will appear in this list.',
    }
  }

  return {
    apiStatus: 'pending',
    title: 'Pending Riders',
    countLabel: 'waiting',
    emptyTitle: 'No pending riders',
    emptyText: 'New delivery applications will appear here automatically.',
    emptyDetailTitle: 'No delivery profiles pending',
    emptyDetailText: 'Approved and rejected profiles are already out of this review list.',
  }
}

const getStatusRank = (status) => {
  if (status === 'pending') return 0
  if (status === 'rejected') return 1
  if (status === 'approved') return 2
  return 3
}

const sortApprovalsForMode = (items, mode) => {
  return [...items].sort((a, b) => {
    if (mode === 'all') {
      const statusDiff = getStatusRank(a.status) - getStatusRank(b.status)
      if (statusDiff !== 0) return statusDiff
    }

    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
}

const buildImageUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${BACKEND_URL}${path}`
}

const getFileName = (path, fallback) => {
  if (!path) return fallback
  const clean = path.split('?')[0]
  const parts = clean.split('/')
  return parts[parts.length - 1] || fallback
}

const mergeApprovals = (current, incoming) => {
  const map = new Map()
  current.forEach((item) => map.set(item.id, item))
  incoming.forEach((item) => map.set(item.id, item))
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
  )
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const maskAadhaar = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `XXXX-XXXX-${value.slice(-4)}`;
};

const maskAccount = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"X".repeat(value.length - 4)}${value.slice(-4)}`;
};

// COMPONENT PRIMITIVES
function Section({ title, icon, children, compact = false }) {
  return (
    <div className="bg-white rounded-[20px] border border-[rgba(249,115,22,0.25)] shadow-[0_4px_16px_rgba(249,115,22,0.03)] overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-[rgba(249,115,22,0.15)] flex items-center gap-1 bg-[linear-gradient(180deg,#fffaf4,#fff7f0)]">
        {icon}
        <h3 className="text-[14px] font-semibold text-[var(--theme-text-strong)]">{title}</h3>
      </div>
      <div
        className={`${compact ? 'p-3' : 'p-5'} grid grid-cols-1 sm:grid-cols-2 ${compact ? "gap-y-4 gap-x-4" : "gap-y-5 gap-x-6"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[rgba(249,115,22,0.2)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3.5 py-3 min-w-[110px] shadow-[0_4px_12px_rgba(249,115,22,0.04)] transition-transform hover:-translate-y-0.5">
      <p className="text-[10px] text-[var(--theme-muted)] flex items-center gap-1 font-semibold uppercase tracking-[0.12em]">
        <span className="text-[#f97316] opacity-80">{icon}</span>
        {label}
      </p>
      <p className="text-[14px] font-medium text-[var(--theme-text-strong)] mt-1.5">{value || "-"}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] flex items-center gap-1.5 mb-1.5">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        {label}
      </p>
      <p className="text-[14px] font-medium text-[var(--theme-text)] break-words leading-snug">{value || "-"}</p>
    </div>
  );
}

function QueueItem({ approval, isSelected, onSelect, mode }) {
  const status = approval.status || 'pending'
  const statusLabel = status === 'approved' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Pending'
  const tone = mode === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'
  const selectedCls = {
    orange: 'border-[var(--theme-accent)] bg-[linear-gradient(180deg,#fffcf9,#fff7f0)] shadow-[0_8px_20px_rgba(249,115,22,0.08)]',
    green: 'border-emerald-200 bg-[linear-gradient(180deg,#f0fdf4_0%,#dcfce7_100%)] shadow-[0_16px_32px_rgba(16,185,129,0.12)]',
    red: 'border-red-200 bg-[linear-gradient(180deg,#fff7f7_0%,#fee2e2_100%)] shadow-[0_16px_32px_rgba(220,38,38,0.10)]',
  }[tone]
  const idleCls = {
    orange: 'border-[rgba(249,115,22,0.15)] bg-white hover:bg-[#fffdfa] hover:border-[rgba(249,115,22,0.3)]',
    green: 'border-emerald-100 bg-[linear-gradient(180deg,#ffffff,#f5fff9)] shadow-[0_8px_18px_rgba(15,23,42,0.04)] hover:-translate-y-0.5',
    red: 'border-red-100 bg-[linear-gradient(180deg,#ffffff,#fff7f7)] shadow-[0_8px_18px_rgba(15,23,42,0.04)] hover:-translate-y-0.5',
  }[tone]
  const badgeCls = {
    orange: `${isSelected ? 'bg-[#fff6ef] border-[rgba(249,115,22,0.2)] text-[var(--theme-accent)]' : 'bg-white border-slate-200 text-slate-500'}`,
    green: `border-emerald-200 text-emerald-700 ${isSelected ? 'bg-white' : 'bg-emerald-50'}`,
    red: `border-red-200 text-red-600 ${isSelected ? 'bg-white' : 'bg-red-50'}`,
  }[tone]
  const metaIconCls = tone === 'green' ? 'text-emerald-600' : tone === 'red' ? 'text-red-500' : 'text-[var(--theme-accent)]'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[20px] border px-4 py-4 text-left transition duration-150 ease-out ${isSelected ? selectedCls : idleCls}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[var(--theme-text-strong)]">{approval.name}</p>
          <p className="mt-1 text-[11px] text-[var(--theme-accent)] uppercase font-semibold tracking-[0.12em]">
            {approval.vehicleNumber ? `Plate ${approval.vehicleNumber}` : 'Bike details pending'}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badgeCls}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} className={`${metaIconCls} opacity-70`} />
          {approval.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} className={`${metaIconCls} opacity-70`} />
          {formatDate(approval.createdAt)}
        </span>
      </div>
    </button>
  )
}

function ImageCard({ label, imagePath, alt, onOpen }) {
  const imageUrl = buildImageUrl(imagePath)
  const fileName = getFileName(imagePath, label)

  if (!imageUrl) {
    return null
  }

  return (
    <div className="rounded-[16px] border border-[rgba(249,115,22,0.25)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-2 shadow-[0_4px_16px_rgba(249,115,22,0.03)]">
      <div className="flex items-center justify-between px-1">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f97316]">
            {label}
          </p>
        </div>
        <a
          href={imageUrl}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[rgba(249,115,22,0.15)] bg-[var(--theme-accent-soft)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--theme-accent)] transition hover:bg-white"
        >
          <Download size={10} />
          Save
        </a>
      </div>

      <button
        type="button"
        onClick={() => onOpen({ label, imageUrl, fileName, alt })}
        className="group mt-1 block w-full overflow-hidden rounded-[12px] bg-[#fffcf9] border border-[rgba(249,115,22,0.12)] hover:border-[#f97316]/40 transition"
      >
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-[12px]">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover p-1 transition duration-150 ease-out group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold text-[var(--theme-text-strong)] shadow-[0_12px_24px_rgba(249,115,22,0.15)] opacity-0 transition duration-150 ease-out group-hover:opacity-100">
            <ExternalLink size={12} />
            View
          </span>
        </div>
      </button>
    </div>
  )
}

// MAIN COMPONENT
function DeliveryVerification({ onBack, approvalStatus = 'pending' }) {
  const approvalMode = normalizeApprovalStatus(approvalStatus)
  const modeMeta = getApprovalModeMeta(approvalMode)
  const [approvals, setApprovals] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isActing, setIsActing] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectError, setRejectError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadApprovals = async () => {
      setIsLoading(true)
      const res = await getDeliveryApprovals(modeMeta.apiStatus)
      if (!isMounted) return

      const nextApprovals = Array.isArray(res?.approvals) ? res.approvals : []
      const sortedApprovals = sortApprovalsForMode(nextApprovals, approvalMode)

      setApprovals(sortedApprovals)
      setSelectedId((selectedPrev) => {
        if (selectedPrev && sortedApprovals.some((item) => item.id === selectedPrev)) {
          return selectedPrev
        }
        return sortedApprovals[0]?.id || ''
      })
      setIsLoading(false)
    }

    loadApprovals()

    return () => {
      isMounted = false
    }
  }, [approvalMode, modeMeta.apiStatus])

  useEffect(() => {
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
      if (approvalMode === 'approved') return

      setApprovals((prev) => sortApprovalsForMode(mergeApprovals(prev, [approval]), approvalMode))
      setSelectedId((prev) => prev || approval.id)
    }

    const handleUpdated = (approval) => {
      setApprovals((prev) => {
        if (approvalMode === 'all') {
          return sortApprovalsForMode(mergeApprovals(prev, [approval]), approvalMode)
        }

        if (approvalMode === 'approved' && approval.status === 'approved') {
          return sortApprovalsForMode(mergeApprovals(prev, [approval]), approvalMode)
        }

        return prev.filter((item) => item.id !== approval.id)
      })
      setSelectedId((prev) => {
        if (prev !== approval.id) return prev
        return ''
      })
    }

    socket.on('delivery:approval-created', handleCreated)
    socket.on('delivery:approval-updated', handleUpdated)

    return () => {
      socket.off('connect', joinAdminRoom)
      socket.off('delivery:approval-created', handleCreated)
      socket.off('delivery:approval-updated', handleUpdated)
      socket.disconnect()
    }
  }, [approvalMode])

  const selectedApproval = approvals.find((item) => item.id === selectedId) || approvals[0] || null

  const closeRejectModal = () => {
    if (isActing === 'reject') return
    setIsRejectModalOpen(false)
    setRejectionReason('')
    setRejectError('')
  }

  const handleApprove = async () => {
    if (!selectedApproval || selectedApproval.status !== 'pending' || isActing) return

    setIsActing('approve')
    const response = await approveDeliveryApproval(selectedApproval.id)
    setIsActing('')

    if (!response?.approval && !response?.message?.includes('successfully')) {
      window.alert(response?.message || 'Unable to update delivery approval')
    }
  }

  const handleRejectSubmit = async () => {
    if (!selectedApproval || selectedApproval.status !== 'pending' || isActing) return

    const trimmedReason = rejectionReason.trim()
    if (!trimmedReason) {
      setRejectError('Please enter a rejection reason')
      return
    }

    setRejectError('')
    setIsActing('reject')
    const response = await rejectDeliveryApproval(selectedApproval.id, trimmedReason)
    setIsActing('')

    if (!response?.approval && !response?.message?.includes('successfully')) {
      setRejectError(response?.message || 'Unable to reject delivery approval')
      return
    }

    closeRejectModal()
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading delivery approvals..." />
  }

  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)] items-start">
        {/* Left Side Queue */}
        <div className={`${surfaceShellCls} p-0 sticky top-20`}>
          <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-5 border-b border-[rgba(249,115,22,0.12)] bg-[#fffaf4] rounded-t-[22px]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="h-8 w-8 rounded-lg border border-[rgba(249,115,22,0.15)] bg-white text-[var(--theme-muted)] flex items-center justify-center transition-all hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]"
              >
                <ArrowLeft size={16} />
              </button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                {modeMeta.title}
              </p>
            </div>
            <span className="rounded-full border border-[rgba(249,115,22,0.16)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--theme-accent)]">
              {approvals.length} {modeMeta.countLabel}
            </span>
          </div>

          <div className="px-4 pb-4 pt-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {approvals.length ? (
                approvals.map((approval) => (
                  <QueueItem
                    key={approval.id}
                    approval={approval}
                    isSelected={selectedApproval?.id === approval.id}
                    onSelect={() => setSelectedId(approval.id)}
                    mode={approvalMode}
                  />
                ))
              ) : (
                <div className="rounded-[16px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-5 text-center shadow-[var(--theme-shadow-soft)]">
                  <p className="text-[14px] font-semibold text-[var(--theme-text)]">{modeMeta.emptyTitle}</p>
                  <p className="mt-2 text-[12px] leading-5 text-[var(--theme-muted)]">
                    {modeMeta.emptyText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col flex-1 min-w-0 h-full">
          {selectedApproval ? (
            <div className="rounded-[28px] bg-[#ffffff] border border-[rgba(249,115,22,0.18)] shadow-[0_12px_40px_rgba(249,115,22,0.06)] overflow-hidden pb-4">
              <div className="px-3 pt-4 md:px-4 md:pt-5 relative z-10">
                <div className="relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 rounded-2xl border border-[var(--theme-surface-border)] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(249,115,22,0.82),transparent)]" />
                  {/* Photo and Titles */}
                  <div className="relative flex items-center gap-5">
                    <div className="relative group shrink-0">
                      <img
                        src={buildImageUrl(selectedApproval.documents.profilePhoto)}
                        alt="Profile"
                        className="w-[110px] h-[110px] rounded-[22px] object-cover border-[4px] border-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] bg-[var(--theme-app-bg)]"
                      />
                      <a
                        href={buildImageUrl(selectedApproval.documents.profilePhoto)}
                        download={`${selectedApproval.name}_profile.jpg`}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform active:scale-95"
                        title="Download Profile"
                      >
                        <Download size={14} strokeWidth={3} />
                      </a>
                    </div>
                    <div className="pt-2">
                      <h1 className="text-[20px] md:text-[22px] font-bold text-[var(--theme-text-strong)] tracking-tight leading-tight">{selectedApproval.name}</h1>
                      <p className="text-[13px] font-bold text-slate-500 mt-0.5">{selectedApproval.email}</p>
                      <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[9px] font-semibold uppercase tracking-[0.14em] ${
                        selectedApproval.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        <BadgeCheck size={12} strokeWidth={3} />
                        {selectedApproval.status === 'approved' ? 'Verified' : selectedApproval.status === 'rejected' ? 'Rejected' : 'Under Review'}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Mini Stats */}
                  <div className="relative flex flex-col items-end gap-4 w-full lg:w-auto mt-2 lg:mt-0">
                    {selectedApproval.status === 'pending' ? (
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setIsRejectModalOpen(true)}
                          disabled={Boolean(isActing)}
                          className="inline-flex items-center gap-1.5 rounded-[14px] border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={handleApprove}
                          disabled={Boolean(isActing)}
                          className="inline-flex items-center gap-1.5 rounded-[14px] bg-[linear-gradient(135deg,#f97316,#ea580c)] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_16px_rgba(234,88,12,0.25)] hover:brightness-110 transition"
                        >
                          <CheckCircle size={15} />
                          {isActing === 'approve' ? 'Approving...' : 'Approve Profile'}
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 rounded-[14px] border px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] ${
                        selectedApproval.status === 'approved'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-red-200 bg-red-50 text-red-600'
                      }`}>
                        {selectedApproval.status === 'approved' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                        {selectedApproval.status === 'approved' ? 'Verified' : 'Rejected'}
                      </span>
                    )}

                    <div className="flex gap-2.5 w-full overflow-x-auto pb-1 custom-scrollbar">
                      <MiniCard icon={<Briefcase size={14} />} label="Applied" value={formatDate(selectedApproval.createdAt)} />
                      <MiniCard icon={<MapPin size={14} />} label="Area" value={selectedApproval.city} />
                      <MiniCard icon={<IdCard size={14} />} label="Station" value={selectedApproval.nearestStation} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="xl:col-span-2 grid grid-cols-1 gap-6">
                    <Section title="Personal Details" icon={<User size={16} className="text-[#f97316]" />}>
                      <InfoItem icon={<Phone size={14} />} label="Mobile Number" value={selectedApproval.mobileNo} />
                      <InfoItem icon={<Calendar size={14} />} label="Shift Timing" value={`${selectedApproval.startTime || '-'} - ${selectedApproval.endTime || '-'}`} />
                      <div className="sm:col-span-2">
                        <InfoItem icon={<MapPin size={14} />} label="Permanent Address" value={selectedApproval.address} />
                      </div>
                    </Section>

                    <Section title="Bank Information" icon={<CreditCard size={16} className="text-[#f97316]" />}>
                      <InfoItem label="Bank Name" value={selectedApproval.bankName} />
                      <InfoItem label="Account Holder" value={selectedApproval.accountHolderName} />
                      <InfoItem label="Account Number" value={maskAccount(selectedApproval.accountNumber)} />
                      <InfoItem label="IFSC Code" value={selectedApproval.ifscCode} />
                    </Section>

                    <Section title="Bike & Licensing" icon={<Bike size={16} className="text-[#f97316]" />} compact>
                      <InfoItem label="Bike Number Plate" value={selectedApproval.vehicleNumber} />
                      <InfoItem label={selectedApproval.idType === 'pan' ? 'PAN' : 'Aadhaar'} value={selectedApproval.idType === 'pan' ? selectedApproval.idNumber : maskAadhaar(selectedApproval.idNumber)} />
                      <InfoItem label="Driving Licence" value={selectedApproval.drivingLicenseNumber} />
                    </Section>
                  </div>

                  {/* Right Column */}
                  <div className="grid grid-cols-1 gap-6 h-fit">
                    <Section title="Required Proofs" icon={<FileText size={16} className="text-[#f97316]" />} compact>
                      <div className="col-span-1 sm:col-span-2 space-y-3 px-1">
                        <ImageCard label="Driving Licence" imagePath={selectedApproval.documents.drivingLicenseImage} alt="Rider driving licence" onOpen={setPreviewImage} />
                        <ImageCard label="Bike Photo" imagePath={selectedApproval.documents.bikePhoto} alt="Rider bike" onOpen={setPreviewImage} />
                        <ImageCard label="ID Proof" imagePath={selectedApproval.documents.idProofImage} alt="Rider ID proof" onOpen={setPreviewImage} />
                      </div>
                    </Section>

                    <div className="rounded-[20px] border border-[rgba(249,115,22,0.25)] bg-[linear-gradient(135deg,#ffffff,#fffcf9)] p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(249,115,22,0.15)] shadow-sm flex items-center justify-center shrink-0">
                          <Shield size={18} className="text-[#f97316]" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-semibold text-slate-800">Verification Integrity</h3>
                          <p className="text-[12px] text-slate-600 mt-1.5 leading-relaxed font-bold">
                            Cross-check name spellings with uploaded documents carefully before approval.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${surfaceShellCls} flex flex-1 items-center justify-center p-6 text-center h-full min-h-[420px]`}>
              <div>
                <p className="text-[16px] font-semibold text-[var(--theme-text)]">{modeMeta.emptyDetailTitle}</p>
                <p className="mt-2 text-sm font-medium text-[var(--theme-muted)]">
                  {modeMeta.emptyDetailText}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Preview Modal (UI Only) */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-[28px] border border-[rgba(249,115,22,0.3)] bg-white p-4 shadow-[0_24px_60px_rgba(249,115,22,0.1)] sm:p-5">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-[#f97316] hover:bg-[#fff9f4] hover:border-[#f97316]/30"
            >
              <X size={18} />
            </button>
            <div className="mb-4 pr-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-accent)]">
                {previewImage.label}
              </p>
              <p className="mt-1.5 truncate text-lg font-bold text-slate-900">
                {previewImage.fileName}
              </p>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-slate-100 flex justify-center py-4 border border-[rgba(249,115,22,0.1)]">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.alt}
                className="max-h-[70vh] max-w-full object-contain drop-shadow-md rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (UI Only) */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                  Reject rider profile
                </p>
                <h3 className="mt-2.5 text-2xl font-bold text-slate-900">
                  Reason for rejection
                </h3>
              </div>
              <button
                onClick={closeRejectModal}
                disabled={isActing === 'reject'}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Rejection Note
              </label>
              <textarea
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value)
                  if (rejectError) setRejectError('')
                }}
                rows={5}
                placeholder="Briefly describe what needs to be fixed..."
                className="mt-2.5 w-full rounded-[16px] border border-slate-200 bg-[#fafcfd] px-5 py-4 text-sm font-medium leading-relaxed outline-none transition focus:border-red-300 focus:bg-white shadow-inner"
              />
              {rejectError ? (
                <p className="mt-2 text-sm font-medium text-[#dc2626]">{rejectError}</p>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                disabled={isActing === 'reject'}
                className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={isActing === 'reject'}
                className="rounded-[14px] bg-red-600 px-6 py-3 text-[14px] font-semibold text-white shadow-md transition hover:bg-red-700"
              >
                {isActing === 'reject' ? 'Submitting...' : 'Mark as Rejected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeliveryVerification
