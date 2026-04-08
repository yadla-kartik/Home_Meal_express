import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeliveryPopuplogin from '../components/DeliveryPopuplogin'
import {
  deliveryCookieCheck,
  getDeliveryReviewStatus,
  submitDeliveryRegistration,
} from '../../../../services/deliveryAuthService'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PAGE_FIELDS = {
  1: ['name', 'mobileNo', 'email', 'vehicleType', 'vehicleNumber', 'drivingLicenseNumber'],
  2: ['address', 'city', 'state', 'pincode', 'nearestStation', 'availableDays', 'startTime', 'endTime'],
  3: ['profilePhoto', 'idType', 'idNumber', 'idProofImage', 'accountNumber', 'ifscCode', 'accountHolderName'],
}

const FILE_LIMITS = {
  profilePhoto: 3 * 1024 * 1024,
  idProofImage: 5 * 1024 * 1024,
}

const FILE_RULES = {
  profilePhoto: {
    required: true,
    types: ['image/jpeg', 'image/png', 'image/jpg'],
    label: 'Profile Photo',
  },
  idProofImage: {
    required: true,
    types: ['image/jpeg', 'image/png', 'image/jpg'],
    label: 'ID Proof Image',
  },
}

const onlyLettersAndSpaces = /^[A-Za-z ]+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitsOnly = /^\d+$/
const vehicleNumberPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
const drivingLicensePattern = /^[A-Z]{2}\d{2}\d{11}$/
const ifscPattern = /^[A-Z]{4}0\d{6}$/
const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/
const aadhaarPattern = /^\d{12}$/
const panPattern = /^[A-Z]{5}\d{4}[A-Z]$/

const formatAadhaarNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

