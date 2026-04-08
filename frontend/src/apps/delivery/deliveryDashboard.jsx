import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { deliveryCookieCheck, getDeliveryReviewStatus } from '../../../services/deliveryAuthService'
import DeliveryPopuplogin from './components/DeliveryPopuplogin'
import DeliveryRegisterWorkspace from './components/DeliveryRegisterWorkspace'
import DeliveryVerificationWorkspace from './components/DeliveryVerificationWorkspace'

const DELIVERY_REGISTER_POPUP_DISMISSED_KEY = 'delivery-register-popup-dismissed'

const DeliveryDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [deliveryName, setDeliveryName] = useState('')
  const [isRegistered, setIsRegistered] = useState(Boolean(location.state?.deliveryRegistered))
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    let isMounted = true

    const syncDeliveryState = async () => {
      const res = await deliveryCookieCheck()
      if (!isMounted || !res?.deliveryBoy) return

      const registered = Boolean(res.deliveryBoy.isRegistered || location.state?.deliveryRegistered)
      setDeliveryName(res.deliveryBoy.name || '')
      setIsRegistered(registered)

      if (registered) {
        sessionStorage.removeItem(DELIVERY_REGISTER_POPUP_DISMISSED_KEY)
        setShowPopup(false)
        await getDeliveryReviewStatus()
        return
      }

      if (
        location.state?.hideDeliveryPopup ||
        sessionStorage.getItem(DELIVERY_REGISTER_POPUP_DISMISSED_KEY) === 'true'
      ) {
        setShowPopup(false)
        return
      }

      setShowPopup(true)
    }

    syncDeliveryState()

    return () => {
      isMounted = false
    }
  }, [location.state])

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar
        deliveryName={deliveryName}
        isRegistered={isRegistered}
        onRegisterClick={() => navigate('/delivery/register')}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-6 pt-22 sm:px-6 lg:px-8">
        {isRegistered ? (
          <DeliveryVerificationWorkspace />
        ) : (
          <DeliveryRegisterWorkspace onRegisterClick={() => navigate('/delivery/register')} />
        )}
      </main>

      <DeliveryPopuplogin
        isOpen={showPopup && !isRegistered}
        name={deliveryName}
        onClose={() => {
          sessionStorage.setItem(DELIVERY_REGISTER_POPUP_DISMISSED_KEY, 'true')
          setShowPopup(false)
        }}
        onRegister={() => setShowPopup(false)}
      />
    </div>
  )
}

export default DeliveryDashboard

