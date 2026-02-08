import React from 'react'
import Dashboard from './apps/user/Dashboard'
import Dashboardchef from './App/Chef/Dashboard'
import Login from './apps/user/Login'
import Popuplogin from './App/Chef/components/Popuplogin'
import Register from './App/Chef/Register'

function App() {
  return (
    <div>
        <Login/>
        <Dashboard/>
        <Register />
        <Dashboardchef />
        <Popuplogin />
    </div>
  )
}
export default App