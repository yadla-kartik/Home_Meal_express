import React, { useState } from 'react'

function Register() {
  const [form, setForm] = useState({
    chefName: '',
    kitchenName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    zip: '',
    cuisine: '',
    deliveryRadius: '',
  })

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: submit form
    console.log('Chef register', form)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff3d9,#f3f7ff_55%,#eef2f5)] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_48px_rgba(15,23,42,0.18)] ring-1 ring-black/5 sm:p-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm font-semibold text-[#f97316]">Chef Registration</p>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Register your kitchen
          </h1>
          <p className="text-sm text-[#64748b]">
            Please fill in your kitchen details so customers can find you.
          </p>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Chef Name
              <input
                type="text"
                value={form.chefName}
                onChange={updateField('chefName')}
                placeholder="Enter your name"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Kitchen / Mess Name
              <input
                type="text"
                value={form.kitchenName}
                onChange={updateField('kitchenName')}
                placeholder="Enter kitchen name"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Phone Number
              <input
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="Enter phone number"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Email
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="Enter email"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
            Address
            <input
              type="text"
              value={form.addressLine}
              onChange={updateField('addressLine')}
              placeholder="Street address"
              required
              className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              City
              <input
                type="text"
                value={form.city}
                onChange={updateField('city')}
                placeholder="City"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              State
              <input
                type="text"
                value={form.state}
                onChange={updateField('state')}
                placeholder="State"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Zip Code
              <input
                type="text"
                value={form.zip}
                onChange={updateField('zip')}
                placeholder="Zip"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Cuisine Type
              <input
                type="text"
                value={form.cuisine}
                onChange={updateField('cuisine')}
                placeholder="e.g., North Indian, South Indian"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f2937]">
              Delivery Radius (km)
              <input
                type="number"
                min="1"
                value={form.deliveryRadius}
                onChange={updateField('deliveryRadius')}
                placeholder="e.g., 5"
                required
                className="h-11 rounded-xl border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
