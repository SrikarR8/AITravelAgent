import React from 'react'
import { Navbar, type NavSection } from '../components'

export interface SettingsProps {
  onNavigate?: (section: NavSection) => void
  isLoggedIn?: boolean
}

export const Settings: React.FC<SettingsProps> = ({
  onNavigate,
  isLoggedIn = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Settings page with isLandingPage={false} and activeSection="Settings" */}
      <Navbar
        isLoggedIn={isLoggedIn}
        isLandingPage={false}
        activeSection="Settings"
        onSectionChange={onNavigate}
      />
      <main className="flex-1 w-full p-[2.5%]">
        {/* Empty page body for Settings as requested */}
      </main>
    </div>
  )
}

export default Settings
