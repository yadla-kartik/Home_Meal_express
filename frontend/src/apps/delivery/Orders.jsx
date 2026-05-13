import React from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Navigation,
  Search,
  Filter,
  ChevronLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const activeOrders = [
  {
    id: 'ORD-8821',
    restaurant: 'Sithal Kitchen',
    customer: 'Aarav Sharma',
    pickup: 'Platform 2, Durg Station',
    drop: 'B3 Coach, Seat 42',
    status: 'In Transit',
    time: '12 min left',
    type: 'Hot Meal'
  },
  {
    id: 'ORD-8825',
    restaurant: 'Golu Home Meals',
    customer: 'Nisha Verma',
    pickup: 'Gate 1, Raipur Station',
    drop: 'A1 Coach, Seat 18',
    status: 'Ready for Pickup',
    time: '5 min ago',
    type: 'Express'
  }
]

const completedOrders = [
  { id: 'ORD-8790', customer: 'Kabir Mehta', date: 'Today, 2:30 PM', amount: '₹145', status: 'Delivered' },
  { id: 'ORD-8785', customer: 'Riya Singh', date: 'Today, 1:15 PM', amount: '₹220', status: 'Delivered' },
  { id: 'ORD-8780', customer: 'Amit Patel', date: 'Yesterday', amount: '₹186', status: 'Delivered' },
]

function Orders() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[var(--theme-body-bg)]">
      <Navbar isRegistered={true} deliveryName="Nayan" />
      
      <main className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/delivery/dashboard')}
          className="group mb-6 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-accent)]"
        >
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </motion.button>

        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-accent)] opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]"></span>
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">On-Duty</p>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--theme-text)] sm:text-3xl">
                Hello, <span className="text-[var(--theme-accent)]">Nayan!</span>
              </h1>
              <p className="text-xs font-medium text-[var(--theme-muted)]">
                You have <span className="font-bold text-[var(--theme-text)]">{activeOrders.length} tasks</span> pending today.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div className="group relative flex-1 sm:min-w-[280px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--theme-muted)] transition-colors group-focus-within:text-[var(--theme-accent)]" />
                <input
                  type="text"
                  placeholder="Search order ID..."
                  className="theme-input w-full rounded-xl pl-10 pr-4 py-2 text-xs font-semibold shadow-sm"
                />
              </div>
              <button className="theme-soft-button grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl transition hover:text-[var(--theme-accent)] active:scale-95">
                <Filter size={18} />
              </button>
            </motion.div>
          </div>
        </header>

        {/* Active Orders Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--theme-accent)] text-white shadow-sm">
              <Package size={14} />
            </div>
            <h2 className="text-base font-bold text-[var(--theme-text)]">Active Tasks</h2>
            <div className="h-px flex-1 bg-[var(--theme-surface-border)]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {activeOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-[24px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-4 shadow-sm transition hover:shadow-[var(--theme-shadow-soft)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                      <Navigation size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-accent)]">{order.id}</p>
                      <h3 className="text-sm font-bold text-[var(--theme-text)]">{order.restaurant}</h3>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--theme-body-bg)] px-2.5 py-1 text-[10px] font-bold text-[var(--theme-muted)]">
                    {order.time}
                  </div>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]" />
                      <div className="w-px flex-1 bg-[var(--theme-surface-border)] my-0.5" />
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex-1 text-xs font-medium leading-none space-y-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[var(--theme-muted)] mb-1">Pickup</p>
                        <p className="text-[var(--theme-text)]">{order.pickup}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[var(--theme-muted)] mb-1">Deliver</p>
                        <p className="text-[var(--theme-text)]">{order.drop}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--theme-surface-border)] pt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-[var(--theme-muted)]">{order.status}</span>
                  </div>
                  <button className="theme-primary-button flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold transition hover:opacity-90 active:scale-95">
                    Update Status
                    <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Completed Orders Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[var(--theme-text)]">Recent Activity</h2>
            <button className="text-[10px] font-bold text-[var(--theme-accent)] hover:underline">View All</button>
          </div>

          <div className="grid gap-2.5">
            {completedOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center justify-between rounded-[20px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-3.5 shadow-sm transition hover:border-[var(--theme-accent)] hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm transition group-hover:scale-105">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[var(--theme-text)]">{order.customer}</h4>
                      <span className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">{order.id}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] font-medium text-[var(--theme-muted)]">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-[var(--theme-text)]">{order.amount}</p>
                    <p className="mt-0.5 text-[8px] font-bold text-emerald-600 uppercase tracking-tight">Earned</p>
                  </div>
                  <div className="h-7 w-7 grid place-items-center rounded-full bg-[var(--theme-body-bg)] text-slate-400 transition group-hover:bg-[var(--theme-accent-soft)] group-hover:text-[var(--theme-accent)]">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.99 }}
            className="mt-5 w-full rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-surface)] py-3 text-[10px] font-bold text-[var(--theme-muted)] transition hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)] hover:text-[var(--theme-accent)]"
          >
            Load History
          </motion.button>
        </section>
      </main>
    </div>
  )
}

export default Orders
