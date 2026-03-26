import React from 'react'
import Navbar from './user/Navbar'
import ChefRegisterBanner from './user/components/ChefRegisterBanner'
import FeatureCard from './user/components/FeatureCard'
import HowItWorks from './user/components/HowItWorks'
import SiteFooter from './user/components/SiteFooter'
import StationAvailability from './user/components/StationAvailability'
import PnrComponent from '../components/PnrComponent'

function MainPage() {
  return (
    <div className="theme-app-shell min-h-screen overflow-hidden">
      <Navbar />

      <PnrComponent/>
     
      <section className="mx-auto flex w-full max-w-6xl flex-col px-2 sm:px-3">
        <FeatureCard />
        <HowItWorks />
        <StationAvailability />
        <ChefRegisterBanner />
        <SiteFooter />
      </section>
    </div>
  )
}

export default MainPage
