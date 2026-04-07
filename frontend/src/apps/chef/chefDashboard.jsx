import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import ChefVerificationWorkspace from './components/ChefVerificationWorkspace'
import Popuplogin from './components/Popuplogin'
import { chefCookieCheck, getChefReviewStatus } from '../../../services/chefAuthService'
import ChefVerifiedWorkspace from './components/ChefVerifiedWorkspace'
import ChefRejectedWorkspace from './components/ChefRejectedWorkspace'
import ChefRegisterWorkspace from './components/ChefRegisterWorkspace'
import { getChefSocket } from '../../../services/socket'

const CHEF_REGISTER_POPUP_DISMISSED_KEY = 'chef-register-popup-dismissed'

const chefDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [isRegistered, setIsRegistered] = useState(Boolean(location.state?.chefRegistered))
  const [reviewStatus, setReviewStatus] = useState('pending')
  const [rejectionReason, setRejectionReason] = useState('')
  const [chefId, setChefId] = useState('')
  const lastRealtimeUpdateRef = useRef(0)

  useEffect(() => {
    let isMounted = true

    const syncChefState = async () => {
      const requestStartedAt = Date.now()
      const res = await chefCookieCheck()
      if (!isMounted) return

      const registered = Boolean(res?.chefUser?.isRegistered || location.state?.chefRegistered)
      setChefId(res?.chefUser?._id || res?.chefUser?.id || '')
      setIsRegistered(registered)

      if (registered) {
        sessionStorage.removeItem(CHEF_REGISTER_POPUP_DISMISSED_KEY)
        setShowPopup(false)
      } else if (
        location.state?.hideChefPopup ||
        sessionStorage.getItem(CHEF_REGISTER_POPUP_DISMISSED_KEY) === 'true'
      ) {
        setShowPopup(false)
      } else {
        setShowPopup(true)
      }

      if (!registered) {
        setReviewStatus('pending')
        setRejectionReason('')
        return
      }

      const reviewRes = await getChefReviewStatus()
      if (!isMounted) return
      if (lastRealtimeUpdateRef.current > requestStartedAt) return

      setReviewStatus(reviewRes?.reviewStatus || 'pending')
      setRejectionReason(reviewRes?.rejectionReason || '')
    }

    syncChefState()

    return () => {
      isMounted = false
    }
  }, [location.state])

  useEffect(() => {
    if (!chefId) return

    const socket = getChefSocket()
    const joinChefRoom = () => {
      socket.emit('join-chef-room', chefId)
    }

    socket.on('connect', joinChefRoom)
    socket.connect()
    if (socket.connected) {
      joinChefRoom()
    }

    const handleReviewStatus = (payload) => {
      lastRealtimeUpdateRef.current = Date.now()
      setReviewStatus(payload?.reviewStatus || 'pending')
      setRejectionReason(payload?.rejectionReason || '')
      setIsRegistered(true)
      setShowPopup(false)
    }

    socket.on('chef:approval-updated', handleReviewStatus)
    socket.on('chef:review-status', handleReviewStatus)

    return () => {
      socket.off('connect', joinChefRoom)
      socket.off('chef:approval-updated', handleReviewStatus)
      socket.off('chef:review-status', handleReviewStatus)
      socket.disconnect()
    }
  }, [chefId])

  const renderWorkspace = () => {
    if (!isRegistered) {
      return (
        <ChefRegisterWorkspace
          onRegisterClick={() => navigate('/chef/register')}
        />
      )
    }

    if (reviewStatus === 'approved') {
      return <ChefVerifiedWorkspace />
    }

    if (reviewStatus === 'rejected') {
      return (
        <ChefRejectedWorkspace
          rejectionReason={rejectionReason}
          onReregister={() => navigate('/chef/register')}
        />
      )
    }

    return <ChefVerificationWorkspace />
  }

  return (
    <div className="min-h-screen bg-[var(--theme-app-bg)]">
      <Navbar
        isRegistered={isRegistered}
        onRegisterClick={() => navigate('/chef/register')}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-6 pt-22 sm:px-6 lg:px-8">
        {renderWorkspace()}
      </main>

      <Popuplogin
        isOpen={showPopup && !isRegistered}
        onClose={() => {
          sessionStorage.setItem(CHEF_REGISTER_POPUP_DISMISSED_KEY, 'true')
          setShowPopup(false)
        }}
        onRegister={setIsRegistered}
      />
    </div>
  )
}

export default chefDashboard
