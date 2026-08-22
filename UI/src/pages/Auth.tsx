import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Logo } from '../components'

export interface AuthProps {
  isOpen?: boolean
  initialIsLogin?: boolean
  onAuthSuccess?: () => void
  onClose?: () => void
}

export const Auth: React.FC<AuthProps> = ({
  isOpen = true,
  initialIsLogin = true,
  onAuthSuccess,
  onClose,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Boolean state variable logInPage as requested
  const [logInPage, setLogInPage] = useState<boolean>(initialIsLogin)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sync state with URL
  useEffect(() => {
    if (location.pathname.toLowerCase().includes('signup')) {
      setLogInPage(false)
    } else if (location.pathname.toLowerCase().includes('login')) {
      setLogInPage(true)
    }
  }, [location.pathname])

  // Disable background scrolling when Auth modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuthSuccess?.()
    navigate('/home')
  }

  const handleGoogleAuth = () => {
    onAuthSuccess?.()
    navigate('/home')
  }

  const toggleAuthMode = () => {
    const newMode = !logInPage
    setLogInPage(newMode)
    navigate(newMode ? '/login' : '/signup', { replace: true })
  }

  return (
    <>
      {/* 1. Dark Translucent Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* 2. Layered Modal Dialog Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 my-8 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close 'X' Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 !rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer border-none"
            style={{ borderRadius: '9999px' }}
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-2 cursor-pointer" onClick={handleClose}>
              <Logo className="w-11 h-11" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold text-[var(--color-on-surface)] mb-1"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              {logInPage ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p
              className="text-xs md:text-sm text-[var(--color-on-surface-variant)]"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {logInPage
                ? 'Enter your credentials to continue your journey'
                : 'Begin crafting journeys tailored for your soul'}
            </p>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 rounded-full text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] transition-all shadow-xs cursor-pointer mb-5"
            style={{
              fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
              borderRadius: "9999px"
            }}
          >
            {/* Google G Icon */}
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span
              className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider absolute"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name field (Sign Up only) */}
            {!logInPage && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-700 mb-1"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required={!logInPage}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Nomad"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00652c] focus:ring-1 focus:ring-[#00652c] transition-colors"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00652c] focus:ring-1 focus:ring-[#00652c] transition-colors"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 mb-1"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00652c] focus:ring-1 focus:ring-[#00652c] transition-colors"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              />
              {logInPage && (
                <div className="flex justify-end mt-1.5">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] text-[#00652c] hover:underline"
                    style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                  >
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 mt-2 bg-[#00652c] hover:bg-[#004f22] text-white font-medium text-sm rounded-full shadow-sm active:scale-[0.99] transition-all cursor-pointer border-none"
              style={{
                fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
                borderRadius: "9999px"
              }}
            >
              {logInPage ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Log In / Sign Up */}
          <div className="text-center mt-5">
            <p
              className="text-xs text-slate-600"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {logInPage ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-[#00652c] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer text-xs"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {logInPage ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth
