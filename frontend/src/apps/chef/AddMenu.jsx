import React from 'react'
import {
  ArrowLeft,
  Clock3,
  ImagePlus,
  IndianRupee,
  Plus,
  Sparkles,
  Tags,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const emptyDish = {
  name: '',
  description: '',
  price: '',
  category: 'Veg',
  prepTime: '20',
  available: true,
  servingSize: '1 person',
  spiceLevel: 'Medium',
  addOns: '',
  tags: ['Homemade'],
  stations: ['Raipur'],
  imageMode: 'ai',
}

const starterDishes = [
  {
    id: 'dish-1',
    name: 'Gharwali Veg Thali',
    description: 'Fresh dal, seasonal sabzi, rice, roti and homemade pickle packed for train travel.',
    price: '149',
    category: 'Veg',
    prepTime: '25',
    available: true,
    servingSize: '1 person',
    spiceLevel: 'Medium',
    addOns: 'Extra roti, curd',
    tags: ['Homemade', 'Healthy', 'Low Oil'],
    stations: ['Raipur', 'Durg'],
    imageMode: 'ai',
  },
  {
    id: 'dish-2',
    name: 'Poha Snack Box',
    description: 'Light poha with peanuts, sev and lemon. Good for morning departures.',
    price: '79',
    category: 'Snacks',
    prepTime: '12',
    available: true,
    servingSize: '1 box',
    spiceLevel: 'Mild',
    addOns: 'Tea flask',
    tags: ['Quick', 'Homemade'],
    stations: ['Raipur'],
    imageMode: 'upload',
  },
]

const categories = ['Veg', 'Non-Veg', 'Snacks', 'Breakfast', 'Thali']
const spiceLevels = ['Mild', 'Medium', 'Spicy']
const tagOptions = ['Healthy', 'Homemade', 'Low Oil', 'Quick', 'Protein Rich']
const stationOptions = ['Raipur', 'Durg', 'Bhilai', 'Nagpur']

const fieldCls = 'theme-input min-h-11 rounded-2xl px-4 py-3 text-sm font-medium'
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]'

function ToggleChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
          : 'border-slate-200 bg-white text-[var(--theme-muted)] hover:border-[var(--theme-chip-border)]'
      }`}
    >
      {children}
    </button>
  )
}

function DishPreview({ dish, selected, onClick, onRemove }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[22px] border p-3 text-left transition ${
        selected
          ? 'border-[var(--theme-accent)] bg-[linear-gradient(180deg,#fffaf4,#fff3e7)] shadow-[0_16px_32px_rgba(249,115,22,0.13)]'
          : 'border-[rgba(249,115,22,0.14)] bg-white hover:-translate-y-0.5 hover:shadow-[var(--theme-shadow-soft)]'
      }`}
    >
      <div className="flex gap-3">
        <div className="grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-[18px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#ffffff)] text-[var(--theme-accent)]">
          <UtensilsCrossed size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[var(--theme-text)]">
                {dish.name || 'Untitled dish'}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--theme-muted)]">
                {dish.description || 'Add a short dish description.'}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
              Rs. {dish.price || '0'}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--theme-chip-border)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-muted)]">
              {dish.category}
            </span>
            <span className="rounded-full border border-[var(--theme-chip-border)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-muted)]">
              {dish.prepTime} min
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
              dish.available ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-600'
            }`}>
              {dish.available ? 'Available' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <span
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              onRemove()
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={12} />
          Remove
        </span>
      </div>
    </button>
  )
}

function AddMenu() {
  const navigate = useNavigate()
  const [dishes, setDishes] = React.useState(starterDishes)
  const [selectedId, setSelectedId] = React.useState(starterDishes[0].id)
  const selectedDish = dishes.find((dish) => dish.id === selectedId) || dishes[0]

  const updateDish = (key, value) => {
    setDishes((prev) => prev.map((dish) => (
      dish.id === selectedDish.id ? { ...dish, [key]: value } : dish
    )))
  }

  const toggleArrayValue = (key, value) => {
    const current = selectedDish[key] || []
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    updateDish(key, next)
  }

  const addDish = () => {
    const nextDish = {
      ...emptyDish,
      id: `dish-${Date.now()}`,
      name: `New dish ${dishes.length + 1}`,
    }
    setDishes((prev) => [nextDish, ...prev])
    setSelectedId(nextDish.id)
  }

  const removeDish = (dishId) => {
    setDishes((prev) => {
      const next = prev.filter((dish) => dish.id !== dishId)
      if (selectedId === dishId) {
        setSelectedId(next[0]?.id || '')
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar isRegistered onRegisterClick={() => navigate('/chef/register')} />

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-8 pt-22 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white px-5 py-5 shadow-[var(--theme-shadow-card)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <button
                type="button"
                onClick={() => navigate('/chef/dashboard')}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-accent)]"
              >
                <ArrowLeft size={14} />
                Back to dashboard
              </button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                Menu setup
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-[var(--theme-text)] sm:text-3xl">
                Add menu for your kitchen
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                Create homemade dishes with clear pricing, prep time, station availability and images so passengers can order confidently.
              </p>
            </div>

            <button
              type="button"
              onClick={addDish}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Add dish
            </button>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  Menu items
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--theme-muted)]">
                  {dishes.length} dish{dishes.length === 1 ? '' : 'es'} added
                </p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <UtensilsCrossed size={18} />
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {dishes.length ? (
                dishes.map((dish) => (
                  <DishPreview
                    key={dish.id}
                    dish={dish}
                    selected={dish.id === selectedDish?.id}
                    onClick={() => setSelectedId(dish.id)}
                    onRemove={() => removeDish(dish.id)}
                  />
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/45 p-5 text-center">
                  <p className="text-sm font-semibold text-[var(--theme-text)]">No dishes yet</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--theme-muted)]">Add your first dish to start building the menu.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-card)] sm:p-5">
            {selectedDish ? (
              <div className="grid gap-5">
                <div className="flex flex-col gap-3 rounded-[24px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(135deg,#fffaf4,#ffffff)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[var(--theme-chip-border)] bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                      <ImagePlus size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">Dish image</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--theme-muted)]">
                        Upload your own image or generate an AI dish image later.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ToggleChip active={selectedDish.imageMode === 'upload'} onClick={() => updateDish('imageMode', 'upload')}>
                      Upload
                    </ToggleChip>
                    <ToggleChip active={selectedDish.imageMode === 'ai'} onClick={() => updateDish('imageMode', 'ai')}>
                      <span className="inline-flex items-center gap-1.5"><Sparkles size={12} /> AI image</span>
                    </ToggleChip>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className={labelCls}>Dish name</span>
                    <input className={fieldCls} value={selectedDish.name} onChange={(event) => updateDish('name', event.target.value)} placeholder="Paneer thali" />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Price</span>
                    <div className="theme-input flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3">
                      <IndianRupee size={15} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent text-sm font-medium outline-none" value={selectedDish.price} onChange={(event) => updateDish('price', event.target.value.replace(/\D/g, ''))} placeholder="149" />
                    </div>
                  </label>
                  <label className="grid gap-2 md:col-span-2">
                    <span className={labelCls}>Description</span>
                    <textarea className={`${fieldCls} min-h-24 resize-none`} value={selectedDish.description} onChange={(event) => updateDish('description', event.target.value)} placeholder="Tell passengers what makes this dish special." />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Category</span>
                    <select className={fieldCls} value={selectedDish.category} onChange={(event) => updateDish('category', event.target.value)}>
                      {categories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Preparation time</span>
                    <div className="theme-input flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3">
                      <Clock3 size={15} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent text-sm font-medium outline-none" value={selectedDish.prepTime} onChange={(event) => updateDish('prepTime', event.target.value.replace(/\D/g, ''))} placeholder="20" />
                      <span className="text-xs font-semibold text-[var(--theme-muted)]">min</span>
                    </div>
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Serving size</span>
                    <input className={fieldCls} value={selectedDish.servingSize} onChange={(event) => updateDish('servingSize', event.target.value)} placeholder="1 person" />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelCls}>Add-ons</span>
                    <input className={fieldCls} value={selectedDish.addOns} onChange={(event) => updateDish('addOns', event.target.value)} placeholder="Extra roti, curd" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={labelCls}>Spice level</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {spiceLevels.map((level) => (
                        <ToggleChip key={level} active={selectedDish.spiceLevel === level} onClick={() => updateDish('spiceLevel', level)}>
                          {level}
                        </ToggleChip>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={labelCls}>Availability</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ToggleChip active={selectedDish.available} onClick={() => updateDish('available', true)}>Available</ToggleChip>
                      <ToggleChip active={!selectedDish.available} onClick={() => updateDish('available', false)}>Paused</ToggleChip>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={`${labelCls} inline-flex items-center gap-2`}><Tags size={13} /> Tags</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tagOptions.map((tag) => (
                        <ToggleChip key={tag} active={selectedDish.tags.includes(tag)} onClick={() => toggleArrayValue('tags', tag)}>
                          {tag}
                        </ToggleChip>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4">
                    <p className={labelCls}>Station availability</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stationOptions.map((station) => (
                        <ToggleChip key={station} active={selectedDish.stations.includes(station)} onClick={() => toggleArrayValue('stations', station)}>
                          {station}
                        </ToggleChip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-text)]">Menu draft is ready locally</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--theme-muted)]">Backend save can connect to this same structure when the API is ready.</p>
                  </div>
                  <button type="button" className="rounded-2xl bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)]">
                    Save menu
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  )
}

export default AddMenu
