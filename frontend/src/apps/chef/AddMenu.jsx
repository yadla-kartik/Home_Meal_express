import React, { useState } from 'react'
import { ChevronDown, Clock3, IndianRupee, Plus, Soup, Store, UtensilsCrossed, Vegan } from 'lucide-react'

const categoryOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts']
const spiceLevels = ['Mild', 'Medium', 'Spicy']

const initialMenu = [
  {
    id: 1,
    dishName: 'Paneer Butter Masala',
    category: 'Dinner',
    price: '220',
    prepTime: '25',
    spiceLevel: 'Medium',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: 2,
    dishName: 'Veg Biryani',
    category: 'Lunch',
    price: '180',
    prepTime: '30',
    spiceLevel: 'Spicy',
    isVeg: true,
    isAvailable: false,
  },
]

const initialForm = {
  dishName: '',
  category: 'Lunch',
  price: '',
  prepTime: '',
  spiceLevel: 'Medium',
  description: '',
  isVeg: true,
  isAvailable: true,
}

function AddMenu() {
  const [menuItems, setMenuItems] = useState(initialMenu)
  const [menuForm, setMenuForm] = useState(initialForm)

  const updateField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setMenuForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newItem = {
      id: Date.now(),
      dishName: menuForm.dishName.trim(),
      category: menuForm.category,
      price: menuForm.price,
      prepTime: menuForm.prepTime,
      spiceLevel: menuForm.spiceLevel,
      isVeg: menuForm.isVeg,
      isAvailable: menuForm.isAvailable,
    }

    setMenuItems((prev) => [newItem, ...prev])
    setMenuForm(initialForm)
  }

  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1df,#f8fafc_58%,#eef2f7)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(118deg,#ea6c0a_0%,var(--theme-accent)_38%,#fb923c_65%,#fdba74_100%)] px-6 py-8 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10">
          <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-[#c2410c]/25 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <Store className="h-3.5 w-3.5" />
                Chef Menu Studio
              </p>
              <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                Add dishes, set pricing and manage daily availability
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                Build a strong menu for your customers with dish details, prep time, spice level,
                and availability all in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/20 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Items added</p>
                <p className="mt-2 text-3xl font-bold">{menuItems.length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Available now</p>
                <p className="mt-2 text-3xl font-bold">
                  {menuItems.filter((item) => item.isAvailable).length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Veg dishes</p>
                <p className="mt-2 text-3xl font-bold">
                  {menuItems.filter((item) => item.isVeg).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                  Add Dish
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Create a new menu item</h2>
              </div>
              <div className="hidden rounded-2xl bg-[var(--theme-accent-soft)] p-3 text-[var(--theme-accent)] sm:block">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Dish name</span>
                  <input
                    type="text"
                    value={menuForm.dishName}
                    onChange={updateField('dishName')}
                    placeholder="Ex. Rajma Chawal"
                    required
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Category</span>
                  <div className="relative">
                    <select
                      value={menuForm.category}
                      onChange={updateField('category')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Price</span>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      value={menuForm.price}
                      onChange={updateField('price')}
                      placeholder="180"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Prep time</span>
                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="5"
                      value={menuForm.prepTime}
                      onChange={updateField('prepTime')}
                      placeholder="25"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
                    />
                  </div>
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  rows="4"
                  value={menuForm.description}
                  onChange={updateField('description')}
                  placeholder="Write short details about ingredients, taste, portion size or serving style..."
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--theme-accent)] focus:bg-white"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Spice level</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {spiceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setMenuForm((prev) => ({ ...prev, spiceLevel: level }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          menuForm.spiceLevel === level
                            ? 'bg-[var(--theme-accent)] text-white shadow-[0_10px_24px_rgba(249,115,22,0.24)]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Vegan className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Vegetarian</p>
                        <p className="text-xs text-slate-500">Mark dish as veg</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={menuForm.isVeg}
                      onChange={updateField('isVeg')}
                      className="h-4 w-4 accent-[var(--theme-accent)]"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Soup className="h-5 w-5 text-[var(--theme-accent)]" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Available today</p>
                        <p className="text-xs text-slate-500">Show this dish to customers</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={menuForm.isAvailable}
                      onChange={updateField('isAvailable')}
                      className="h-4 w-4 accent-[var(--theme-accent)]"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(249,115,22,0.26)] transition hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Add dish to menu
                </button>
                <p className="text-sm text-slate-500">
                  You can update pricing and availability later anytime.
                </p>
              </div>
            </form>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                  Menu Preview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Current menu items</h2>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                {menuItems.filter((item) => item.isAvailable).length} live
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {menuItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-[var(--theme-accent)]/30 hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{item.dishName}</h3>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                          {item.category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.isVeg
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <IndianRupee className="h-4 w-4" />
                          {item.price}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4" />
                          {item.prepTime} mins
                        </span>
                        <span className="rounded-full bg-[var(--theme-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--theme-accent)]">
                          {item.spiceLevel}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAvailability(item.id)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AddMenu
