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
  Leaf,
  Drumstick,
  Cookie,
  Coffee,
  ChevronDown,
  ChevronRight,
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
  imageMode: '',
  imageUrl: '',
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
    imageMode: '',
    imageUrl: '',
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
    imageMode: '',
    imageUrl: '',
  },
]

const categories = [
  { id: 'Veg', title: 'Veg', desc: 'Pure vegetarian dishes', icon: Leaf },
  { id: 'Non-Veg', title: 'Non-Veg', desc: 'Contains meat or egg', icon: Drumstick },
  { id: 'Snacks', title: 'Snacks', desc: 'Light bites and fast food', icon: Cookie },
  { id: 'Breakfast', title: 'Breakfast', desc: 'Morning specials', icon: Coffee },
  { id: 'Thali', title: 'Thali', desc: 'Complete meal combos', icon: UtensilsCrossed },
]
const spiceLevels = ['Mild', 'Medium', 'Spicy']
const tagOptions = ['Healthy', 'Homemade', 'Low Oil', 'Quick', 'Protein Rich']
const stationOptions = ['Raipur', 'Durg', 'Bhilai', 'Nagpur']

const fieldCls = 'theme-input min-h-10 rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium'
const labelCls = 'text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]'

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
      className={`group relative w-full rounded-[14px] border p-2 text-left transition ${
        selected
          ? 'border-[var(--theme-accent)] bg-[linear-gradient(180deg,#fffaf4,#fff3e7)] shadow-[0_4px_12px_rgba(249,115,22,0.08)]'
          : 'border-[rgba(249,115,22,0.14)] bg-white hover:-translate-y-0.5 hover:shadow-sm'
      }`}
    >
      <div className="flex gap-2.5 items-center">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ef,#ffffff)] text-[var(--theme-accent)]">
          <UtensilsCrossed size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[13px] font-bold text-[var(--theme-text)]">
              {dish.name || 'Untitled dish'}
            </h3>
            <span className="shrink-0 font-bold text-[13px] text-[var(--theme-accent)]">
              ₹{dish.price || '0'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[var(--theme-muted)]">
                {dish.category}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-[var(--theme-muted)]">
                {dish.prepTime}m
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className={`text-[10px] font-semibold ${
                dish.available ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {dish.available ? 'Avail' : 'Paused'}
              </span>
            </div>
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
              className="text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 p-0.5"
              title="Remove dish"
            >
              <Trash2 size={13} />
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

function AddMenu() {
  const navigate = useNavigate()
  const fileInputRef = React.useRef(null)
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false)
  const [isGeneratingDescAI, setIsGeneratingDescAI] = React.useState(false)
  const [customTagInput, setCustomTagInput] = React.useState('')
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
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

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateDish('imageUrl', url)
      updateDish('imageMode', 'upload')
    }
  }

  const handleGenerateAI = () => {
    if (!selectedDish.name) {
      alert("Please enter a dish name first to generate an AI image.")
      return
    }
    updateDish('imageMode', 'ai')
    setIsGeneratingAI(true)
    setTimeout(() => {
      // Simulate AI generation with a placeholder image based on name
      const seed = encodeURIComponent(selectedDish.name.trim().toLowerCase())
      updateDish('imageUrl', `https://picsum.photos/seed/${seed}/400/300`)
      setIsGeneratingAI(false)
    }, 1500)
  }

  const handleGenerateDescriptionAI = () => {
    if (!selectedDish.name) {
      alert("Please enter a dish name first to generate a description.")
      return
    }
    setIsGeneratingDescAI(true)
    setTimeout(() => {
      const descriptions = [
        `Authentic ${selectedDish.name} made with fresh ingredients. Perfect for your journey.`,
        `Comforting ${selectedDish.name}, cooked to perfection. A taste of home.`,
        `Flavorful and hygienic ${selectedDish.name}. Your ideal travel meal.`
      ]
      const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)]
      updateDish('description', randomDesc)
      setIsGeneratingDescAI(false)
    }, 1500)
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
        <section className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/chef/dashboard')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:bg-slate-50 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
          <button
            type="button"
            onClick={addDish}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:scale-105"
          >
            <Plus size={16} />
            Add dish
          </button>
        </section>

        <section className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-accent)]">
                  Menu items
                </p>
                <p className="mt-0.5 text-xs font-medium text-[var(--theme-muted)]">
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
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col gap-3 rounded-[24px] border border-[rgba(249,115,22,0.16)] bg-[linear-gradient(135deg,#fffaf4,#ffffff)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--theme-chip-border)] bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                      {selectedDish.imageUrl ? (
                        <img src={selectedDish.imageUrl} alt="Dish" className="h-full w-full object-cover" />
                      ) : isGeneratingAI ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent"></div>
                      ) : (
                        <ImagePlus size={22} />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--theme-text)]">Dish image</p>
                      <p className="mt-0.5 text-[11px] leading-5 text-[var(--theme-muted)]">
                        Upload your own image or generate an AI dish image based on name.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ToggleChip active={selectedDish.imageMode === 'upload'} onClick={() => fileInputRef.current?.click()}>
                      Upload
                    </ToggleChip>
                    <ToggleChip active={selectedDish.imageMode === 'ai'} onClick={handleGenerateAI}>
                      <span className="inline-flex items-center gap-1.5">
                        {isGeneratingAI ? 'Generating...' : <><Sparkles size={12} /> AI image</>}
                      </span>
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
                    <div className="theme-input flex min-h-10 items-center gap-2 rounded-[14px] px-3.5 py-2.5">
                      <IndianRupee size={14} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent text-[13px] font-medium outline-none" value={selectedDish.price} onChange={(event) => updateDish('price', event.target.value.replace(/\D/g, ''))} placeholder="149" />
                    </div>
                  </label>
                  <div className="grid gap-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className={labelCls}>Description</span>
                      <button
                        type="button"
                        onClick={handleGenerateDescriptionAI}
                        disabled={isGeneratingDescAI}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fffaf4,#ffffff)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-accent)] transition hover:border-[var(--theme-accent)] disabled:opacity-70"
                      >
                        {isGeneratingDescAI ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--theme-accent)] border-t-transparent"></div>
                        ) : (
                          <Sparkles size={10} />
                        )}
                        {isGeneratingDescAI ? 'Generating...' : 'AI Generate'}
                      </button>
                    </div>
                    <textarea className="theme-input min-h-16 rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium resize-none leading-relaxed" value={selectedDish.description} onChange={(event) => updateDish('description', event.target.value)} placeholder="Briefly describe your dish." />
                  </div>
                  <div className="grid gap-2 relative">
                    <span className={labelCls}>Category</span>
                    
                    {isCategoryOpen && (
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                    )}

                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className={`${fieldCls} flex items-center justify-between bg-white text-left transition hover:border-[var(--theme-accent)] relative z-20`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedDish.category}
                      </span>
                      <ChevronDown size={14} className={`text-[var(--theme-muted)] transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCategoryOpen && (
                      <div className="absolute top-full mt-2 w-full z-30 rounded-[20px] border border-[var(--theme-chip-border)] bg-[#fcfaf8] p-1.5 shadow-[0_12px_32px_rgba(249,115,22,0.1)]">
                        <div className="flex flex-col gap-0.5">
                          {categories.map((cat) => {
                            const Icon = cat.icon
                            const isSelected = selectedDish.category === cat.id
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  updateDish('category', cat.id)
                                  setIsCategoryOpen(false)
                                }}
                                className={`group flex w-full items-center gap-2.5 rounded-[14px] p-2 text-left transition-all ${
                                  isSelected
                                    ? 'bg-white shadow-[0_2px_8px_rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)]'
                                    : 'border border-transparent hover:bg-white hover:border-[rgba(249,115,22,0.1)] hover:shadow-[0_2px_8px_rgba(249,115,22,0.04)]'
                                }`}
                              >
                                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-colors ${isSelected ? 'text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]' : 'text-slate-400 bg-slate-100 group-hover:text-[var(--theme-accent)]'}`}>
                                  <Icon size={15} strokeWidth={isSelected ? 2.5 : 2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[12px] font-bold ${isSelected ? 'text-[var(--theme-text)]' : 'text-slate-600 group-hover:text-[var(--theme-text)]'}`}>{cat.title}</p>
                                  <p className="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">{cat.desc}</p>
                                </div>
                                <ChevronRight size={13} className={`transition-colors ${isSelected ? 'text-[var(--theme-accent)]' : 'text-transparent group-hover:text-slate-300'}`} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="grid gap-2">
                    <span className={labelCls}>Preparation time</span>
                    <div className="theme-input flex min-h-10 items-center gap-2 rounded-[14px] px-3.5 py-2.5">
                      <Clock3 size={14} className="text-[var(--theme-accent)]" />
                      <input className="w-full bg-transparent text-[13px] font-medium outline-none" value={selectedDish.prepTime} onChange={(event) => updateDish('prepTime', event.target.value.replace(/\D/g, ''))} placeholder="20" />
                      <span className="text-[11px] font-semibold text-[var(--theme-muted)]">min</span>
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
                  <div className="rounded-[22px] border border-[rgba(249,115,22,0.16)] bg-[#fffdfa] p-4 md:col-span-2">
                    <p className={`${labelCls} inline-flex items-center gap-2`}><Tags size={13} /> Tags</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {Array.from(new Set([...tagOptions, ...(selectedDish.tags || [])])).map((tag) => (
                        <ToggleChip key={tag} active={selectedDish.tags.includes(tag)} onClick={() => toggleArrayValue('tags', tag)}>
                          {tag}
                        </ToggleChip>
                      ))}
                      
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const val = customTagInput.trim()
                        if (val && !(selectedDish.tags || []).includes(val)) {
                          updateDish('tags', [...(selectedDish.tags || []), val])
                        }
                        setCustomTagInput('')
                      }} className="flex items-center gap-1.5 ml-1">
                        <input
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          placeholder="+ Add tag..."
                          className="w-[100px] rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--theme-text)] outline-none transition-all placeholder:text-slate-400 focus:w-[130px] focus:border-[var(--theme-accent)] focus:bg-[var(--theme-accent-soft)]"
                        />
                      </form>
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