import React, { useEffect, useState } from 'react'
import Popuplogin from '../components/Popuplogin'
import { chefCookieCheck, submitChefRegistration, updateChefProfile } from '../../../../services/chefAuthService'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PAGE_FIELDS = {
  1: ['chefName', 'kitchenName', 'phone', 'email', 'cuisine', 'speciality', 'experience', 'maxOrders'],
  2: ['addressLine', 'city', 'state', 'zip', 'nearestStation', 'prepTime', 'openTime', 'closeTime', 'availableDays'],
  3: ['idProof', 'chefPhoto', 'upiOrAccount', 'accountHolder', 'bankName', 'ifscCode'],
}

const FILE_LIMITS = {
  idProof: 5 * 1024 * 1024,
  chefPhoto: 2 * 1024 * 1024,
}

const FILE_RULES = {
  idProof: {
    required: true,
    types: ['application/pdf', 'image/jpeg', 'image/png'],
    label: 'ID Proof',
  },
  chefPhoto: {
    required: true,
    types: ['image/jpeg', 'image/png'],
    label: 'Chef Photo',
  },
}

const onlyLettersAndSpaces = /^[A-Za-z ]+$/
const kitchenNamePattern = /^[A-Za-z0-9&,\- ]+$/
const digitsOnly = /^\d+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const textPattern = /^[A-Za-z ]+$/
const ifscPattern = /^[A-Z]{4}0\d{6}$/
const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/
const accountNumberPattern = /^\d+$/

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Unable to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })

function Register() {
  const [page, setPage] = useState(1)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    chefName: '',
    kitchenName: '',
    phone: '',
    email: '',
    cuisine: '',
    speciality: '',
    experience: '',
    maxOrders: '',
    addressLine: '',
    city: '',
    state: '',
    zip: '',
    nearestStation: '',
    prepTime: '',
    openTime: '',
    closeTime: '',
    idProof: null,
    chefPhoto: null,
    upiOrAccount: '',
    accountHolder: '',
    bankName: '',
    ifscCode: '',
  })

  useEffect(() => {
    let isMounted = true

    const loadChefProfile = async () => {
      const res = await chefCookieCheck()
      if (!isMounted || !res?.chefUser) return

      setForm((prev) => ({
        ...prev,
        chefName: prev.chefName || res.chefUser.name || '',
        phone: prev.phone || res.chefUser.phone || '',
        email: prev.email || res.chefUser.email || '',
      }))
    }

    loadChefProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const setFieldError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const clearFieldError = (field) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateFile = (key, file) => {
    const rule = FILE_RULES[key]
    if (!file) return rule.required ? `${rule.label} is required.` : ''
    if (!rule.types.includes(file.type)) return `Upload a valid ${rule.label} file.`
    if (file.size > FILE_LIMITS[key]) return `${rule.label} must be under ${key === 'chefPhoto' ? '2MB' : '5MB'}.`
    return ''
  }

  const validateField = (field, value = form[field]) => {
    const trimmed = typeof value === 'string' ? value.trim() : value

    switch (field) {
      case 'chefName':
        if (!trimmed) return 'Chef Name is required.'
        if (trimmed.length < 3) return 'Chef Name must be at least 3 characters.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'Chef Name can contain only alphabets and spaces.'
        return ''
      case 'kitchenName':
        if (!trimmed) return 'Kitchen Name is required.'
        if (trimmed.length < 3) return 'Kitchen Name must be at least 3 characters.'
        if (!kitchenNamePattern.test(trimmed)) return 'Kitchen Name allows letters, numbers, spaces, &, comma and hyphen only.'
        return ''
      case 'phone':
        if (!trimmed) return 'Phone Number is required.'
        if (!digitsOnly.test(trimmed)) return 'Phone Number can contain digits only.'
        if (trimmed.length !== 10) return 'Phone Number must be exactly 10 digits.'
        return ''
      case 'email':
        if (!trimmed) return 'Email is required.'
        if (!emailPattern.test(trimmed)) return 'Enter a valid email address.'
        return ''
      case 'cuisine':
        if (!trimmed) return 'Cuisine Type is required.'
        return ''
      case 'speciality':
        if (!trimmed) return ''
        if (!textPattern.test(trimmed)) return 'Speciality can contain text only.'
        return ''
      case 'experience':
        if (!trimmed) return 'Experience is required.'
        if (!digitsOnly.test(trimmed)) return 'Experience must be numeric only.'
        if (Number(trimmed) < 0 || Number(trimmed) > 40) return 'Experience must be between 0 and 40 years.'
        return ''
      case 'maxOrders':
        if (!trimmed) return 'Max Orders per Day is required.'
        if (!digitsOnly.test(trimmed)) return 'Max Orders per Day must be numeric only.'
        if (Number(trimmed) < 1) return 'Max Orders per Day must be at least 1.'
        return ''
      case 'addressLine':
        if (!trimmed) return 'Address is required.'
        if (trimmed.length < 5) return 'Address must be at least 5 characters.'
        return ''
      case 'city':
        if (!trimmed) return 'City is required.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'City can contain alphabets only.'
        return ''
      case 'state':
        if (!trimmed) return 'State is required.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'State can contain alphabets only.'
        return ''
      case 'zip':
        if (!trimmed) return 'Zip Code is required.'
        if (!digitsOnly.test(trimmed)) return 'Zip Code can contain digits only.'
        if (trimmed.length !== 6) return 'Zip Code must be exactly 6 digits.'
        return ''
      case 'nearestStation':
        if (!trimmed) return 'Nearest Railway Station is required.'
        if (trimmed.length < 3) return 'Nearest Railway Station must be at least 3 characters.'
        return ''
      case 'prepTime':
        if (!trimmed) return 'Preparation Time is required.'
        if (!digitsOnly.test(trimmed)) return 'Preparation Time must be numeric only.'
        if (Number(trimmed) < 5 || Number(trimmed) > 180) return 'Preparation Time must be between 5 and 180 minutes.'
        return ''
      case 'availableDays':
        if (selectedDays.length < 1) return 'Select at least one available day.'
        return ''
      case 'openTime':
        if (!form.openTime) return 'Opening Time is required.'
        return ''
      case 'closeTime':
        if (!form.closeTime) return 'Closing Time is required.'
        if (form.openTime && form.closeTime <= form.openTime) return 'Closing Time must be greater than Opening Time.'
        return ''
      case 'idProof':
      case 'chefPhoto':
        return validateFile(field, form[field])
      case 'upiOrAccount':
        if (!trimmed) return 'UPI ID / Account Number is required.'
        if (!upiPattern.test(trimmed) && !accountNumberPattern.test(trimmed)) return 'Enter a valid UPI ID or numeric account number.'
        return ''
      case 'accountHolder':
        if (!trimmed) return 'Account Holder Name is required.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'Account Holder Name can contain alphabets only.'
        return ''
      case 'bankName':
        if (!trimmed) return 'Bank Name is required.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'Bank Name can contain alphabets only.'
        return ''
      case 'ifscCode':
        if (!trimmed) return 'IFSC Code is required.'
        if (!ifscPattern.test(trimmed.toUpperCase())) return 'IFSC must follow format: 4 letters + 0 + 6 digits.'
        return ''
      default:
        return ''
    }
  }

  const validatePage = (pageNumber) => {
    const pageErrors = {}
    PAGE_FIELDS[pageNumber].forEach((field) => {
      const message = validateField(field)
      if (message) pageErrors[field] = message
    })
    setErrors((prev) => ({ ...prev, ...pageErrors }))
    return Object.keys(pageErrors).length === 0
  }

  const update = (key) => (event) => {
    const { type, files, value } = event.target

    if (type === 'file') {
      const file = files?.[0] || null
      setForm((prev) => ({ ...prev, [key]: file }))
      const message = validateFile(key, file)
      if (message) setFieldError(key, message)
      else clearFieldError(key)
      return
    }

    let nextValue = value
    if (['phone', 'zip', 'experience', 'maxOrders', 'prepTime'].includes(key)) nextValue = value.replace(/\D/g, '')
    if (key === 'ifscCode') nextValue = value.toUpperCase()

    setForm((prev) => ({ ...prev, [key]: nextValue }))
    const message = validateField(key, nextValue)
    if (message) setFieldError(key, message)
    else clearFieldError(key)
  }

  const toggleDay = (day) => {
    setSelectedDays((prev) => {
      const nextDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      if (nextDays.length > 0) clearFieldError('availableDays')
      else setFieldError('availableDays', 'Select at least one available day.')
      return nextDays
    })
  }

  const handleNext = (nextPage) => {
    if (validatePage(page)) setPage(nextPage)
  }

  const handleSubmit = async () => {
    if (!validatePage(3) || isSubmitting) return

    try {
      setIsSubmitting(true)

      const profileRes = await updateChefProfile({
        name: form.chefName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        isRegistered: false,
      })

      if (!profileRes?.message || profileRes.message !== 'Profile Updated') {
        alert(profileRes?.message || 'Unable to save chef profile')
        return
      }

      const [idProofData, chefPhotoData] = await Promise.all([
        fileToDataUrl(form.idProof),
        fileToDataUrl(form.chefPhoto),
      ])

      const registerRes = await submitChefRegistration({
        kitchenName: form.kitchenName.trim(),
        cuisine: form.cuisine.trim(),
        speciality: form.speciality.trim(),
        experience: form.experience.trim(),
        maxOrders: form.maxOrders.trim(),
        addressLine: form.addressLine.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        nearestStation: form.nearestStation.trim(),
        prepTime: form.prepTime.trim(),
        openTime: form.openTime,
        closeTime: form.closeTime,
        availableDays: selectedDays,
        idProof: idProofData,
        chefPhoto: chefPhotoData,
        upiOrAccount: form.upiOrAccount.trim(),
        accountHolder: form.accountHolder.trim(),
        bankName: form.bankName.trim(),
        ifscCode: form.ifscCode.trim(),
      })

      if (!registerRes?.message || registerRes.message !== 'Chef registered successfully') {
        alert(registerRes?.message || 'Unable to submit chef registration')
        return
      }

      setShowSuccessPopup(true)
    } catch (err) {
      alert(err.message || 'Unable to submit chef registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls = 'h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]'
  const labelCls = 'flex flex-col gap-2 text-sm font-semibold text-[#1f2937]'
  const fileInputCls = 'rounded-xl border border-[#d1d5db] px-3 py-2.5 text-xs text-[#9ca3af] cursor-pointer'
  const sectionDividerCls = 'border-b border-[#f3f4f6] pb-1 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]'
  const errorCls = 'text-xs font-medium text-red-500'
  const steps = ['Kitchen Profile', 'Location', 'Availability']

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff3d9,#f3f7ff_55%,#eef2f5)] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_48px_rgba(15,23,42,0.18)] ring-1 ring-black/5 sm:p-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <p className="text-sm font-semibold text-[#f97316]">Chef Registration</p>
          <h1 className="text-2xl font-bold text-[#0f172a]">Register your kitchen</h1>
          <p className="text-sm text-[#64748b]">Fill in your details so customers can find you.</p>
        </div>

        {page <= 3 && (
          <div className="mb-8 flex items-center justify-center gap-1">
            {steps.map((label, index) => {
              const stepNumber = index + 1
              const active = page === stepNumber
              const done = page > stepNumber
              return (
                <React.Fragment key={stepNumber}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${done || active ? 'border-[#f97316] bg-[#f97316] text-white' : 'border-[#d1d5db] text-[#9ca3af]'}`}>
                      {stepNumber}
                    </div>
                    <span className={`whitespace-nowrap text-[11px] ${active ? 'font-semibold text-[#f97316]' : 'text-[#9ca3af]'}`}>{label}</span>
                  </div>
                  {index < 2 && <div className={`mb-4 h-0.5 w-14 ${page > stepNumber ? 'bg-[#f97316]' : 'bg-[#e5e7eb]'}`} />}
                </React.Fragment>
              )
            })}
          </div>
        )}

        {page === 1 && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Chef Name <input className={inputCls} value={form.chefName} onChange={update('chefName')} placeholder="Enter your name" /> {errors.chefName && <span className={errorCls}>{errors.chefName}</span>}</label>
              <label className={labelCls}>Kitchen / Mess Name <input className={inputCls} value={form.kitchenName} onChange={update('kitchenName')} placeholder="Enter kitchen name" /> {errors.kitchenName && <span className={errorCls}>{errors.kitchenName}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Phone Number <input className={inputCls} type="tel" value={form.phone} onChange={update('phone')} placeholder="Enter phone number" maxLength={10} /> {errors.phone && <span className={errorCls}>{errors.phone}</span>}</label>
              <label className={labelCls}>Email <input className={inputCls} type="email" value={form.email} onChange={update('email')} placeholder="Enter email" /> {errors.email && <span className={errorCls}>{errors.email}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Cuisine Type <input className={inputCls} value={form.cuisine} onChange={update('cuisine')} placeholder="e.g., North Indian, South Indian" /> {errors.cuisine && <span className={errorCls}>{errors.cuisine}</span>}</label>
              <label className={labelCls}>Speciality <input className={inputCls} value={form.speciality} onChange={update('speciality')} placeholder="e.g., Biryani, Thali" /> {errors.speciality && <span className={errorCls}>{errors.speciality}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Years of Experience <input className={inputCls} type="text" value={form.experience} onChange={update('experience')} placeholder="e.g., 5" /> {errors.experience && <span className={errorCls}>{errors.experience}</span>}</label>
              <label className={labelCls}>Max Orders per Day <input className={inputCls} type="text" value={form.maxOrders} onChange={update('maxOrders')} placeholder="e.g., 20" /> {errors.maxOrders && <span className={errorCls}>{errors.maxOrders}</span>}</label>
            </div>
            <button type="button" onClick={() => handleNext(2)} className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)]">Continue →</button>
          </div>
        )}

        {page === 2 && (
          <div className="grid gap-5">
            <label className={labelCls}>Street Address <input className={inputCls} value={form.addressLine} onChange={update('addressLine')} placeholder="Street address" /> {errors.addressLine && <span className={errorCls}>{errors.addressLine}</span>}</label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={labelCls}>City <input className={inputCls} value={form.city} onChange={update('city')} placeholder="City" /> {errors.city && <span className={errorCls}>{errors.city}</span>}</label>
              <label className={labelCls}>State <input className={inputCls} value={form.state} onChange={update('state')} placeholder="State" /> {errors.state && <span className={errorCls}>{errors.state}</span>}</label>
              <label className={labelCls}>Zip Code <input className={inputCls} value={form.zip} onChange={update('zip')} placeholder="Zip" maxLength={6} /> {errors.zip && <span className={errorCls}>{errors.zip}</span>}</label>
            </div>
            <label className={labelCls}>Nearest Railway Station <input className={inputCls} value={form.nearestStation} onChange={update('nearestStation')} placeholder="e.g., Raipur Junction" /> {errors.nearestStation && <span className={errorCls}>{errors.nearestStation}</span>}</label>
            <label className={labelCls}>Preparation Time (mins) <input className={inputCls} type="text" value={form.prepTime} onChange={update('prepTime')} placeholder="e.g., 30" /> {errors.prepTime && <span className={errorCls}>{errors.prepTime}</span>}</label>
            <div className="h-px bg-[#f3f4f6]" />
            <div>
              <p className="mb-2 text-sm font-semibold text-[#374151]">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition-all ${selectedDays.includes(day) ? 'border-[#f97316] bg-[#fff3e8] text-[#f97316]' : 'border-[#d1d5db] text-[#64748b]'}`}>
                    {day}
                  </button>
                ))}
              </div>
              {errors.availableDays && <span className={`${errorCls} mt-2 block`}>{errors.availableDays}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Opening Time <input className={inputCls} type="time" value={form.openTime} onChange={update('openTime')} /> {errors.openTime && <span className={errorCls}>{errors.openTime}</span>}</label>
              <label className={labelCls}>Closing Time <input className={inputCls} type="time" value={form.closeTime} onChange={update('closeTime')} /> {errors.closeTime && <span className={errorCls}>{errors.closeTime}</span>}</label>
            </div>
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={() => setPage(1)} className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#374151]">← Back</button>
              <button type="button" onClick={() => handleNext(3)} className="flex-[2] rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)]">Continue →</button>
            </div>
          </div>
        )}

        {page === 3 && (
          <div className="grid gap-5">
            <p className={sectionDividerCls}>Verification Documents</p>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1f2937]">ID Proof</span>
              <input className={fileInputCls} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={update('idProof')} />
              <span className="text-[11px] text-[#9ca3af]">Aadhaar, Voter ID, PAN. Max 5MB.</span>
              {errors.idProof && <span className={errorCls}>{errors.idProof}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1f2937]">Chef Photo</span>
              <input className={fileInputCls} type="file" accept=".jpg,.jpeg,.png" onChange={update('chefPhoto')} />
              <span className="text-[11px] text-[#9ca3af]">JPG or PNG only. Max 2MB.</span>
              {errors.chefPhoto && <span className={errorCls}>{errors.chefPhoto}</span>}
            </div>

            <p className={sectionDividerCls}>Payment Details</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Bank Account / UPI ID <input className={inputCls} value={form.upiOrAccount} onChange={update('upiOrAccount')} placeholder="UPI or Account number" /> {errors.upiOrAccount && <span className={errorCls}>{errors.upiOrAccount}</span>}</label>
              <label className={labelCls}>Account Holder Name <input className={inputCls} value={form.accountHolder} onChange={update('accountHolder')} placeholder="As per bank records" /> {errors.accountHolder && <span className={errorCls}>{errors.accountHolder}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Bank Name <input className={inputCls} value={form.bankName} onChange={update('bankName')} placeholder="e.g., SBI, HDFC, Kotak" /> {errors.bankName && <span className={errorCls}>{errors.bankName}</span>}</label>
              <label className={labelCls}>IFSC Code <input className={`${inputCls} uppercase`} value={form.ifscCode} onChange={update('ifscCode')} placeholder="e.g., SBIN0001234" /> {errors.ifscCode && <span className={errorCls}>{errors.ifscCode}</span>}</label>
            </div>

            <div className="mt-2 flex gap-3">
              <button type="button" onClick={() => setPage(2)} className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#374151]">← Back</button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Submitting...' : 'Submit Registration'}</button>
            </div>
          </div>
        )}
      </div>

      <Popuplogin
        isOpen={showSuccessPopup}
        mode="success"
        name={form.chefName || form.kitchenName}
        successRedirectTo="/chef/dashboard"
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  )
}

export default Register
