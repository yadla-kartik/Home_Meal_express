import React from 'react'
import { Crown, LogOut, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import logo from '../../assets/logo.png'
import { superAdminLogout } from '../../../services/superAdminService'
import { useNavigate } from 'react-router-dom'

function SuperAdminNavbar({ onAddAdmin }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await superAdminLogout()
    navigate('/admin/login')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
      className="sticky top-4 z-30 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[24px] border border-white/50 bg-white/70 px-6 py-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(249,115,22,0.1)]"
    >
      <div className="flex items-center gap-4">
        <img src={logo} alt="Home Meal Express" className="h-10 w-auto drop-shadow-md" />
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-orange-300 to-transparent" />
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1.5 text-[12px] font-bold tracking-[0.2em] text-[var(--theme-accent)] uppercase shadow-inner">
          <Crown size={14} className="text-orange-500" />
          <span>Super Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddAdmin}
          className="theme-primary-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold"
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Add Admin</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors hover:bg-orange-100 shadow-sm"
          title="Sign Out"
        >
          <LogOut size={18} />
        </motion.button>
      </div>
    </motion.header>
  )
}

export default SuperAdminNavbar
