import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
  X,
  XCircle,
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

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

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

const getFileName = (path, fallback) => {
  if (!path) return fallback
  const clean = path.split('?')[0]
  const parts = clean.split('/')
  return parts[parts.length - 1] || fallback
}

function QueueItem({ approval, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`arv-queue-card ${isSelected ? 'arv-queue-card--active' : ''}`}
    >
      <div className="arv-queue-card__top">
        <div className="arv-queue-card__copy">
          <p className="arv-queue-card__name">{approval.kitchenName}</p>
          <p className="arv-queue-card__sub">
            {approval.chef.name}  {approval.cuisine}
          </p>
        </div>
        <span className="arv-status-pill">Pending</span>
      </div>

      <div className="arv-queue-card__meta">
        <span>
          <MapPin size={11} />
          {approval.nearestStation}
        </span>
        <span>
          <Clock size={11} />
          {formatDate(approval.createdAt)}
        </span>
      </div>
    </button>
  )
}

function DetailCell({ icon: Icon, label, value }) {
  return (
    <div className="arv-info-cell">
      <div className="arv-info-label">
        <Icon size={13} />
        {label}
      </div>
      <div className="arv-info-value">{value}</div>
    </div>
  )
}

function Lightbox({ photo, onClose }) {
  const handleDownload = React.useCallback(async () => {
    try {
      const res = await fetch(photo.imageUrl)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = photo.fileName
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      const anchor = document.createElement('a')
      anchor.href = photo.imageUrl
      anchor.download = photo.fileName
      anchor.target = '_blank'
      anchor.click()
    }
  }, [photo])

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="arv-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="arv-lightbox__panel"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="arv-lightbox__close">
          <X size={18} />
        </button>

        <div className="arv-lightbox__meta">
          <div className="arv-lightbox__copy">
            <p className="arv-lightbox__eyebrow">{photo.label}</p>
            <p className="arv-lightbox__title">{photo.fileName}</p>
          </div>

          <button type="button" onClick={handleDownload} className="arv-download-btn arv-download-btn--solid">
            <Download size={14} />
            Download
          </button>
        </div>

        <div className="arv-lightbox__frame">
          <img src={photo.imageUrl} alt={photo.alt} className="arv-lightbox__image" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function ImageCard({ label, imagePath, alt, onOpen }) {
  const imageUrl = buildImageUrl(imagePath)
  const fileName = getFileName(imagePath, label)

  const handleDownload = async (event) => {
    event.stopPropagation()

    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      const anchor = document.createElement('a')
      anchor.href = imageUrl
      anchor.download = fileName
      anchor.target = '_blank'
      anchor.click()
    }
  }

  return (
    <div className="arv-photo-card">
      <div className="arv-photo-card__head">
        <div className="arv-photo-card__title-wrap">
          <p className="arv-photo-card__label">{label}</p>
          <p className="arv-photo-card__name">{fileName}</p>
        </div>

        <button type="button" onClick={handleDownload} className="arv-download-btn">
          <Download size={13} />
          Download
        </button>
      </div>

      <button
        type="button"
        className="arv-photo-card__frame"
        onClick={() => onOpen({ label, imageUrl, fileName, alt })}
      >
        <img src={imageUrl} alt={alt} className="arv-photo-card__image" />

        <span className="arv-photo-card__overlay">
          <span className="arv-photo-card__view">
            <ExternalLink size={11} />
            Open
          </span>
        </span>
      </button>
    </div>
  )
}

