import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage, Home, Trips, Settings } from './pages'

interface ProtectedRouteProps {
  isLoggedIn: boolean
  children: React.ReactNode
}

// Protected route guard: redirects unauthenticated users to /login (landing page with login popup)
function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const handleAuthSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page & Auth modal routes all preserve LandingPage without resetting */}
        <Route
          path="/"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />

        {/* Protected in-app routes: /home, /trips, /settings */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Trips isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Settings isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
