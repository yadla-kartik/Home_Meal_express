import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './apps/user/Dashboard'
import Login from './apps/user/Login'
import Otp from './apps/user/Otp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