function Chefff() {
  const [approvals, setApprovals] = React.useState([])
  const [selectedId, setSelectedId] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActing, setIsActing] = React.useState('')
  const [previewImage, setPreviewImage] = React.useState(null)

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
      setSelectedId((prev) => (prev === approval.id ? '' : prev))
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

  const selectedApproval =
    approvals.find((item) => item.id === selectedId) || approvals[0] || null

  const handleDecision = async (type) => {
    if (!selectedApproval || isActing) return

    setIsActing(type)
    const response =
      type === 'approve'
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

  const availableDays = Array.isArray(selectedApproval?.availableDays)
    ? selectedApproval.availableDays.join(', ')
    : 'Not provided'

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="arv-root">
          <AnimatePresence>
            {previewImage ? <Lightbox photo={previewImage} onClose={() => setPreviewImage(null)} /> : null}
          </AnimatePresence>

          <div className="arv-main-grid">
            <motion.aside
              className="arv-queue"
              variants={cardMotion}
              initial="hidden"
              animate="show"
            >
              <div className="arv-queue__header">
                <span className="arv-section-eyebrow">Pending chefs</span>
                <span className="arv-queue__count">{approvals.length} waiting</span>
              </div>

              <div className="arv-queue__list">
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
                  <div className="arv-empty-state">
                    <p className="arv-empty-state__title">No pending chef approvals</p>
                    <p className="arv-empty-state__text">
                      New chef registration requests will appear here automatically.
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>

            <motion.section
              className="arv-detail"
              variants={cardMotion}
              initial="hidden"
              animate="show"
            >
              {selectedApproval ? (
                <>
                  <div className="arv-card arv-card--hero">
                    <div className="arv-card__header">
                      <div className="arv-card__copy">
                        <div className="arv-kitchen-title">{selectedApproval.kitchenName}</div>
                        <p className="arv-kitchen-sub">
                          Review the chef profile, station reach and uploaded documents before approving access.
                        </p>
                      </div>

                      <div className="arv-action-btns">
                        <button
                          type="button"
                          onClick={() => handleDecision('reject')}
                          disabled={Boolean(isActing)}
                          className="arv-btn arv-btn--reject"
                        >
                          <XCircle size={14} />
                          {isActing === 'reject' ? 'Rejecting...' : 'Reject'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision('approve')}
                          disabled={Boolean(isActing)}
                          className="arv-btn arv-btn--approve"
                        >
                          <CheckCircle size={14} />
                          {isActing === 'approve' ? 'Approving...' : 'Approve'}
                        </button>
                      </div>
                    </div>

                    <div className="arv-info-grid">
                      <DetailCell icon={UserRound} label="Full name" value={selectedApproval.chef.name} />
                      <DetailCell icon={Phone} label="Contact number" value={selectedApproval.chef.phone} />
                      <DetailCell icon={Store} label="Cuisine / region" value={selectedApproval.cuisine} />
                      <DetailCell icon={MapPin} label="Station / city" value={selectedApproval.nearestStation} />
                    </div>
                  </div>

                  <div className="arv-card">
                    <p className="arv-section-eyebrow">Service profile</p>

                    <div className="arv-service-grid">
                      <div className="arv-service-item">
                        <span className="arv-service-key">Experience</span>
                        <span className="arv-service-value">{selectedApproval.experience} years</span>
                      </div>
                      <div className="arv-service-item">
                        <span className="arv-service-key">Max orders / day</span>
                        <span className="arv-service-value">{selectedApproval.maxOrders} per day</span>
                      </div>
                      <div className="arv-service-item">
                        <span className="arv-service-key">Timing</span>
                        <span className="arv-service-value">
                          {selectedApproval.openTime} - {selectedApproval.closeTime}
                        </span>
                      </div>
                      <div className="arv-service-item">
                        <span className="arv-service-key">Prep time</span>
                        <span className="arv-service-value">{selectedApproval.prepTime} mins</span>
                      </div>
                      <div className="arv-service-item">
                        <span className="arv-service-key">Available days</span>
                        <span className="arv-service-value">{availableDays}</span>
                      </div>
                      <div className="arv-service-item">
                        <span className="arv-service-key">Submitted</span>
                        <span className="arv-service-value">{formatDate(selectedApproval.createdAt)}</span>
                      </div>
                      <div className="arv-address-cell">
                        <span className="arv-service-key">Full address</span>
                        <span className="arv-service-value">
                          {selectedApproval.addressLine}, {selectedApproval.city}, {selectedApproval.state} -{' '}
                          {selectedApproval.zip}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="arv-card">
                    <div className="arv-card__photos-head">
                      <div>
                        <p className="arv-section-eyebrow">Chef photos &amp; ID proof</p>
                        <p className="arv-card__photos-copy">
                          Open any image to inspect it closely or download the original file.
                        </p>
                      </div>
                    </div>

                    <div className="arv-photos-grid">
                      <ImageCard
                        label="Chef photo"
                        imagePath={selectedApproval.documents?.chefPhoto}
                        alt={selectedApproval.chef.name}
                        onOpen={setPreviewImage}
                      />
                      <ImageCard
                        label="ID proof"
                        imagePath={selectedApproval.documents?.idProof}
                        alt="Chef ID proof"
                        onOpen={setPreviewImage}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="arv-card arv-card--empty">
                  <ShieldCheck size={28} />
                  <p className="arv-empty-state__title">Queue is clear right now</p>
                  <p className="arv-empty-state__text">
                    As soon as a chef submits registration, this panel will update in real time.
                  </p>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </main>

      <style>{`
        .arv-root {
          border-radius: 28px;
          border: 1px solid var(--theme-chip-border);
          background:
            radial-gradient(circle at top right, rgba(249,115,22,0.09), transparent 26%),
            linear-gradient(180deg, #fffaf5 0%, #fff6ef 100%);
          box-shadow: var(--theme-shadow-card);
          padding: 18px;
        }

        .arv-main-grid {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
        }

        .arv-queue,
        .arv-card {
          border-radius: 22px;
          border: 1px solid var(--theme-chip-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,244,0.96));
          box-shadow: var(--theme-shadow-soft);
        }

        .arv-queue {
          overflow: hidden;
        }

        .arv-queue__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px 14px;
          border-bottom: 1px solid rgba(249,115,22,0.12);
        }

        .arv-section-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--theme-accent);
        }

        .arv-queue__count {
          border-radius: 999px;
          border: 1px solid var(--theme-chip-border);
          background: var(--theme-accent-soft);
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          color: var(--theme-accent);
        }

        .arv-queue__list {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .arv-queue-card {
          width: 100%;
          border: 1px solid transparent;
          border-radius: 18px;
          background: linear-gradient(180deg, #fffefe, #fff8f1);
          padding: 14px;
          text-align: left;
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
        }

        .arv-queue-card:hover {
          transform: translateY(-1px);
          border-color: rgba(249,115,22,0.2);
          box-shadow: 0 10px 24px rgba(249,115,22,0.1);
        }

        .arv-queue-card--active {
          border-color: rgba(249,115,22,0.28);
          background: linear-gradient(180deg, #fff5ea, #ffefdf);
          box-shadow: 0 12px 28px rgba(249,115,22,0.12);
        }

        .arv-queue-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .arv-queue-card__copy {
          min-width: 0;
        }

        .arv-queue-card__name {
          font-size: 14px;
          font-weight: 700;
          color: var(--theme-text);
        }

        .arv-queue-card__sub {
          margin-top: 4px;
          font-size: 12px;
          color: var(--theme-muted);
        }

        .arv-status-pill {
          flex-shrink: 0;
          border-radius: 999px;
          border: 1px solid var(--theme-chip-border);
          background: #fff;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--theme-accent);
        }

        .arv-queue-card__meta {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
          color: var(--theme-muted);
        }

        .arv-queue-card__meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .arv-detail {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .arv-card {
          padding: 22px;
        }

        .arv-card--hero {
          background:
            radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent 30%),
            linear-gradient(180deg, rgba(255,249,242,0.98), rgba(255,255,255,0.98));
        }

        .arv-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .arv-card__copy {
          flex: 1;
          min-width: 220px;
        }

        .arv-kitchen-title {
          font-size: 30px;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: var(--theme-text);
        }

        .arv-kitchen-sub {
          margin-top: 10px;
          max-width: 620px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--theme-muted);
        }

        .arv-action-btns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .arv-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 14px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 700;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .arv-btn:hover {
          transform: translateY(-1px);
        }

        .arv-btn:disabled {
          cursor: not-allowed;
          opacity: .7;
        }

        .arv-btn--reject {
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(254,242,242,0.95);
          color: #dc2626;
        }

        .arv-btn--approve {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: #fff;
          box-shadow: var(--theme-shadow-button);
        }

        .arv-info-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .arv-info-cell {
          border-radius: 16px;
          border: 1px solid rgba(249,115,22,0.12);
          background: linear-gradient(180deg, #ffffff, #fffaf4);
          padding: 13px 14px;
        }

        .arv-info-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--theme-accent);
        }

        .arv-info-value {
          margin-top: 8px;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--theme-text);
        }

        .arv-service-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .arv-service-item,
        .arv-address-cell {
          border-radius: 16px;
          border: 1px solid rgba(249,115,22,0.1);
          background: linear-gradient(180deg, #fffdf9, #fff8f1);
          padding: 14px 15px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .arv-address-cell {
          grid-column: 1 / -1;
        }

        .arv-service-key {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--theme-accent);
        }

        .arv-service-value {
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.6;
          color: var(--theme-text);
        }

        .arv-card__photos-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .arv-card__photos-copy {
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.65;
          color: var(--theme-muted);
        }

        .arv-photos-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .arv-photo-card {
          border-radius: 20px;
          border: 1px solid rgba(249,115,22,0.12);
          background: linear-gradient(180deg, #ffffff, #fff9f2);
          padding: 14px;
        }

        .arv-photo-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .arv-photo-card__title-wrap {
          min-width: 0;
        }

        .arv-photo-card__label,
        .arv-lightbox__eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--theme-accent);
        }

        .arv-photo-card__name,
        .arv-lightbox__title {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 700;
          color: var(--theme-text);
          word-break: break-word;
        }

        .arv-download-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid var(--theme-chip-border);
          background: var(--theme-accent-soft);
          padding: 7px 12px;
          font-size: 11px;
          font-weight: 700;
          color: var(--theme-accent);
          transition: transform .18s ease, background .18s ease;
        }

        .arv-download-btn:hover {
          transform: translateY(-1px);
          background: #fff;
        }

        .arv-download-btn--solid {
          border-radius: 14px;
          border-color: transparent;
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: #fff;
          padding: 10px 16px;
          box-shadow: var(--theme-shadow-button);
        }

        .arv-photo-card__frame {
          position: relative;
          margin-top: 14px;
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 18px;
          cursor: pointer;
        }

        .arv-photo-card__image {
          width: 100%;
          height: 270px;
          object-fit: cover;
          display: block;
          transition: transform .24s ease;
        }

        .arv-photo-card__frame:hover .arv-photo-card__image {
          transform: scale(1.03);
        }

        .arv-photo-card__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 14px;
          background: linear-gradient(to top, rgba(15,23,42,0.58), transparent 55%);
          opacity: 0;
          transition: opacity .18s ease;
        }

        .arv-photo-card__frame:hover .arv-photo-card__overlay {
          opacity: 1;
        }

        .arv-photo-card__view {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          color: var(--theme-text);
        }

        .arv-empty-state {
          border-radius: 18px;
          border: 1px solid rgba(249,115,22,0.12);
          background: linear-gradient(180deg, #ffffff, #fff8f1);
          padding: 22px 18px;
          text-align: center;
        }

        .arv-card--empty {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: var(--theme-accent);
        }

        .arv-empty-state__title {
          font-size: 20px;
          font-weight: 700;
          color: var(--theme-text);
        }

        .arv-empty-state__text {
          margin-top: 6px;
          font-size: 13px;
          line-height: 1.65;
          color: var(--theme-muted);
        }

        .arv-lightbox {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: rgba(15,23,42,0.78);
          backdrop-filter: blur(12px);
        }

        .arv-lightbox__panel {
          position: relative;
          width: min(1100px, 100%);
          border-radius: 28px;
          border: 1px solid var(--theme-chip-border);
          background: linear-gradient(180deg, #ffffff, #fff8f2);
          padding: 20px;
          box-shadow: 0 28px 70px rgba(15,23,42,0.28);
        }

        .arv-lightbox__close {
          position: absolute;
          right: 16px;
          top: 16px;
          display: inline-flex;
          height: 42px;
          width: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.24);
          background: white;
          color: var(--theme-text);
        }

        .arv-lightbox__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-right: 58px;
          margin-bottom: 16px;
        }

        .arv-lightbox__copy {
          min-width: 0;
        }

        .arv-lightbox__frame {
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid var(--theme-chip-border);
          background: rgba(249,115,22,0.06);
        }

        .arv-lightbox__image {
          width: 100%;
          max-height: 75vh;
          object-fit: contain;
          display: block;
        }

        @media (max-width: 1024px) {
          .arv-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .arv-root {
            padding: 14px;
          }

          .arv-card,
          .arv-queue {
            border-radius: 20px;
          }

          .arv-kitchen-title {
            font-size: 24px;
          }

          .arv-info-grid,
          .arv-service-grid,
          .arv-photos-grid {
            grid-template-columns: 1fr;
          }

          .arv-photo-card__image {
            height: 230px;
          }

          .arv-lightbox__meta {
            flex-direction: column;
            align-items: stretch;
            padding-right: 48px;
          }
        }
      `}</style>
    </div>
  )
}

export default Chefff
