import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './apps/user/auth/Login'
import Otp from './apps/user/auth/Otp'
import UserDashboard from './apps/user/UserDashboard'
import ChefDashboard from './apps/chef/chefDashboard'
import ChefRegister from './apps/chef/auth/Register'
import AddMenu from './apps/chef/AddMenu'
import ProtectedRoute from './components/ProtectedRoute'
import ChefLogin from './apps/chef/auth/ChefLogin'
import LoadingSpinner from './components/LoadingSpinner'
import MainPage from './apps/MainPage'
import { chefCookieCheck } from '../services/chefAuthService'
import DeliveryLogin from './apps/delivery/auth/DeliveryLogin'
import DeliveryDashboard from './apps/delivery/deliveryDashboard'
import { deliveryCookieCheck } from '../services/deliveryAuthService'
import AdminLogin from './apps/admin/auth/AdminLogin'
import AdminDashboard from './apps/admin/AdminDashboard'

const isChefAuthorized = (res) => Boolean(res?.chefUser)
const isDeliveryAuthorized = (res) => Boolean(res?.deliveryBoy)

function App() {
  const [isBooting, setIsBooting] = React.useState(true)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBooting(false)
    }, 450)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  if (isBooting) {
    return <LoadingSpinner label="Loading..." />
  }

  return (
    <Routes>
      <Route 
        path='/' 
        element={
            <MainPage />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard/>
          </ProtectedRoute>
        }
      />

      <Route path="/chef" element={<Navigate to="/chef/login" replace />} />
      <Route path="/chef/login" element={<ChefLogin />} />
      <Route path="/chef/otp" element={<Otp />} />
      <Route path="/chef/dashboard" element={
        <ProtectedRoute
          authCheck={chefCookieCheck}
          isAuthorized={isChefAuthorized}
          redirectTo="/chef/login"
          loadingLabel="Loading ..."
        >
          <ChefDashboard />
        </ProtectedRoute>
      } />
      <Route
        path="/chef/register"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <ChefRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chef/menu"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <AddMenu />
          </ProtectedRoute>
        }
      />

      <Route path="/delivery" element={<Navigate to="/delivery/login" replace />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route
        path="/delivery/dashboard"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading ..."
          >
            <DeliveryDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
