import React from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Store, 
  User, 
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bike,
  CheckCircle2
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar'

function DeliveryOrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [deliveryStep, setDeliveryStep] = React.useState(0) // 0: Start Pickup, 1: Order Delivered, 2: Completed

  React.useEffect(() => {
    if (deliveryStep === 2) {
      const timer = setTimeout(() => {
        navigate('/delivery/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [deliveryStep, navigate])

  const order = {
    id: orderId || 'HME-2451',
    restaurant: 'Sithal Kitchen',
    restaurantAddress: 'Station Food Plaza, Durg',
    customer: 'Aarav Sharma',
    customerContact: '+91 98765 43210',
    train: 'Duronto Express',
    trainNumber: '12261',
    coach: 'B3',
    seat: '42',
    items: [
      { name: 'Paneer Thali', qty: 2, price: '₹320' },
      { name: 'Masala Chaas', qty: 2, price: '₹80' }
    ],
    total: '₹400',
    earning: '₹45',
    status: 'Ready to Pickup',
  }

  const handleAction = () => {
    if (deliveryStep < 2) {
      setDeliveryStep(deliveryStep + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--theme-body-bg)]">
      <Navbar isRegistered={true} deliveryName="Nayan" />
      
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-12">
        {/* Sleek Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/delivery/dashboard')}
          className="group mb-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-accent)]"
        >
          <ChevronLeft size={14} />
          Dashboard
        </motion.button>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {/* Compact Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--theme-accent)]">Live Task</p>
                  <h1 className="mt-0.5 text-xl font-black tracking-tight text-[var(--theme-text)]">Order #{order.id}</h1>
                </div>
                <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${deliveryStep === 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {deliveryStep === 0 ? 'Ready to Pickup' : deliveryStep === 1 ? 'Out for Delivery' : 'Delivered'}
                </span>
              </div>

              {/* Ultra Sleek Path */}
              <div className="mt-6 space-y-6 relative before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-12px)] before:w-[1.5px] before:bg-slate-50 before:content-['']">
                <div className="relative flex gap-4">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${deliveryStep >= 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'} shadow-sm transition-colors duration-500`}>
                    {deliveryStep >= 1 ? <ShieldCheck size={16} /> : <Store size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">Pickup From</p>
                    <h3 className="text-[13px] font-bold text-[var(--theme-text)]">{order.restaurant}</h3>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">{order.restaurantAddress}</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${deliveryStep === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'} shadow-sm transition-colors duration-500`}>
                    {deliveryStep === 2 ? <CheckCircle2 size={16} /> : <Bike size={16} className="delivery-bike-icon" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">Drop To</p>
                    <h3 className="text-[13px] font-bold text-[var(--theme-text)]">{order.train} ({order.trainNumber})</h3>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500">Coach {order.coach}, Seat {order.seat}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Items Card - Compact */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-[var(--theme-accent)]" />
                <h2 className="text-sm font-black text-[var(--theme-text)]">Order Items</h2>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-[var(--theme-accent)]">{item.qty}x</span>
                      <p className="text-[12px] font-bold text-[var(--theme-text)]">{item.name}</p>
                    </div>
                    <p className="text-[12px] font-black text-[var(--theme-text)]">{item.price}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - More Compact */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[22px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-soft)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-[var(--theme-muted)]">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black text-[var(--theme-text)]">{order.customer}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Passenger</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-50 py-2.5 text-[var(--theme-accent)] transition hover:bg-orange-100">
                  <Phone size={14} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Call</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-[var(--theme-text)] transition hover:bg-slate-100">
                  <MessageCircle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Chat</span>
                </button>
              </div>
            </motion.div>

            {/* Payout - Sleek & Small */}
            <motion.div 
              className="rounded-[22px] bg-[var(--theme-text)] p-5 text-white shadow-lg"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-400">Your Earning</p>
              <div className="mt-1 flex items-baseline gap-1">
                <h2 className="text-2xl font-black">{order.earning}</h2>
                <span className="text-[10px] font-medium text-slate-400">Fixed</span>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[8px] font-black uppercase tracking-wider">Verified Payout</span>
              </div>
            </motion.div>

            <motion.button 
              layout
              onClick={handleAction}
              className={`w-full rounded-[18px] py-4 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                ${deliveryStep === 0 ? 'bg-[var(--theme-accent)] hover:bg-orange-600' : 
                  deliveryStep === 1 ? 'bg-orange-500 hover:bg-orange-600' : 
                  'bg-emerald-600 cursor-default'}`}
            >
              {deliveryStep === 0 ? (
                <>Order Picked up <ArrowRight size={14} /></>
              ) : deliveryStep === 1 ? (
                <>Order Delivered <CheckCircle2 size={14} /></>
              ) : (
                <>Completed <ShieldCheck size={14} /></>
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DeliveryOrderDetails
