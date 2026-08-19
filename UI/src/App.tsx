import React, { useState } from 'react';
import './App.css';
import { Sparkles } from 'lucide-react';

export default function App(): React.JSX.Element {
  const [prompt, setPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('discover');

  // High-res royalty-free template photo of Amalfi Coast / Positano cliffside overlooking the Mediterranean sea
  const heroImageUrl: string = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2400&q=85";

  const handlePlanSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log('Initiating travel plan for:', prompt);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header / Navbar */}
      <header className="header-container">
        <a href="/" className="brand-title">
          Nomad's Dream
        </a>

        <nav className="nav-menu">
          <a 
            href="#discover" 
            className={`nav-item ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </a>
          <a 
            href="#itineraries" 
            className={`nav-item ${activeTab === 'itineraries' ? 'active' : ''}`}
            onClick={() => setActiveTab('itineraries')}
          >
            Itineraries
          </a>
          <a 
            href="#bookings" 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </a>
          <a 
            href="#community" 
            className={`nav-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            Community
          </a>
        </nav>

        <div className="header-actions">
          <button className="btn-login" type="button">
            Log In
          </button>
          <button className="btn-signup" type="button">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Hero Card Container */}
      <main className="hero-card">
        {/* Background Image */}
        <img 
          src={heroImageUrl} 
          alt="Amalfi Coast coastal scenery" 
          className="hero-bg-image" 
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="hero-overlay"></div>

        {/* Hero Card Content */}
        <div className="hero-content">
          <h1 className="hero-heading">
            Where will your heart take <span className="heading-highlight">you?</span>
          </h1>
          
          <p className="hero-subheading">
            Experience travel that feels like a conversation. Our AI-concierge learns your soul's preferences to craft journeys that transcend the ordinary.
          </p>

          {/* Floating Search & Prompt Pill Bar */}
          <form className="search-pill-wrapper" onSubmit={handlePlanSubmit}>
            <input 
              type="text" 
              className="search-input" 
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
              placeholder="A historical walking tour of Istanbul's spice markets..."
              aria-label="Trip planning search input"
            />
            <button type="submit" className="btn-plan">
              <Sparkles size={16} />
              <span>Plan with AI</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
