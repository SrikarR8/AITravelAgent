import React from 'react'
import { Navbar, type NavSection } from '../components'

export interface HomeProps {
  onNavigate?: (section: NavSection) => void
  isLoggedIn?: boolean
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  isLoggedIn = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcf0]">
      {/* Home page with isLandingPage={false} and activeSection="Home" */}
      <Navbar
        isLoggedIn={isLoggedIn}
        isLandingPage={false}
        activeSection="Home"
        onSectionChange={onNavigate}
      />
      <main className="flex-1 w-full p-[2.5%]">
        {/* Empty body for Home page */}
      </main>
    </div>
  )
}

export default Home
