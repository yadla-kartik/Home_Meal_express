import React from 'react'
import PnrComponent from '../../components/PnrComponent'
import TrainStatusComponent from '../../components/TrainStatusComponent'
import Navbar from './Navbar'

function UserDashboard() {
  return (
    <>
    <div className="theme-app-shell min-h-screen overflow-hidden">
        <Navbar/>
        <PnrComponent/>
        <TrainStatusComponent />
    </div>
    </>
  )
}

export default UserDashboard
