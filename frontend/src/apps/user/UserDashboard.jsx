import React from 'react'
import DashboardOrders from '../../components/DashboardOrders'
import PnrComponent from '../../components/PnrComponent'
import Navbar from './Navbar'

function UserDashboard() {
  return (
    <>
    <div className="theme-app-shell min-h-screen overflow-hidden">
        <Navbar/>
        <PnrComponent/>
        <DashboardOrders/>
    </div>
    </>
  )
}

export default UserDashboard
