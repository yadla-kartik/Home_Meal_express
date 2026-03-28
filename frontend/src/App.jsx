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
      <Route path="/chef/dashboard" element={<ChefDashboard />} />
      <Route path="/chef/register" element={<ChefRegister />} />
      <Route path="/chef/menu" element={<AddMenu />} />
    </Routes>
  )
}

export default App
