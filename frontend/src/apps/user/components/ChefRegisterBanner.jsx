import React from 'react'
import { motion as Motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, ChefHat, Flame, ShieldCheck, Utensils, CheckCircle2, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

/* Each card moves in its own unique direction — floatX/floatY control where it drifts */
function FloatCard({ children, className = '', delay = 0, rotate = 0, floatX = 0, floatY = -10 }) {
  return (
    <Motion.div
      className={`absolute flex items-center justify-center rounded-2xl border border-white/30 bg-white/15 shadow-[0_8px_32px_rgba(15,23,42,0.18)] backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 20, rotate: rotate - 4 }}
      animate={{
        opacity: 1,
        rotate,
        y: [0, floatY, 0],
        x: [0, floatX, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        rotate:  { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        y: { delay: delay + 0.8, duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
        x: { delay: delay + 0.8, duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
      }}
    >
      {children}
    </Motion.div>
  )
}

function StatPill({ icon, label, value, delay, className = '' }) {
  const IconComponent = icon
  return (
    <Motion.div
      className={`absolute flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3.5 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.15)] backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <IconComponent className="h-3.5 w-3.5 text-white" />
      <div className="leading-none">
        <p className="text-[11px] font-bold text-white">{value}</p>
        <p className="text-[9px] text-white/75">{label}</p>
      </div>
    </Motion.div>
  )
}

