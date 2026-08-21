import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

export type NavSection = 'Home' | 'Trips' | 'Settings'

export interface NavbarProps {
  brandName?: string
  isLoggedIn?: boolean
  isLandingPage?: boolean
  activeSection?: NavSection
  onSectionChange?: (section: NavSection) => void
  onBrandClick?: () => void
  onLoginClick?: () => void
  onSignUpClick?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  isLandingPage = false,
  activeSection,
  onSectionChange,
  onBrandClick,
  onLoginClick,
  onSignUpClick,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active section from URL path if not explicitly provided
  const getCurrentSection = (): NavSection => {
    if (activeSection) return activeSection
    const path = location.pathname.toLowerCase()
    if (path.includes('trips')) return 'Trips'
    if (path.includes('settings')) return 'Settings'
    return 'Home'
  }

  const currentSection = getCurrentSection()
  const sections: { name: NavSection; path: string }[] = [
    { name: 'Home', path: '/home' },
    { name: 'Trips', path: '/trips' },
    { name: 'Settings', path: '/settings' },
  ]

  const handleSectionClick = (section: NavSection, path: string) => {
    navigate(path)
    onSectionChange?.(section)
  }

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onBrandClick) {
      onBrandClick()
    } else {
      navigate('/home')
    }
  }

  return (
    <header className="relative w-full bg-white border-b border-slate-100 shadow-xs z-50">
      <div className="w-full px-[2.5%] h-16 flex items-center justify-between">
        {/* Left: N Logo (Click takes user to /home) */}
        <div className="flex items-center">
          <a
            href="/home"
            onClick={handleBrandClick}
            className="flex items-center justify-center p-1 rounded-lg hover:opacity-85 transition-opacity cursor-pointer no-underline"
            title="Nomad's Dream - Home"
            aria-label="Nomad's Dream Home"
          >
            <Logo className="w-9 h-9" />
          </a>
        </div>

        {/* Middle: Navigation Sections (Shown only when NOT on landing page) */}
        {!isLandingPage && (
          <nav className="flex items-center gap-6 md:gap-8">
            {sections.map(({ name, path }) => {
              const isActive = currentSection === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSectionClick(name, path)}
                  className={`relative py-2 text-sm md:text-base font-medium transition-colors cursor-pointer bg-transparent border-none ${
                    isActive ? 'text-[#00652c] font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  {name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00652c] rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>
        )}

        {/* Right: Auth Buttons or Default User Avatar */}
        <div className="flex items-center gap-2.5">
          {!isLoggedIn ? (
            <>
              {/* Green Button: Log In */}
              <button
                type="button"
                onClick={onLoginClick || (() => navigate('/login'))}
                className="px-3.5 py-1 text-xs md:text-sm font-medium text-white bg-[#00652c] !rounded-full hover:bg-[#004f22] transition-colors cursor-pointer shadow-xs active:scale-95 border-none"
                style={{
                  fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
                  borderRadius: "9999px"
                }}
              >
                Log In
              </button>

              {/* White Button: Sign Up */}
              <button
                type="button"
                onClick={onSignUpClick || (() => navigate('/signup'))}
                className="px-3.5 py-1 text-xs md:text-sm font-medium text-[#00652c] bg-white border border-[#00652c]/30 !rounded-full hover:!bg-[#e2e8f0] hover:border-[#00652c]/60 transition-colors cursor-pointer shadow-xs active:scale-95"
                style={{
                  fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
                  borderRadius: "9999px"
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            /* Circle with Default User Image */
            <div
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
              title="User Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-slate-400"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
