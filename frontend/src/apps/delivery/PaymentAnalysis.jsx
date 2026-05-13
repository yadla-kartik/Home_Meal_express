import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  PieChart,
  BarChart3,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const stats = [
  { label: 'Today Earning', value: '₹1,245', change: '+12.5%', trend: 'up' },
  { label: 'Weekly Total', value: '₹8,640', change: '+8.2%', trend: 'up' },
  { label: 'Deliveries', value: '42', change: '+5', trend: 'up' },
  { label: 'Payout', value: '₹2,100', change: 'Next Week', trend: 'neutral' },
]

const recentTransactions = [
  { id: 'TXN-9901', type: 'Delivery Earning', date: 'Today, 4:20 PM', amount: '₹45.00', status: 'Credited' },
  { id: 'TXN-9900', type: 'Delivery Earning', date: 'Today, 2:15 PM', amount: '₹38.50', status: 'Credited' },
  { id: 'TXN-9895', type: 'Weekly Payout', date: 'Yesterday', amount: '-₹4,200', status: 'Bank Transfer' },
  { id: 'TXN-9892', type: 'Bonus Incentive', date: 'Oct 12, 2023', amount: '₹250.00', status: 'Credited' },
]

function PaymentAnalysis() {
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
          <h1 className="text-2xl font-black tracking-tight text-[var(--theme-text)] sm:text-3xl">Earnings & Analysis</h1>
          <p className="mt-1 text-xs font-medium text-[var(--theme-muted)]">Detailed breakdown of your financial performance</p>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-[24px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                  {idx === 0 ? <TrendingUp size={18} /> : idx === 1 ? <BarChart3 size={18} /> : idx === 2 ? <PieChart size={18} /> : <Wallet size={18} />}
                </div>
                {stat.trend !== 'neutral' && (
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-muted)]">{stat.label}</p>
              <h3 className="mt-0.5 text-xl font-black text-[var(--theme-text)]">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Earnings Chart Mockup */}
          <section className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-[var(--theme-text)]">Revenue Growth</h2>
                <p className="text-[11px] text-[var(--theme-muted)] font-medium">Monthly performance visualizer</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--theme-surface-border)] bg-[var(--theme-body-bg)] p-1">
                <button className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-[var(--theme-muted)] transition hover:bg-white">Week</button>
                <button className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-[var(--theme-accent)] shadow-sm">Month</button>
              </div>
            </div>

            <div className="relative h-[240px] w-full flex items-end justify-between gap-1.5 pt-10">
              {[40, 70, 45, 90, 65, 80, 55, 75, 60, 85, 40, 95].map((height, i) => (
                <div key={i} className="group relative flex-1 flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={`w-full rounded-t-lg transition-all ${i === 11 ? 'bg-[var(--theme-accent)]' : 'bg-slate-100 group-hover:bg-[var(--theme-accent-soft)]'}`}
                  />
                  <p className="mt-2 text-[8px] font-bold text-[var(--theme-muted)]">M{i+1}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="flex flex-col gap-5">
            <div className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[var(--theme-text)]">History</h2>
                <button className="text-[10px] font-bold text-[var(--theme-accent)] hover:underline">Download</button>
              </div>

              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="group flex items-center justify-between rounded-xl border border-transparent bg-[var(--theme-body-bg)] p-3 transition hover:border-[var(--theme-accent-soft)] hover:bg-white">
                    <div className="flex items-center gap-2.5">
                      <div className={`grid h-8 w-8 place-items-center rounded-lg ${txn.amount.startsWith('-') ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--theme-text)]">{txn.type}</p>
                        <p className="text-[9px] font-medium text-[var(--theme-muted)]">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black ${txn.amount.startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                        {txn.amount}
                      </p>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--theme-muted)]">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-xl border border-[var(--theme-surface-border)] bg-[var(--theme-body-bg)] py-2.5 text-[10px] font-bold text-[var(--theme-muted)] transition hover:bg-slate-100">
                Full Statement
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="rounded-[28px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--theme-accent)] text-white shadow-md">
                  <Wallet size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--theme-text)]">Payout Ready</h3>
              </div>
              <p className="text-xs leading-5 text-[var(--theme-muted)] font-medium">Balance <span className="font-bold text-[var(--theme-accent)]">₹2,100</span> is ready for transfer.</p>
              <button className="theme-primary-button mt-4 w-full rounded-xl py-3 text-xs font-bold transition hover:opacity-95">
                Transfer Now
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default PaymentAnalysis
