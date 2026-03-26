import React from 'react'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, ChefHat, MapPinned, ShieldCheck, TrainFront } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/logo.png'

const footerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

function FooterLink({ to, icon, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm text-[var(--theme-muted)] transition hover:text-[var(--theme-accent)]"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-[var(--theme-shadow-soft)] ring-1 ring-[color:var(--theme-surface-border)] transition group-hover:-translate-y-0.5">
        {React.createElement(icon, { className: 'h-4 w-4 text-[var(--theme-accent)]' })}
      </span>
      <span>{children}</span>
    </Link>
  )
}

function FooterChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--theme-accent)]">
      {children}
    </span>
  )
}

function SiteFooter() {
  return (
    <Motion.footer
      className="w-full pb-8 pt-20"
      variants={footerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,#fffdfb,rgba(255,245,235,0.92))] px-5 py-6 shadow-[var(--theme-shadow-card)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(249,115,22,0.12)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(249,115,22,0.55),transparent)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.95fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Home Meal Express" className="h-16 w-auto" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                  Home Meal Express
                </p>
                <h3 className="mt-1 text-xl font-bold text-[var(--theme-text)]">
                  Homemade train meals with trust and comfort
                </h3>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--theme-muted)]">
              We connect train travelers with local home chefs near major stations, making food more hygienic, affordable, and genuinely home-style during long journeys.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <FooterChip>Fresh and hygienic</FooterChip>
              <FooterChip>On-time seat delivery</FooterChip>
              <FooterChip>Chef income support</FooterChip>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--theme-text)]">
              Passenger Access
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink to="/dashboard" icon={TrainFront}>Journey Dashboard</FooterLink>
              <FooterLink to="/dashboard" icon={MapPinned}>Station Coverage</FooterLink>
              <FooterLink to="/dashboard" icon={ShieldCheck}>How It Works</FooterLink>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--theme-text)]">
              Chef Corner
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink to="/chef/register" icon={ChefHat}>Register as Chef</FooterLink>
              <FooterLink to="/chef/login" icon={ChefHat}>Chef Login</FooterLink>
              <FooterLink to="/chef/register" icon={ShieldCheck}>Start Earning</FooterLink>
            </div>
          </div>

          <div className="rounded-[28px] border border-[color:var(--theme-surface-border)] bg-white/80 p-5 shadow-[var(--theme-shadow-soft)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
              Why It Fits
            </p>
            <h4 className="mt-2 text-lg font-bold text-[var(--theme-text)]">
              Built for families, seniors, and health-conscious travelers
            </h4>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              A simpler way to pre-order fresh homemade food instead of depending on overpriced or low-quality platform meals.
            </p>

            <Link
              to="/chef/register"
              className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-[var(--theme-accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:-translate-y-0.5"
            >
              Join as Chef
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-col gap-3 border-t border-[color:var(--theme-surface-border)] pt-4 text-xs text-[var(--theme-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Home Meal Express helps travelers discover better food choices on the move.</p>
          <p>Designed for homemade quality, fair pricing, and local chef growth.</p>
        </div>
      </div>
    </Motion.footer>
  )
}

export default SiteFooter
