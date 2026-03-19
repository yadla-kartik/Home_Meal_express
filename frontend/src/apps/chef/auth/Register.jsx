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
    <div className="theme-page-shell min-h-screen px-4 py-10">
      <div className="theme-card-lg mx-auto w-full max-w-3xl rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm font-semibold text-[var(--theme-accent)]">Chef Registration</p>
          <h1 className="theme-heading text-2xl font-bold">
            Register your kitchen
          </h1>
          <p className="theme-muted text-sm">
            Please fill in your kitchen details so customers can find you.
          </p>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Chef Name
              <input
                type="text"
                value={form.chefName}
                onChange={updateField('chefName')}
                placeholder="Enter your name"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>

            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Kitchen / Mess Name
              <input
                type="text"
                value={form.kitchenName}
                onChange={updateField('kitchenName')}
                placeholder="Enter kitchen name"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Phone Number
              <input
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="Enter phone number"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>

            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Email
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="Enter email"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>
          </div>

          <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
            Address
            <input
              type="text"
              value={form.addressLine}
              onChange={updateField('addressLine')}
              placeholder="Street address"
              required
              className="theme-input h-11 rounded-xl px-3 text-sm"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              City
              <input
                type="text"
                value={form.city}
                onChange={updateField('city')}
                placeholder="City"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>

            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              State
              <input
                type="text"
                value={form.state}
                onChange={updateField('state')}
                placeholder="State"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>

            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Zip Code
              <input
                type="text"
                value={form.zip}
                onChange={updateField('zip')}
                placeholder="Zip"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Cuisine Type
              <input
                type="text"
                value={form.cuisine}
                onChange={updateField('cuisine')}
                placeholder="e.g., North Indian, South Indian"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>

            <label className="theme-label flex flex-col gap-2 text-sm font-semibold">
              Delivery Radius (km)
              <input
                type="number"
                min="1"
                value={form.deliveryRadius}
                onChange={updateField('deliveryRadius')}
                placeholder="e.g., 5"
                required
                className="theme-input h-11 rounded-xl px-3 text-sm"
              />
            </label>
          </div>

          <button
            type="submit"
            className="theme-primary-button mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
