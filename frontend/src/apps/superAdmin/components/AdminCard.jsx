import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MoreVertical, 
  X,
  Trash2, 
  Mail, 
  Phone, 
  KeyRound,
  Zap,
  Settings,
} from 'lucide-react'

function AdminCard({ admin, onRemove }) {
  const [showOptions, setShowOptions] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRevoke = async () => {
    setIsRemoving(true)
    await onRemove(admin._id)
    setIsRemoving(false)
    setShowOptions(false)
  }

  const getInitials = (n) => n?.substring(0, 2).toUpperCase() || 'AD'

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      style={{
        background: 'var(--theme-surface)',
        borderRadius: '22px',
        border: '1px solid var(--theme-surface-border)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.16s ease-out',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(15, 23, 42, 0.12)'
        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(15, 23, 42, 0.06)'
        e.currentTarget.style.borderColor = 'var(--theme-surface-border)'
      }}
    >
      {/* Header: Avatar + Name + Menu */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Gradient Avatar */}
          <div style={{
            height: '46px',
            width: '46px',
            borderRadius: '14px',
            background: 'var(--theme-gradient-primary)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 16px rgba(249, 115, 22, 0.25)',
          }}>
            <span style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              {getInitials(admin.name)}
            </span>
          </div>
          <div>
            <h4 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--theme-text-strong)',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {admin.name}
            </h4>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--theme-accent)',
            }}>
              <Zap size={9} fill="currentColor" /> Admin Access
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowOptions(!showOptions)}
          style={{
            height: '32px',
            width: '32px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '10px',
            border: 'none',
            background: showOptions ? 'var(--theme-accent-soft)' : 'transparent',
            color: showOptions ? 'var(--theme-accent)' : 'var(--theme-muted)',
            transition: 'all 0.16s ease-out',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!showOptions) {
              e.currentTarget.style.background = 'var(--theme-app-bg)'
              e.currentTarget.style.color = 'var(--theme-text)'
            }
          }}
          onMouseLeave={e => {
            if (!showOptions) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--theme-muted)'
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {showOptions ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </motion.div>
            ) : (
              <motion.div
                key="dots"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MoreVertical size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'var(--theme-surface-border)',
        margin: '16px 0',
      }} />

      {/* Info Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Admin Code */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'var(--theme-app-bg)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{
            height: '30px',
            width: '30px',
            borderRadius: '9px',
            background: 'var(--theme-accent-soft)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--theme-accent)',
            flexShrink: 0,
          }}>
            <KeyRound size={13} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--theme-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
              lineHeight: 1,
            }}>Admin Code</p>
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--theme-text-strong)',
              margin: '3px 0 0 0',
              lineHeight: 1,
            }}>#{admin.adminCode || 'N/A'}</p>
          </div>
        </div>

        {/* Email */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'var(--theme-app-bg)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{
            height: '30px',
            width: '30px',
            borderRadius: '9px',
            background: 'var(--theme-accent-soft)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--theme-accent)',
            flexShrink: 0,
          }}>
            <Mail size={13} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--theme-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
              lineHeight: 1,
            }}>Email</p>
            <p style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--theme-text-strong)',
              margin: '3px 0 0 0',
              lineHeight: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{admin.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'var(--theme-app-bg)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{
            height: '30px',
            width: '30px',
            borderRadius: '9px',
            background: 'var(--theme-accent-soft)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--theme-accent)',
            flexShrink: 0,
          }}>
            <Phone size={13} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--theme-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
              lineHeight: 1,
            }}>Phone</p>
            <p style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--theme-text-strong)',
              margin: '3px 0 0 0',
              lineHeight: 1,
            }}>+91 {admin.phone}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {showOptions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--theme-surface-border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}>
              <button style={{
                height: '40px',
                borderRadius: '12px',
                border: '1px solid var(--theme-surface-border)',
                background: 'var(--theme-surface)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--theme-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--theme-accent)'
                  e.currentTarget.style.color = 'var(--theme-accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--theme-surface-border)'
                  e.currentTarget.style.color = 'var(--theme-text)'
                }}
              >
                <Settings size={13} /> Manage
              </button>
              <button 
                onClick={handleRevoke}
                disabled={isRemoving}
                style={{
                  height: '40px',
                  borderRadius: '12px',
                  border: '1px solid rgba(236, 40, 40, 0.15)',
                  background: 'rgba(236, 40, 40, 0.04)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--theme-important)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  opacity: isRemoving ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(236, 40, 40, 0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(236, 40, 40, 0.04)'
                }}
              >
                {isRemoving ? (
                  <div style={{
                    height: '14px',
                    width: '14px',
                    border: '2px solid var(--theme-important)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                ) : (
                  <><Trash2 size={13} /> Remove</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AdminCard