function Orb({ className }) {
  return (
    <Motion.div
      className={`pointer-events-none absolute rounded-full ${className}`}
      animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* Feature pill shown above the CTA button */
function FeaturePill({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/25 bg-white/14 px-3.5 py-2.5 backdrop-blur-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/18">
        {React.createElement(icon, { className: 'h-3.5 w-3.5 text-white' })}
      </div>
      <div className="leading-none">
        <p className="text-[12px] font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-[10px] text-white/70">{subtitle}</p>
      </div>
    </div>
  )
}

function ChefRegisterBanner() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), { stiffness: 120, damping: 20 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <Motion.section
      className="flex w-full items-center py-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Motion.div
        className="relative mx-auto w-full max-w-6xl cursor-default overflow-hidden rounded-[36px] shadow-[0_18px_36px_rgba(15,23,42,0.16)] transition-shadow duration-300 hover:shadow-[0_28px_58px_rgba(15,23,42,0.24)]"
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(118deg,#ea6c0a_0%,var(--theme-accent)_38%,#fb923c_65%,#fdba74_100%)]" />

        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />

        {/* Orbs */}
        <Orb className="left-[-80px] top-[-60px] h-[260px] w-[260px] bg-white/10 blur-3xl" />
        <Orb className="bottom-[-60px] right-[15%] h-[200px] w-[200px] bg-[#c2410c]/30 blur-2xl" />
        <Motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,255,255,0.13),transparent_60%)]"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Diagonal lines */}
        <div className="pointer-events-none absolute left-[55%] top-0 h-full w-px rotate-[18deg] bg-white/10" />
        <div className="pointer-events-none absolute left-[58%] top-0 h-full w-[2px] rotate-[18deg] bg-white/6" />

        {/* Grid */}
        <div className="relative z-10 grid items-center px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">

          {/* ── LEFT: Copy ── */}
          <div className="flex max-w-lg flex-col items-start">

            {/* Badge */}
            <Motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/95 backdrop-blur-sm"
            >
              <Motion.span
                className="inline-block h-2.5 w-2.5 rounded-[3px] border border-white/75 bg-white/60 shadow-[0_0_0_3px_rgba(255,255,255,0.16)]"
                animate={{ scale: [1, 1.15, 1], rotate: [45, 90, 45], opacity: [0.9, 0.55, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Chef Partner Program
            </Motion.span>

            {/* Headline */}
            <Motion.h2
              variants={itemVariants}
              className="mt-4 text-[26px] font-bold leading-[1.2] tracking-tight text-white sm:text-[34px]"
            >
              Are you a home chef ?
              <br />
              <span className="text-white">Register & start earning</span>
            </Motion.h2>

            {/* Body */}
            <Motion.p
              variants={itemVariants}
              className="mt-3.5 max-w-md text-[14px] leading-[1.75] text-white/84"
            >
              Join Home Meal Express and turn your homemade meals into a steady income stream near major stations.
            </Motion.p>

            {/* ── Feature pills — 3 chips between body and CTA ── */}
            <Motion.div
              variants={itemVariants}
              className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"
            >
              <FeaturePill icon={ShieldCheck} title="Fresh meals"      subtitle="Homemade and hygienic" />
              <FeaturePill icon={Clock3}       title="On-time service"  subtitle="Delivered to train seats" />
              <FeaturePill icon={MapPin}       title="Earn locally"     subtitle="Income for home chefs" />
            </Motion.div>

            {/* CTA */}
            <Motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/chef/register"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-medium text-[var(--theme-accent)] shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.28)]"
              >
                Register as Chef
                <span className="relative inline-flex h-4 w-4 overflow-hidden">
                  <ArrowRight className="absolute inset-0 h-4 w-4 transition duration-1000 group-hover:translate-x-[170%] group-hover:opacity-0" />
                  <ArrowRight className="absolute inset-0 h-4 w-4 -translate-x-[170%] opacity-0 transition duration-1000 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </Link>
            </Motion.div>
          </div>

          {/* ── RIGHT: Illustration ── */}
          <div className="relative mt-10 flex h-[280px] items-center justify-center lg:mt-0">

            {/* Central card — floats straight UP */}
            <FloatCard
              className="h-[130px] w-[130px] flex-col gap-2.5"
              delay={0.25}
              rotate={-3}
              floatX={0}
              floatY={-10}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <p className="text-[10px] font-semibold text-white/90">Chef Profile</p>
            </FloatCard>

            {/* Top-right Utensils — floats diagonally UP+RIGHT */}
            <FloatCard
              className="right-4 top-6 h-[88px] w-[88px]"
              delay={0.38}
              rotate={6}
              floatX={9}
              floatY={-9}
            >
              <Utensils className="h-6 w-6 text-white" />
            </FloatCard>

            {/* Bottom-left Flame — floats LEFT (horizontal only) */}
            <FloatCard
              className="bottom-8 left-6 h-[76px] w-[76px]"
              delay={0.48}
              rotate={-6}
              floatX={-10}
              floatY={0}
            >
              <Flame className="h-5 w-5 text-white" />
            </FloatCard>

            {/* Top-right stat pill */}
            {/* <StatPill
              icon={ShieldCheck}
              label="Chef onboarding"
              value="Quick start"
              delay={0.55}
              className="right-0 top-2"
            /> */}

            {/* "Fresh & hygienic" pill — bottom right, below central card, floats DOWN+RIGHT */}
            {/* <Motion.div
              className="absolute bottom-3 right-1 flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3.5 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.15)] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, 9, 0],
                x: [0, 7, 0],
              }}
              transition={{
                opacity: { delay: 0.68, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                scale:   { delay: 0.68, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                y: { delay: 1.5, duration: 3.9, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
                x: { delay: 1.5, duration: 3.9, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              <div className="leading-none">
                <p className="text-[11px] font-bold text-white">Fresh &amp; hygienic</p>
                <p className="text-[9px] text-white/75">Home-style quality</p>
              </div>
            </Motion.div> */}

            {/* Rotating rings */}
            <Motion.div
              className="absolute h-[200px] w-[200px] rounded-full border border-white/12"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />
            <Motion.div
              className="absolute h-[160px] w-[160px] rounded-full border border-white/8"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Sparkle dots */}
            {[
              { top: '10%', left: '20%', delay: 0 },
              { top: '70%', left: '78%', delay: 0.8 },
              { top: '30%', left: '85%', delay: 1.4 },
            ].map((pos, i) => (
              <Motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-white/80"
                style={{ top: pos.top, left: pos.left }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: pos.delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </Motion.div>
    </Motion.section>
  )
}

export default ChefRegisterBanner
