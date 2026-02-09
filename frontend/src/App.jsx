import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './apps/user/Dashboard'
import Login from './apps/user/Login'
import Otp from './apps/user/Otp'
import ChefDashboard from './apps/chef/Dashboard'
import ChefRegister from './apps/chef/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route 
        path='/' 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/chef" element={<Navigate to="/chef/login" replace />} />
      <Route path="/chef/login" element={<Login />} />
      <Route path="/chef/otp" element={<Otp />} />
      <Route path="/chef/dashboard" element={<ChefDashboard />} />
      <Route path="/chef/register" element={<ChefRegister />} />
    </Routes>
  )
}

export default App
