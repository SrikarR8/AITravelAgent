import React from 'react'
import { Navbar, type NavSection } from '../components'

export interface TripsProps {
  onNavigate?: (section: NavSection) => void
  isLoggedIn?: boolean
}

export const Trips: React.FC<TripsProps> = ({
  onNavigate,
  isLoggedIn = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Trips page with isLandingPage={false} and activeSection="Trips" */}
      <Navbar
        isLoggedIn={isLoggedIn}
        isLandingPage={false}
        activeSection="Trips"
        onSectionChange={onNavigate}
      />
      <main className="flex-1 w-full p-[2.5%]">
        {/* Empty page body for Trips */}
      </main>
    </div>
  )
}

export default Trips
