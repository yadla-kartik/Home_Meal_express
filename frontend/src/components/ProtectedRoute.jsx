import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { cookieCheck } from '../../services/loginService'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const res = await cookieCheck()
      if (!isMounted) return
      setStatus(res?.user ? 'authed' : 'unauth')
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return <LoadingSpinner label="Checking session" />
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
