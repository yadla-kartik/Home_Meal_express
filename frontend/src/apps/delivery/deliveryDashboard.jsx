import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { deliveryCookieCheck, getAvailableDeliveryOrders, getDeliveryReviewStatus } from '../../../services/deliveryAuthService'
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
  const [activeOrders, setActiveOrders] = useState([])
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
        if ((reviewRes?.status || 'pending') === 'approved') {
          const ordersRes = await getAvailableDeliveryOrders()
          if (isMounted && ordersRes?.success) {
            setActiveOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
          }
        }
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

    const handleAssignedOrder = (payload) => {
      const nextOrder = payload?.order || payload
      if (!nextOrder?.id) return

      setActiveOrders((prev) => {
        const exists = prev.some((order) => order.id === nextOrder.id)
        return exists
          ? prev.map((order) => (order.id === nextOrder.id ? { ...order, ...nextOrder } : order))
          : [nextOrder, ...prev]
      })
    }

    socket.on('delivery:approval-updated', handleReviewStatus)
    socket.on('delivery:review-status', handleReviewStatus)
    socket.on('delivery:order-assigned', handleAssignedOrder)
    socket.on('delivery:new-order', handleAssignedOrder)

    return () => {
      socket.off('connect', joinDeliveryRoom)
      socket.off('delivery:approval-updated', handleReviewStatus)
      socket.off('delivery:review-status', handleReviewStatus)
      socket.off('delivery:order-assigned', handleAssignedOrder)
      socket.off('delivery:new-order', handleAssignedOrder)
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
            activeOrders={activeOrders}
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

