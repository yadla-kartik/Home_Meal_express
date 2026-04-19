import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User,
  Mail, 
  Phone, 
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

const EMPTY = { name: '', email: '', phone: '', adminCode: '' }

function AddAdminModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY)
      setFocusedField(null)
    }
  }, [isOpen])

  const updateField = (key, val) => {
    if (key === 'phone') val = val.replace(/\D/g, '').slice(0, 10)
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await onAdd(form)
    setIsSubmitting(false)
    if (res?.success) onClose()
  }

  const fields = [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter admin name',
      icon: <User size={16} />,
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'admin@homemealexpress.com',
      icon: <Mail size={16} />,
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            onClick={onClose}
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              background: 'var(--theme-surface)',
              borderRadius: '28px',
              boxShadow: '0 32px 64px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.06)',
              width: '100%',
              maxWidth: '460px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Accent strip top */}
            <div style={{
              height: '4px',
              background: 'var(--theme-gradient-primary)',
              borderRadius: '28px 28px 0 0',
            }} />

            {/* Header */}
            <div style={{ padding: '28px 32px 0 32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'var(--theme-accent-soft)',
                    border: '1px solid var(--theme-chip-border)',
                    marginBottom: '12px',
                  }}>
                    <Sparkles size={11} style={{ color: 'var(--theme-accent)' }} />
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--theme-accent)',
                    }}>New Admin</span>
                  </div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: 'var(--theme-text)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: 0,
                  }}>Add Admin</h2>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--theme-muted)',
                    fontWeight: 500,
                    marginTop: '4px',
                  }}>Fill in the details to create a new admin account and send the login OTP by email.</p>
                </div>

                <button 
                  onClick={onClose}
                  style={{
                    height: '36px',
                    width: '36px',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '12px',
                    border: '1px solid var(--theme-surface-border)',
                    background: 'var(--theme-app-bg)',
                    color: 'var(--theme-muted)',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
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
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'var(--theme-surface-border)',
              margin: '20px 32px 0 32px',
            }} />

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px 32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Name & Email */}
                {fields.map((field) => (
                  <div key={field.key}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: focusedField === field.key ? 'var(--theme-accent)' : 'var(--theme-label)',
                      marginBottom: '6px',
                      transition: 'color 0.2s ease',
                      letterSpacing: '0.01em',
                    }}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: focusedField === field.key ? 'var(--theme-accent)' : 'var(--theme-muted)',
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        {field.icon}
                      </div>
                      <input 
                        type={field.type} 
                        required
                        placeholder={field.placeholder}
                        className="theme-input"
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '14px',
                          paddingLeft: '40px',
                          paddingRight: '14px',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          boxSizing: 'border-box',
                        }}
                        value={form[field.key]}
                        onChange={e => updateField(field.key, e.target.value)}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                ))}

                {/* Phone & Admin Code side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {/* Phone */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: focusedField === 'phone' ? 'var(--theme-accent)' : 'var(--theme-label)',
                      marginBottom: '6px',
                      transition: 'color 0.2s ease',
                      letterSpacing: '0.01em',
                    }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: focusedField === 'phone' ? 'var(--theme-accent)' : 'var(--theme-muted)',
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <Phone size={14} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: 'inherit',
                          opacity: 0.7,
                        }}>+91</span>
                      </div>
                      <input 
                        type="tel" 
                        required
                        placeholder="9876543210"
                        className="theme-input"
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '14px',
                          paddingLeft: '68px',
                          paddingRight: '14px',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          boxSizing: 'border-box',
                        }}
                        value={form.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  {/* Admin Code */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: focusedField === 'adminCode' ? 'var(--theme-accent)' : 'var(--theme-label)',
                      marginBottom: '6px',
                      transition: 'color 0.2s ease',
                      letterSpacing: '0.01em',
                    }}>Admin Code</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: focusedField === 'adminCode' ? 'var(--theme-accent)' : 'var(--theme-muted)',
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <KeyRound size={15} />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="ADM-001"
                        className="theme-input"
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '14px',
                          paddingLeft: '40px',
                          paddingRight: '14px',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          boxSizing: 'border-box',
                          textTransform: 'uppercase',
                        }}
                        value={form.adminCode}
                        onChange={e => updateField('adminCode', e.target.value.toUpperCase())}
                        onFocus={() => setFocusedField('adminCode')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: '26px' }}>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="theme-primary-button"
                  style={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '16px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    letterSpacing: '0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <div style={{
                      height: '18px',
                      width: '18px',
                      border: '2.5px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Create Admin
                    </>
                  )}
                </button>

                <p style={{
                  marginTop: '14px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--theme-muted)',
                  lineHeight: 1.5,
                  opacity: 0.75,
                }}>
                  A one-time password will be emailed to this admin, and they will create their own password after first login.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddAdminModal
