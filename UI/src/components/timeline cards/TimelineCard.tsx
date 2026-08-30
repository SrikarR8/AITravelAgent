import React from 'react'
import { Star, MapPin, Sparkles } from 'lucide-react'
import defaultImg from '../../assets/images/destination_3.jpg'

export interface TimelineCardProps {
  id?: string
  image?: string
  title: string
  address: string
  category?: string
  price?: string
  rating?: number
  ratingCount?: number
  summary?: string
  isSelected?: boolean
  isExpanded?: boolean
  onClick?: () => void
  className?: string
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  id,
  image = defaultImg,
  title,
  address,
  category,
  price,
  rating,
  ratingCount,
  summary,
  isSelected = false,
  isExpanded = false,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    // Console log id and name of clicked hotel/place for backend/LLM tracking
    console.log('[TimelineCard Clicked]:', {
      id: id || title,
      name: title,
      address,
      type: price ? 'hotel' : 'place',
    })
    if (onClick) {
      onClick()
    }
  }

  // Fallback summary to fill space elegantly if none is provided
  const aiSummary =
    summary ||
    (price
      ? 'Curated by Nomad for exceptional tranquility, authentic local architecture, and effortless access to cultural landmarks.'
      : 'Handpicked by Nomad for its cultural significance, panoramic viewpoints, and immersive exploration value.')

  // If expanded to full width: Render Horizontal Split Card (30-35% Image on LHS, Details on RHS)
  if (isExpanded || isSelected) {
    return (
      <div
        onClick={handleClick}
        className={`w-full bg-white rounded-4 overflow-hidden shadow-sm border-0 ring-2 ring-[#00652c] shadow-[0_0_18px_rgba(0,101,44,0.25)] flex flex-col sm:flex-row items-stretch sm:h-[195px] cursor-pointer transition-all duration-400 hover:shadow-md ${className}`}
      >
        {/* LHS: Image taking up ~32-35% with absolute positioning to prevent portrait stretch */}
        <div className="w-full sm:w-[33%] relative overflow-hidden shrink-0 min-h-[180px] sm:min-h-0 sm:h-full">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* RHS: Name, Location, Review, and AI Generated Summary top to bottom */}
        <div className="w-full sm:w-[67%] p-4 sm:p-5 flex flex-col justify-between gap-2.5 bg-white overflow-hidden">
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* 1. Name / Title */}
            <h4
              className="m-0 font-bold text-slate-900 text-lg md:text-xl tracking-tight truncate"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              {title}
            </h4>

            {/* 2. Location / Address */}
            <div className="d-flex align-items-center gap-1.5 text-slate-500">
              <MapPin size={13} className="text-[#00652c] shrink-0" />
              <span
                className="text-xs text-slate-600"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {address}
              </span>
            </div>

            {/* 3. Review / Rating & Price (Hotels) or Category (Places) */}
            <div className="d-flex align-items-center gap-3 mt-0.5 flex-wrap">
              {rating !== undefined && (
                <div className="d-flex align-items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="fill-warning text-warning"
                      style={{ fill: '#f59e0b', color: '#f59e0b' }}
                    />
                  ))}
                  <span
                    className="ms-1 fw-bold text-dark text-xs"
                    style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                  >
                    {rating.toFixed(1)}
                  </span>
                  {ratingCount !== undefined && (
                    <span
                      className="text-muted text-xs"
                      style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                    >
                      ({ratingCount} reviews)
                    </span>
                  )}
                </div>
              )}

              {price && (
                <span
                  className="fw-bold text-[#00652c] text-xs bg-emerald-50 px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  {price}
                </span>
              )}

              {category && (
                <span
                  className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  {category}
                </span>
              )}
            </div>
          </div>

          {/* 4. AI-Generated Concierge Summary to fill space elegantly */}
          <div className="pt-2 border-t border-slate-100 mt-1 flex items-start gap-2">
            <Sparkles size={13} className="text-[#00652c] shrink-0 mt-0.5" />
            <p
              className="text-xs text-slate-600 leading-relaxed m-0 italic line-clamp-2"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              "{aiSummary}"
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default 3-Card Mode (Vertical compact layout)
  return (
    <div
      onClick={handleClick}
      className={`card border-0 rounded-4 overflow-hidden bg-white h-100 flex flex-col cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.008] ${className}`}
      style={{ width: '100%' }}
    >
      {/* Top Part: Image with Title and Address overlay */}
      <div className="position-relative w-100" style={{ height: '170px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={title}
          className="card-img-top w-100 h-100 transition-transform duration-500 hover:scale-105"
          style={{ objectFit: 'cover' }}
        />
        {/* Dark Gradient Overlay for high-contrast text readability */}
        <div
          className="position-absolute top-0 start-0 end-0 bottom-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Title and Address overlaid on top of image */}
        <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white">
          <h5
            className="card-title m-0 fw-bold text-white text-truncate"
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h5>
          <div className="d-flex align-items-center gap-1 mt-1 text-white-50">
            <MapPin size={12} className="text-white shrink-0" />
            <span
              className="text-white text-truncate"
              style={{
                fontSize: '11px',
                fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
                opacity: 0.9,
              }}
            >
              {address}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Part: Rating & Price for hotels, Category for places */}
      <div className="card-body p-3 bg-white d-flex flex-column gap-1">
        {rating !== undefined && (
          <div className="d-flex align-items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-warning text-warning"
                style={{ fill: '#f59e0b', color: '#f59e0b' }}
              />
            ))}
            <span
              className="ms-1 fw-bold text-dark"
              style={{ fontSize: '12px', fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {rating.toFixed(1)}
            </span>
            {ratingCount !== undefined && (
              <span
                className="text-muted"
                style={{ fontSize: '11px', fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                ({ratingCount} reviews)
              </span>
            )}
          </div>
        )}

        {price && (
          <div className="mt-0.5">
            <span
              className="fw-bold text-dark"
              style={{ fontSize: '13px', fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {price}
            </span>
          </div>
        )}

        {category && !rating && !price && (
          <span
            className="text-xs text-slate-600 font-medium text-truncate block"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            {category}
          </span>
        )}
      </div>
    </div>
  )
}

export const HotelCard = TimelineCard
export const PlaceCard = TimelineCard

export default TimelineCard
