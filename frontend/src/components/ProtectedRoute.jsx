import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { userCookieCheck } from '../../services/userAuthService'
import LoadingSpinner from './LoadingSpinner'

const defaultIsAuthorized = (res) => Boolean(res?.user)

function ProtectedRoute({
  children,
  authCheck = userCookieCheck,
  isAuthorized = defaultIsAuthorized,
  redirectTo = '/login',
  loadingLabel = 'Loading...',
}) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const res = await authCheck()
      if (!isMounted) return
      setStatus(isAuthorized(res) ? 'authed' : 'unauth')
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [authCheck, isAuthorized])

  if (status === 'loading') {
    return <LoadingSpinner label={loadingLabel} />
  }

  if (status === 'unauth') {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute
