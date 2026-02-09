import React from 'react'

function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#f97316]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#f97316] border-r-[#f97316] animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-[#f97316]/30" />
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-[#f97316] border-l-[#f97316] animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-[#0f172a]/80">
          {label}
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner
