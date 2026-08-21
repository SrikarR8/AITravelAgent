import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect'
import { Navbar, Footer, type NavSection } from '../components'
import { backgroundPrompts } from '../data/backgroundPrompts'
import Auth from './Auth'
import '../App.css'

export interface LandingPageProps {
  onNavigate?: (section: NavSection) => void
  isLoggedIn?: boolean
  onAuthSuccess?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  isLoggedIn = false,
  onAuthSuccess,
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auth modal state derived from route path
  const isAuthOpen =
    location.pathname.toLowerCase().includes('login') ||
    location.pathname.toLowerCase().includes('signup')
  const initialIsLogin = !location.pathname.toLowerCase().includes('signup')

  return (
    <div className={`relative min-h-screen flex flex-col bg-[#f8f9ff] ${isAuthOpen ? 'overflow-hidden max-h-screen' : ''}`}>
      {/* Main Landing Content */}
      <div
        className={`w-full flex-1 flex flex-col transition-opacity duration-300 ${
          isAuthOpen ? 'opacity-80 pointer-events-none select-none' : ''
        }`}
      >
        {/* Navigation Bar for Landing Page */}
        <Navbar
          isLoggedIn={isLoggedIn}
          isLandingPage={true}
          activeSection="Home"
          onSectionChange={onNavigate}
          onBrandClick={() => onNavigate?.('Home')}
        />

        <main className="hero-wrapper flex-1">
          {/* Full-bleed Hero Banner with Dynamic Slideshow */}
          <section className="hero-banner">
            {backgroundPrompts.map((item, idx) => (
              <div
                key={item.index}
                className={`hero-background-layer ${idx === currentIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url('${isAuthOpen ? item.blurImageURL : item.imageURL}')`,
                }}
              />
            ))}

            <div className="hero-overlay" />

            <div className="hero-content">
              <h1 className="hero-title">
                Where will your heart take you?
              </h1>

              <p className="hero-subtitle">
                Experience travel that feels like a conversation. Our AI-concierge learns your soul's preferences to craft journeys that transcend the ordinary.
              </p>

              {/* Search / Plan with AI bar synchronized with Typewriter */}
              <div className="search-bar-container">
                <div className="relative flex-1 flex items-center min-w-0 h-full">
                  {!query && !isFocused && (
                    <div className="absolute inset-y-0 left-0 flex items-center text-sm md:text-base text-gray-500 font-sans pointer-events-none select-none overflow-hidden max-w-full">
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(backgroundPrompts[0].prompt)
                            .pauseFor(2500)
                            .deleteAll(15)
                            .callFunction(() => setCurrentIndex(1))
                            .typeString(backgroundPrompts[1].prompt)
                            .pauseFor(2500)
                            .deleteAll(15)
                            .callFunction(() => setCurrentIndex(2))
                            .typeString(backgroundPrompts[2].prompt)
                            .pauseFor(2500)
                            .deleteAll(15)
                            .callFunction(() => setCurrentIndex(3))
                            .typeString(backgroundPrompts[3].prompt)
                            .pauseFor(2500)
                            .deleteAll(15)
                            .callFunction(() => setCurrentIndex(4))
                            .typeString(backgroundPrompts[4].prompt)
                            .pauseFor(2500)
                            .deleteAll(15)
                            .callFunction(() => setCurrentIndex(0))
                            .start()
                        }}
                        options={{
                          autoStart: true,
                          loop: true,
                          delay: 30,
                          cursor: '|',
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="search-input w-full relative z-10"
                  />
                </div>
                <button
                  type="button"
                  className="cta-button"
                >
                  <span>✦</span>
                  <span>Plan with AI</span>
                </button>
              </div>
            </div>

            {/* 5 Bottom Navigation Dots */}
            <div className="hero-dots-container" aria-hidden="true">
              {backgroundPrompts.map((item, idx) => (
                <span
                  key={item.index}
                  className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </section>

          {/* Feature Section Underneath Slideshow */}
          <section className="w-full px-[2.5%] py-16 md:py-24 bg-white border-b border-slate-100">
            <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Column: AI Conversation Card */}
              <div className="bg-[#f8f9ff] border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00652c] text-white flex items-center justify-center font-bold text-sm">
                    ✦
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                      Your Nomad Guide
                    </h4>
                    <p className="text-[11px] text-slate-500 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                      Powered by Empathy AI
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-xs max-w-[85%]">
                    <p className="text-xs text-slate-700 m-0 italic" style={{ fontFamily: "var(--font-sans)" }}>
                      "I've noticed you enjoy quiet mornings and artisanal crafts. How about a sunrise tea ceremony in a private garden in Uji?"
                    </p>
                  </div>

                  <div className="bg-[#00652c] text-white p-3.5 rounded-2xl rounded-tr-sm shadow-xs max-w-[85%] ml-auto">
                    <p className="text-xs text-white m-0" style={{ fontFamily: "var(--font-sans)" }}>
                      "That sounds exactly like what I need. Can you add a local pottery workshop too?"
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-xs max-w-[85%]">
                    <p className="text-xs text-slate-700 m-0 italic" style={{ fontFamily: "var(--font-sans)" }}>
                      "Of course. I've found a 4th-generation master who hosts private sessions. Would you like to see available times?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Highlights */}
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-3"
                    style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
                  >
                    A concierge that listens to your silences.
                  </h2>
                  <p
                    className="text-xs md:text-sm text-slate-600 leading-relaxed m-0"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Standard travel sites give you lists. We give you stories. Our AI understands the nuances of your travel style—whether you seek the thrill of a hidden trail or the stillness of a coastal library.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#00652c] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        Psychographic Mapping
                      </h4>
                      <p className="text-[11px] text-slate-500 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        We analyze your preferences to find destinations that resonate emotionally.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#00652c] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        Living Itineraries
                      </h4>
                      <p className="text-[11px] text-slate-500 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        Your schedule adapts in real-time based on local events, weather, and your mood.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#00652c] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        Ethical Discovery
                      </h4>
                      <p className="text-[11px] text-slate-500 m-0" style={{ fontFamily: "var(--font-sans)" }}>
                        We prioritize sustainable partners and local artisans to keep travel meaningful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Static Footer on Landing Page */}
        <Footer />
      </div>

      {/* Auth Modal overlay that persists LandingPage in place without remounting */}
      {isAuthOpen && (
        <Auth
          isOpen={isAuthOpen}
          initialIsLogin={initialIsLogin}
          onAuthSuccess={onAuthSuccess}
          onClose={() => navigate('/')}
        />
      )}
    </div>
  )
}

export default LandingPage
