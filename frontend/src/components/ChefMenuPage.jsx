import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  UtensilsCrossed,
  MapPin,
  ChefHat,
  Clock,
  ShieldCheck,
  IndianRupee,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  Heart,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import { DUMMY_CHEFS, DUMMY_MENUS } from '../data/dummyData'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function ChefMenuPage() {
  const { stationCode, chefId } = useParams()
  const navigate = useNavigate()
  const [chef, setChef] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState({})
  const [activeCategory, setActiveCategory] = useState('All Items')

  useEffect(() => {
    const stationChefs = DUMMY_CHEFS[stationCode] || []
    const foundChef = stationChefs.find(c => c.id === parseInt(chefId))
    if (foundChef) {
      setChef(foundChef)
      setMenuItems(DUMMY_MENUS[`${stationCode}-${chefId}`] || [])
    }
  }, [stationCode, chefId])

  const addToCart = (item) =>
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))

  const removeFromCart = (item) =>
    setCart((prev) => {
      const next = { ...prev }
      if (next[item.id] > 1) next[item.id] -= 1
      else delete next[item.id]
      return next
    })

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = menuItems.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0)

  if (!chef) return null

  const categories = ['All Items', ...new Set(menuItems.map((m) => m.category))]
  const filteredCategories = activeCategory === 'All Items' ? categories.slice(1) : [activeCategory]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <div className="pt-16 pb-20">
        {/* ── Compact Header ─────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Action Bar - Reduced Margin */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-3 flex-wrap gap-y-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-slate-900 hover:text-orange-500 transition-colors font-black text-[10px] sm:text-[11px]"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                <span>BACK</span>
              </button>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">Verified</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all">
                <Heart size={14} />
              </button>
              <button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-500 transition-all">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-dashed border-slate-200">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left w-full">
               <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-md shrink-0">
                 {chef.name.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                    <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">{chef.name}'s Kitchen</h1>
                    <div className="bg-orange-100 text-orange-600 text-[6px] sm:text-[7px] font-black px-1 py-0.5 rounded uppercase tracking-widest border border-orange-200">
                      {chef.tag}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={9} className="text-rose-500" /> {stationCode} Station</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300 hidden sm:block" />
                    <span className="flex items-center gap-1"><UtensilsCrossed size={9} className="text-orange-500" /> {chef.specialty}</span>
                  </div>
               </div>
               
               {/* Quick Stats */}
               <div className="flex gap-1.5 w-full sm:w-auto justify-center">
                  <div className="px-2 py-1 bg-white rounded-lg border border-slate-100 flex items-center gap-2 min-w-[60px]">
                     <Star size={10} className="text-amber-500" fill="currentColor" />
                     <span className="text-[10px] sm:text-[11px] font-black text-slate-800">{chef.rating}</span>
                  </div>
                  <div className="px-2 py-1 bg-white rounded-lg border border-slate-100 flex items-center gap-2 min-w-[60px]">
                     <Clock size={10} className="text-slate-400" />
                     <span className="text-[10px] sm:text-[11px] font-black text-slate-800">35m</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Compact Tabs ───────────────────────── */}
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
           <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide no-scrollbar py-2.5">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 text-[9px] sm:text-[10px] font-black transition-all relative px-1 uppercase tracking-wider ${
                      activeCategory === cat ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat}
                    {activeCategory === cat && (
                      <Motion.div layoutId="activeCat" className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* ── Compact Menu Grid ─────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            {filteredCategories.map((cat, catIdx) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                   <h2 className="text-[10px] sm:text-[11px] font-black text-slate-900 tracking-widest uppercase">{cat}</h2>
                   <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
                  {menuItems.filter(m => m.category === cat).map((item, itemIdx) => (
                    <Motion.div
                      key={item.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: itemIdx * 0.02 }}
                      className="group flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 p-2 transition-all duration-200 hover:border-orange-200 hover:shadow-sm"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-50 flex items-center justify-center text-slate-200">
                         <UtensilsCrossed size={20} className="opacity-20" />
                         
                         {itemIdx === 0 && (
                           <div className="absolute top-0 right-0 left-0 bg-orange-500 py-0.5 text-center">
                             <span className="text-[4px] font-black text-white uppercase">TOP</span>
                           </div>
                         )}

                         <div className={`absolute bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-sm border bg-white flex items-center justify-center ${
                           item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                         }`}>
                           <div className={`h-1 w-1 rounded-full ${
                             item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                           }`} />
                         </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-14">
                        <div>
                           <h3 className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight truncate">{item.name}</h3>
                           <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-tight line-clamp-1">{item.desc}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                           <p className="text-[11px] sm:text-[12px] font-black text-slate-900">₹{item.price}</p>

                           <div className="relative">
                            <AnimatePresence mode="wait">
                               {cart[item.id] ? (
                                 <Motion.div 
                                    key="counter"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-1 rounded-md border border-slate-900 bg-white p-0.5"
                                 >
                                    <button onClick={() => removeFromCart(item)} className="h-4 w-4 flex items-center justify-center rounded text-slate-900 hover:bg-slate-50">
                                      <Minus size={8} strokeWidth={3} />
                                    </button>
                                    <span className="text-[9px] font-black text-slate-900 min-w-[10px] text-center">{cart[item.id]}</span>
                                    <button onClick={() => addToCart(item)} className="h-4 w-4 flex items-center justify-center rounded bg-slate-900 text-white hover:bg-slate-800">
                                      <Plus size={8} strokeWidth={3} />
                                    </button>
                                 </Motion.div>
                               ) : (
                                 <button onClick={() => addToCart(item)} className="px-2 py-0.5 rounded-md border border-slate-200 text-[8px] font-black text-emerald-600 hover:border-slate-900 hover:text-slate-900 transition-all bg-white">
                                    ADD
                                 </button>
                               )}
                            </AnimatePresence>
                           </div>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Compact Checkout Bar ────────────────────────── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <Motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-2 inset-x-4 z-50 flex justify-center"
          >
            <div className="w-full max-w-xl flex items-center justify-between rounded-lg bg-slate-950 p-2 pr-3 shadow-2xl border border-white/5">
              <div className="flex flex-col pl-3">
                 <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">{totalItems} ITEMS</p>
                 <p className="text-sm font-black text-white">₹{totalPrice}</p>
              </div>
              
              <button className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-2 text-[10px] font-black text-white hover:bg-emerald-400 active:scale-95 shadow-lg">
                CONTINUE <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChefMenuPage
