import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { deliveryCookieCheck, getDeliveryReviewStatus } from '../../../services/deliveryAuthService'
import DeliveryPopuplogin from './components/DeliveryPopuplogin'
import DeliveryRegisterWorkspace from './components/DeliveryRegisterWorkspace'
import DeliveryVerificationWorkspace from './components/DeliveryVerificationWorkspace'
import { getDeliverySocket } from '../../../services/socket'

const DELIVERY_REGISTER_POPUP_DISMISSED_KEY = 'delivery-register-popup-dismissed'

const DeliveryDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [deliveryName, setDeliveryName] = useState('')
  const [isRegistered, setIsRegistered] = useState(Boolean(location.state?.deliveryRegistered))
  const [reviewStatus, setReviewStatus] = useState('pending')
  const [rejectionReason, setRejectionReason] = useState('')
  const [deliveryId, setDeliveryId] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const lastRealtimeUpdateRef = useRef(0)

  useEffect(() => {
    let isMounted = true

    const syncDeliveryState = async () => {
      const requestStartedAt = Date.now()
      const res = await deliveryCookieCheck()
      if (!isMounted || !res?.deliveryBoy) return

      const registered = Boolean(res.deliveryBoy.isRegistered || location.state?.deliveryRegistered)
      setDeliveryName(res.deliveryBoy.name || '')
      setDeliveryId(res.deliveryBoy._id || res.deliveryBoy.id || '')
      setIsRegistered(registered)

      if (registered) {
        sessionStorage.removeItem(DELIVERY_REGISTER_POPUP_DISMISSED_KEY)
        setShowPopup(false)
        const reviewRes = await getDeliveryReviewStatus()
        if (!isMounted) return
        if (lastRealtimeUpdateRef.current > requestStartedAt) return

        setReviewStatus(reviewRes?.status || 'pending')
        setRejectionReason(reviewRes?.rejectionReason || '')
        return
      }

      setReviewStatus('pending')
      setRejectionReason('')

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

  useEffect(() => {
    if (!deliveryId) return

    const socket = getDeliverySocket()
    const joinDeliveryRoom = () => {
      socket.emit('join-delivery-room', deliveryId)
    }

    socket.on('connect', joinDeliveryRoom)
    socket.connect()
    if (socket.connected) {
      joinDeliveryRoom()
    }

    const handleReviewStatus = (payload) => {
      lastRealtimeUpdateRef.current = Date.now()
      setReviewStatus(payload?.status || 'pending')
      setRejectionReason(payload?.rejectionReason || '')
      setIsRegistered(true)
      setShowPopup(false)
    }

    socket.on('delivery:approval-updated', handleReviewStatus)
    socket.on('delivery:review-status', handleReviewStatus)

    return () => {
      socket.off('connect', joinDeliveryRoom)
      socket.off('delivery:approval-updated', handleReviewStatus)
      socket.off('delivery:review-status', handleReviewStatus)
      socket.disconnect()
    }
  }, [deliveryId])

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar
        deliveryName={deliveryName}
        isRegistered={isRegistered}
        onRegisterClick={() => navigate('/delivery/register')}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-6 pt-22 sm:px-6 lg:px-8">
        {isRegistered ? (
          <DeliveryVerificationWorkspace
            status={reviewStatus}
            rejectionReason={rejectionReason}
            onReregister={() => navigate('/delivery/register')}
          />
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