function Register() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showResubmittedPopup, setShowResubmittedPopup] = useState(false)
  const [showAlreadyRegisteredPopup, setShowAlreadyRegisteredPopup] = useState(false)
  const [showAlreadySubmittedPopup, setShowAlreadySubmittedPopup] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    mobileNo: '',
    email: '',
    profilePhoto: null,
    idType: 'aadhaar',
    idNumber: '',
    idProofImage: null,
    vehicleType: '',
    vehicleNumber: '',
    drivingLicenseNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    nearestStation: '',
    startTime: '',
    endTime: '',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  })

  useEffect(() => {
    let isMounted = true

    const loadDeliveryProfile = async () => {
      const res = await deliveryCookieCheck()
      if (!isMounted || !res?.deliveryBoy) return

      if (res.deliveryBoy.isRegistered) {
        const reviewRes = await getDeliveryReviewStatus()
        if (!isMounted) return

        if (reviewRes?.hasRegistration && reviewRes?.status !== 'rejected') {
          setShowAlreadyRegisteredPopup(true)
          return
        }
      }

      setForm((prev) => ({
        ...prev,
        name: prev.name || res.deliveryBoy.name || '',
        mobileNo: prev.mobileNo || res.deliveryBoy.mobileNo || '',
      }))
    }

    loadDeliveryProfile()

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
    if (!rule.types.includes(file.type)) return `${rule.label}: upload in PNG, JPG or JPEG format only.`
    if (file.size > FILE_LIMITS[key]) return `${rule.label} must be under ${key === 'profilePhoto' ? '3MB' : '5MB'}.`
    return ''
  }

  const validateField = (field, value = form[field]) => {
    const trimmed = typeof value === 'string' ? value.trim() : value

    switch (field) {
      case 'name':
        if (!trimmed) return 'Name is required.'
        if (trimmed.length < 3) return 'Name must be at least 3 characters.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'Name can contain only alphabets and spaces.'
        return ''
      case 'mobileNo':
        if (!trimmed) return 'Mobile Number is required.'
        if (!digitsOnly.test(trimmed)) return 'Mobile Number can contain digits only.'
        if (trimmed.length !== 10) return 'Mobile Number must be exactly 10 digits.'
        return ''
      case 'email':
        if (!trimmed) return 'Email is required.'
        if (!emailPattern.test(trimmed)) return 'Enter a valid email address.'
        return ''
      case 'vehicleType':
        if (!trimmed) return 'Vehicle Type is required.'
        return ''
      case 'vehicleNumber':
        if (!trimmed) return 'Vehicle Number is required.'
        if (!vehicleNumberPattern.test(trimmed.toUpperCase())) return 'Vehicle Number must be valid, like CG04AB1234.'
        return ''
      case 'drivingLicenseNumber':
        if (!trimmed) return 'Driving License Number is required.'
        if (!drivingLicensePattern.test(trimmed.toUpperCase())) return 'Enter a valid Driving License Number.'
        return ''
      case 'address':
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
      case 'pincode':
        if (!trimmed) return 'Pincode is required.'
        if (!digitsOnly.test(trimmed)) return 'Pincode can contain digits only.'
        if (trimmed.length !== 6) return 'Pincode must be exactly 6 digits.'
        return ''
      case 'nearestStation':
        if (!trimmed) return 'Nearest Station is required.'
        if (trimmed.length < 3) return 'Nearest Station must be at least 3 characters.'
        return ''
      case 'availableDays':
        if (selectedDays.length < 1) return 'Select at least one available day.'
        return ''
      case 'startTime':
        if (!form.startTime) return 'Start Time is required.'
        return ''
      case 'endTime':
        if (!form.endTime) return 'End Time is required.'
        if (form.startTime && form.endTime <= form.startTime) return 'End Time must be greater than Start Time.'
        return ''
      case 'idType':
        if (!trimmed) return 'Select an ID type.'
        if (!['aadhaar', 'pan'].includes(trimmed)) return 'Select a valid ID type.'
        return ''
      case 'idNumber':
        if (!trimmed) return form.idType === 'pan' ? 'PAN number is required.' : 'Aadhaar number is required.'
        if (form.idType === 'pan') {
          if (!panPattern.test(trimmed.toUpperCase())) return 'PAN must follow format: 5 letters, 4 digits, 1 letter.'
          return ''
        }
        if (!aadhaarPattern.test(trimmed)) return 'Aadhaar number must be exactly 12 digits.'
        return ''
      case 'profilePhoto':
      case 'idProofImage':
        return validateFile(field, form[field])
      case 'upiId':
        if (!trimmed) return ''
        if (!upiPattern.test(trimmed)) return 'Enter a valid UPI ID.'
        return ''
      case 'accountNumber':
        if (!trimmed) return 'Account Number is required.'
        if (!digitsOnly.test(trimmed)) return 'Account Number can contain digits only.'
        return ''
      case 'ifscCode':
        if (!trimmed) return 'IFSC Code is required.'
        if (!ifscPattern.test(trimmed.toUpperCase())) return 'IFSC must follow format: 4 letters + 0 + 6 digits.'
        return ''
      case 'accountHolderName':
        if (!trimmed) return 'Account Holder Name is required.'
        if (!onlyLettersAndSpaces.test(trimmed)) return 'Account Holder Name can contain alphabets only.'
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
    if (['mobileNo', 'pincode', 'accountNumber'].includes(key)) nextValue = value.replace(/\D/g, '')
    if (key === 'idNumber' && form.idType === 'aadhaar') nextValue = value.replace(/\D/g, '')
    if (['ifscCode', 'drivingLicenseNumber', 'vehicleNumber'].includes(key)) nextValue = value.toUpperCase()
    if (key === 'idNumber' && form.idType === 'pan') nextValue = value.toUpperCase()

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

      const payload = new FormData()
      payload.append('name', form.name.trim())
      payload.append('mobileNo', form.mobileNo.trim())
      payload.append('email', form.email.trim())
      payload.append('vehicleType', form.vehicleType.trim())
      payload.append('vehicleNumber', form.vehicleNumber.trim())
      payload.append('drivingLicenseNumber', form.drivingLicenseNumber.trim())
      payload.append('address', form.address.trim())
      payload.append('city', form.city.trim())
      payload.append('state', form.state.trim())
      payload.append('pincode', form.pincode.trim())
      payload.append('nearestStation', form.nearestStation.trim())
      payload.append('availableDays', JSON.stringify(selectedDays))
      payload.append('startTime', form.startTime)
      payload.append('endTime', form.endTime)
      payload.append('idType', form.idType)
      payload.append('idNumber', form.idNumber.trim())
      payload.append('upiId', form.upiId.trim())
      payload.append('accountNumber', form.accountNumber.trim())
      payload.append('ifscCode', form.ifscCode.trim())
      payload.append('accountHolderName', form.accountHolderName.trim())
      payload.append('profilePhoto', form.profilePhoto)
      payload.append('idProofImage', form.idProofImage)

      const registerRes = await submitDeliveryRegistration(payload)

      if (registerRes?.message === 'Delivery registered successfully') {
        setShowSuccessPopup(true)
        return
      }

      if (registerRes?.message === 'Delivery registration resubmitted successfully') {
        setShowResubmittedPopup(true)
        return
      }

      if (registerRes?.message === 'Delivery registration already exists') {
        setShowAlreadySubmittedPopup(true)
        return
      }

      alert(registerRes?.message || 'Unable to submit delivery registration')
    } catch (err) {
      alert(err.message || 'Unable to submit delivery registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls =
    'h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]'
  const labelCls = 'flex flex-col gap-2 text-sm font-semibold text-[#1f2937]'
  const fileInputCls =
    'w-full rounded-xl border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#6b7280] transition file:mr-2 file:rounded-full file:border-0 file:bg-[var(--theme-accent-soft)] file:px-3 file:py-1.5 file:text-[10px] file:font-semibold file:text-[var(--theme-accent)] hover:file:bg-[#fff1e2] focus:border-[#f97316] focus:outline-none'
  const sectionDividerCls = 'border-b border-[#f3f4f6] pb-1 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]'
  const errorCls = 'text-xs font-medium text-red-500'
  const steps = ['Partner Profile', 'Location', 'Verification']

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)] px-4 py-8">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_48px_rgba(15,23,42,0.18)] ring-1 ring-black/5 sm:p-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <p className="text-sm font-semibold text-[#f97316]">Delivery Registration</p>
          <h1 className="text-2xl font-bold text-[#0f172a]">Register as delivery partner</h1>
          <p className="text-sm text-[#64748b]">Fill in your details so delivery assignments can find you.</p>
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
              <label className={labelCls}>Full Name <input className={inputCls} value={form.name} onChange={update('name')} placeholder="Enter your name" /> {errors.name && <span className={errorCls}>{errors.name}</span>}</label>
              <label className={labelCls}>Mobile Number <input className={inputCls} type="tel" value={form.mobileNo} onChange={update('mobileNo')} placeholder="Enter mobile number" maxLength={10} /> {errors.mobileNo && <span className={errorCls}>{errors.mobileNo}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Email <input className={inputCls} type="email" value={form.email} onChange={update('email')} placeholder="Enter email" /> {errors.email && <span className={errorCls}>{errors.email}</span>}</label>
              <label className={labelCls}>Vehicle Type <input className={inputCls} value={form.vehicleType} onChange={update('vehicleType')} placeholder="e.g., Bike, Scooter" /> {errors.vehicleType && <span className={errorCls}>{errors.vehicleType}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Vehicle Number <input className={`${inputCls} uppercase`} value={form.vehicleNumber} onChange={update('vehicleNumber')} placeholder="e.g., CG04AB1234" /> {errors.vehicleNumber && <span className={errorCls}>{errors.vehicleNumber}</span>}</label>
              <label className={labelCls}>Driving License Number <input className={`${inputCls} uppercase`} value={form.drivingLicenseNumber} onChange={update('drivingLicenseNumber')} placeholder="Enter DL number" /> {errors.drivingLicenseNumber && <span className={errorCls}>{errors.drivingLicenseNumber}</span>}</label>
            </div>
            <button type="button" onClick={() => handleNext(2)} className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)]">Continue →</button>
          </div>
        )}

        {page === 2 && (
          <div className="grid gap-5">
            <label className={labelCls}>Street Address <input className={inputCls} value={form.address} onChange={update('address')} placeholder="Street address" /> {errors.address && <span className={errorCls}>{errors.address}</span>}</label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={labelCls}>City <input className={inputCls} value={form.city} onChange={update('city')} placeholder="City" /> {errors.city && <span className={errorCls}>{errors.city}</span>}</label>
              <label className={labelCls}>State <input className={inputCls} value={form.state} onChange={update('state')} placeholder="State" /> {errors.state && <span className={errorCls}>{errors.state}</span>}</label>
              <label className={labelCls}>Pincode <input className={inputCls} value={form.pincode} onChange={update('pincode')} placeholder="Pincode" maxLength={6} /> {errors.pincode && <span className={errorCls}>{errors.pincode}</span>}</label>
            </div>
            <label className={labelCls}>Nearest Railway Station <input className={inputCls} value={form.nearestStation} onChange={update('nearestStation')} placeholder="e.g., Raipur Junction" /> {errors.nearestStation && <span className={errorCls}>{errors.nearestStation}</span>}</label>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#374151]">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition-all ${selectedDays.includes(day) ? 'border-[#f97316] bg-[#fff3e8] text-[#f97316]' : 'border-[#d1d5db] text-[#64748b]'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.availableDays && <span className={`${errorCls} mt-2 block`}>{errors.availableDays}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>Start Time <input className={inputCls} type="time" value={form.startTime} onChange={update('startTime')} /> {errors.startTime && <span className={errorCls}>{errors.startTime}</span>}</label>
              <label className={labelCls}>End Time <input className={inputCls} type="time" value={form.endTime} onChange={update('endTime')} /> {errors.endTime && <span className={errorCls}>{errors.endTime}</span>}</label>
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
              <span className="text-sm font-semibold text-[#1f2937]">Profile Photo</span>
              <input className={fileInputCls} type="file" accept=".jpg,.jpeg,.png" onChange={update('profilePhoto')} />
              <span className="text-[11px] font-medium text-[#dc2626]">Upload PNG, JPG or JPEG only. Max 3MB.</span>
              {errors.profilePhoto && <span className={errorCls}>{errors.profilePhoto}</span>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#1f2937]">ID Type</span>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'aadhaar', label: 'Aadhaar Card' },
                    { value: 'pan', label: 'PAN Card' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        form.idType === option.value
                          ? 'border-[#f97316] bg-[#fff3e8] text-[#f97316]'
                          : 'border-[#d1d5db] bg-white text-[#64748b]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="idType"
                        value={option.value}
                        checked={form.idType === option.value}
                        onChange={(event) => {
                          const nextType = event.target.value
                          setForm((prev) => ({ ...prev, idType: nextType, idNumber: '' }))
                          clearFieldError('idType')
                          clearFieldError('idNumber')
                        }}
                        className="sr-only"
                      />
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${form.idType === option.value ? 'border-[#f97316] bg-white' : 'border-[#cbd5e1] bg-white'}`}>
                        <span className={`h-2 w-2 rounded-full transition ${form.idType === option.value ? 'bg-[#f97316]' : 'bg-transparent'}`} />
                      </span>
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.idType && <span className={errorCls}>{errors.idType}</span>}
              </div>

              <label className={labelCls}>
                {form.idType === 'pan' ? 'PAN Number' : 'Aadhaar Number'}
                <input
                  className={`${inputCls} uppercase`}
                  value={form.idType === 'pan' ? form.idNumber : formatAadhaarNumber(form.idNumber)}
                  onChange={update('idNumber')}
                  placeholder={form.idType === 'pan' ? 'e.g., ABCDE1234F' : '1234 5678 9012'}
                  maxLength={form.idType === 'pan' ? 10 : 14}
                />
                {errors.idNumber && <span className={errorCls}>{errors.idNumber}</span>}
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1f2937]">ID Proof Image</span>
              <input className={fileInputCls} type="file" accept=".jpg,.jpeg,.png" onChange={update('idProofImage')} />
              <span className="text-[11px] font-medium text-[#dc2626]">Upload PNG, JPG or JPEG only. Max 5MB.</span>
              {errors.idProofImage && <span className={errorCls}>{errors.idProofImage}</span>}
            </div>

            <p className={sectionDividerCls}>Payment Details</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>UPI ID <input className={inputCls} value={form.upiId} onChange={update('upiId')} placeholder="Optional UPI ID" /> {errors.upiId && <span className={errorCls}>{errors.upiId}</span>}</label>
              <label className={labelCls}>Account Number <input className={inputCls} value={form.accountNumber} onChange={update('accountNumber')} placeholder="Enter account number" /> {errors.accountNumber && <span className={errorCls}>{errors.accountNumber}</span>}</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>IFSC Code <input className={`${inputCls} uppercase`} value={form.ifscCode} onChange={update('ifscCode')} placeholder="e.g., SBIN0001234" /> {errors.ifscCode && <span className={errorCls}>{errors.ifscCode}</span>}</label>
              <label className={labelCls}>Account Holder Name <input className={inputCls} value={form.accountHolderName} onChange={update('accountHolderName')} placeholder="As per bank records" /> {errors.accountHolderName && <span className={errorCls}>{errors.accountHolderName}</span>}</label>
            </div>

            <div className="mt-2 flex gap-3">
              <button type="button" onClick={() => setPage(2)} className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#374151]">← Back</button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Submitting...' : 'Submit Registration'}</button>
            </div>
          </div>
        )}
      </div>

      <DeliveryPopuplogin
        isOpen={showSuccessPopup}
        mode="success"
        name={form.name}
        successRedirectTo="/delivery/dashboard"
        onClose={() => setShowSuccessPopup(false)}
      />

      <DeliveryPopuplogin
        isOpen={showResubmittedPopup}
        mode="resubmitted-success"
        name={form.name}
        successRedirectTo="/delivery/dashboard"
        onClose={() => setShowResubmittedPopup(false)}
      />

      <DeliveryPopuplogin
        isOpen={showAlreadyRegisteredPopup}
        mode="already-registered"
        name={form.name || 'Partner'}
        successRedirectTo="/delivery/dashboard"
        onClose={() => {
          setShowAlreadyRegisteredPopup(false)
          navigate('/delivery/dashboard', {
            state: {
              hideDeliveryPopup: true,
              deliveryRegistered: true,
            },
          })
        }}
      />

      <DeliveryPopuplogin
        isOpen={showAlreadySubmittedPopup}
        mode="already-submitted"
        name={form.name || 'Partner'}
        successRedirectTo="/delivery/dashboard"
        onClose={() => {
          setShowAlreadySubmittedPopup(false)
          navigate('/delivery/dashboard', {
            state: {
              hideDeliveryPopup: true,
              deliveryRegistered: true,
            },
          })
        }}
      />
    </div>
  )
}

export default Register
