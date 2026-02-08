import React, { useState } from 'react'
import Navbar from './Navbar'
import Popuplogin from './components/Popuplogin'

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <div>
        <Navbar
          isRegistered={isRegistered}
          onRegisterClick={() => setShowPopup(true)}
        />
        <Popuplogin
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          onRegister={setIsRegistered}
        />
    </div>
  )
}

export default Dashboard
