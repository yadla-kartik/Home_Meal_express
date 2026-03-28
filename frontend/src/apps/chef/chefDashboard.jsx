import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import ChefRegisterBanner, { ChefVerificationBanner, ChefVerifiedBanner } from './components/Banner'
import Popuplogin from './components/Popuplogin'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(!location.state?.hideChefPopup)
  const [isRegistered, setIsRegistered] = useState(Boolean(location.state?.chefRegistered))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1df,#f8fafc_58%,#eef2f7)]">
      <Navbar
        isRegistered={isRegistered}
        onRegisterClick={() => navigate('/chef/register')}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-6 pt-22 sm:px-6 lg:px-8">
        <ChefRegisterBanner />
        <ChefVerificationBanner />
        <ChefVerifiedBanner />
      </main>

      <Popuplogin
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onRegister={setIsRegistered}
      />
    </div>
  )
}

export default Dashboard
