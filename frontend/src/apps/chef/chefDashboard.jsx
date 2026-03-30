import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import ChefRegisterBanner, { ChefVerificationBanner, ChefVerifiedBanner } from './components/Banner'
import Popuplogin from './components/Popuplogin'
import { chefCookieCheck } from '../../../services/chefAuthService'

const chefDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [isRegistered, setIsRegistered] = useState(Boolean(location.state?.chefRegistered))

  useEffect(() => {
    let isMounted = true

    const syncChefState = async () => {
      const res = await chefCookieCheck()
      if (!isMounted) return

      const registered = Boolean(res?.chefUser?.isRegistered || location.state?.chefRegistered)
      setIsRegistered(registered)

      if (location.state?.hideChefPopup || registered) {
        setShowPopup(false)
        return
      }

      setShowPopup(true)
    }

    syncChefState()

    return () => {
      isMounted = false
    }
  }, [location.state])

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
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
        isOpen={showPopup && !isRegistered}
        onClose={() => setShowPopup(false)}
        onRegister={setIsRegistered}
      />
    </div>
  )
}

export default chefDashboard
