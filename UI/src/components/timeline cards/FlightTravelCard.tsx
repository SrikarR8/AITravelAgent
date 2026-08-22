import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { ChevronRight, ChevronLeft, Luggage, Check, X } from 'lucide-react'

export interface FlightConnection {
  airport: string
  duration?: string
  lat?: number
  lon?: number
}

export interface FlightOption {
  id: string
  airline: string
  fromCode: string
  fromCity: string
  fromLat: number
  fromLon: number
  toCode: string
  toCity: string
  toLat: number
  toLon: number
  price: string
  hasCarryOn: boolean
  hasCheckedBag: boolean
  connections?: FlightConnection[]
}

export interface FlightTravelCardProps {
  flights?: FlightOption[]
  onSelectFlight?: (flight: FlightOption) => void
  className?: string
}

export const FlightTravelCard: React.FC<FlightTravelCardProps> = ({
  flights = [
    {
      id: 'flight-1',
      airline: 'British Airways',
      fromCode: 'LHR',
      fromCity: 'London',
      fromLat: 51.47,
      fromLon: -0.4543,
      toCode: 'CDG',
      toCity: 'Paris',
      toLat: 49.0097,
      toLon: 2.5479,
      price: '$145 USD',
      hasCarryOn: true,
      hasCheckedBag: true,
      connections: [],
    },
    {
      id: 'flight-2',
      airline: 'Air France',
      fromCode: 'LHR',
      fromCity: 'London',
      fromLat: 51.47,
      fromLon: -0.4543,
      toCode: 'CDG',
      toCity: 'Paris',
      toLat: 49.0097,
      toLon: 2.5479,
      price: '$162 USD',
      hasCarryOn: true,
      hasCheckedBag: false,
      connections: [],
    },
    {
      id: 'flight-3',
      airline: 'KLM Royal Dutch Airlines',
      fromCode: 'LHR',
      fromCity: 'London',
      fromLat: 51.47,
      fromLon: -0.4543,
      toCode: 'CDG',
      toCity: 'Paris',
      toLat: 49.0097,
      toLon: 2.5479,
      price: '$128 USD',
      hasCarryOn: true,
      hasCheckedBag: false,
      connections: [
        {
          airport: 'AMS',
          duration: '1h 20m layover',
          lat: 52.3105,
          lon: 4.7683,
        },
      ],
    },
  ],
  onSelectFlight,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentFlight = flights[currentIndex] || flights[0]
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Initialize and update the Leaflet map with Polyline and Markers
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      // Create Leaflet map instance with touch/scroll controls disabled for card stability
      const map = L.map(mapContainerRef.current, {
        attributionControl: false,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
      })

      // Minimalist warm-toned CartoDB Positron tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map)

      const layerGroup = L.layerGroup().addTo(map)
      mapInstanceRef.current = map
      layerGroupRef.current = layerGroup
    }

    const map = mapInstanceRef.current
    const layerGroup = layerGroupRef.current

    if (map && layerGroup) {
      layerGroup.clearLayers()

      const originPoint: [number, number] = [currentFlight.fromLat, currentFlight.fromLon]
      const destPoint: [number, number] = [currentFlight.toLat, currentFlight.toLon]
      const routePoints: [number, number][] = [originPoint]

      // Custom Origin Marker Icon
      const originIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:#00652c;color:white;font-weight:700;font-size:10px;padding:3px 7px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;border:1.5px solid white;">${currentFlight.fromCode}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      })
      L.marker(originPoint, { icon: originIcon }).addTo(layerGroup)

      // Add Layover Point & Marker if applicable
      if (currentFlight.connections && currentFlight.connections.length > 0) {
        const conn = currentFlight.connections[0]
        const layoverLat = conn.lat || 52.3105
        const layoverLon = conn.lon || 4.7683
        const layoverPoint: [number, number] = [layoverLat, layoverLon]
        routePoints.push(layoverPoint)

        const layoverIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="background:#d97706;color:white;font-weight:700;font-size:9px;padding:2px 6px;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.25);white-space:nowrap;border:1.5px solid white;">${conn.airport}</div>`,
          iconSize: [36, 18],
          iconAnchor: [18, 9],
        })
        L.marker(layoverPoint, { icon: layoverIcon }).addTo(layerGroup)
      }

      routePoints.push(destPoint)

      // Custom Destination Marker Icon
      const destIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:#00652c;color:white;font-weight:700;font-size:10px;padding:3px 7px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;border:1.5px solid white;">${currentFlight.toCode}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      })
      L.marker(destPoint, { icon: destIcon }).addTo(layerGroup)

      // Route Polyline with subtle glow
      const polyline = L.polyline(routePoints, {
        color: currentFlight.connections?.length ? '#d97706' : '#00652c',
        weight: 3.5,
        opacity: 0.9,
        dashArray: currentFlight.connections?.length ? '6, 6' : undefined,
      }).addTo(layerGroup)

      // Auto fit map view to the flight path bounds
      map.fitBounds(polyline.getBounds(), {
        padding: [38, 38],
        maxZoom: 7,
      })
    }
  }, [currentFlight])

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIdx = (currentIndex + 1) % flights.length
    setCurrentIndex(nextIdx)
    console.log('[Flight Option Switched]:', flights[nextIdx])
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIdx = (currentIndex - 1 + flights.length) % flights.length
    setCurrentIndex(prevIdx)
    console.log('[Flight Option Switched]:', flights[prevIdx])
  }

  const handleCardClick = () => {
    console.log('[FlightTravelCard Selected]:', {
      id: currentFlight.id,
      airline: currentFlight.airline,
      route: `${currentFlight.fromCode} -> ${currentFlight.toCode}`,
      price: currentFlight.price,
      stops: currentFlight.connections?.length || 0,
    })
    if (onSelectFlight) {
      onSelectFlight(currentFlight)
    }
  }

  const stopsCount = currentFlight.connections?.length || 0
  const isDirect = stopsCount === 0

  return (
    <div
      onClick={handleCardClick}
      className={`w-full bg-white rounded-4 overflow-hidden shadow-sm border-0 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-stretch hover:shadow-md ${className}`}
      style={{ width: '100%', minHeight: '235px' }}
    >
      {/* LHS (50%): Ticket Details */}
      <div className="w-full md:w-1/2 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 bg-white">
        {/* Top Header: Airline Name, Stop Type, Carousel Navigation */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4
              className="font-bold text-slate-900 text-base m-0 tracking-tight"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {currentFlight.airline}
            </h4>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">
              {isDirect ? (
                <span className="text-emerald-700 font-semibold">Nonstop Direct</span>
              ) : (
                <span className="text-amber-700 font-semibold">
                  {stopsCount} Layover ({currentFlight.connections?.map((c) => c.airport).join(', ')})
                </span>
              )}
            </span>
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border border-slate-200/60">
            <button
              type="button"
              onClick={handlePrev}
              className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer border-none bg-transparent"
              title="Previous flight option"
            >
              <ChevronLeft size={13} />
            </button>
            <span
              className="text-[11px] text-slate-500 font-semibold px-1"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {currentIndex + 1}/{flights.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer border-none bg-transparent"
              title="Next flight option"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Flight Trajectory Section */}
        <div className="flex items-center justify-between gap-3 my-4">
          <div className="flex flex-col items-start">
            <span
              className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {currentFlight.fromCode}
            </span>
            <span
              className="text-xs font-semibold text-slate-600 mt-0.5"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              {currentFlight.fromCity}
            </span>
          </div>

          {/* Route Arrow Indicator */}
          <div className="flex-1 flex flex-col items-center px-2">
            <div className="w-full flex items-center justify-center gap-1">
              <div className="flex-1 h-[1.5px] bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-[#00652c]" />
              <div className="flex-1 h-[1.5px] bg-slate-300" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">
              {!isDirect && currentFlight.connections && currentFlight.connections[0].duration
                ? currentFlight.connections[0].duration
                : 'Direct Flight'}
            </span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span
              className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {currentFlight.toCode}
            </span>
            <span
              className="text-xs font-semibold text-slate-600 mt-0.5"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              {currentFlight.toCity}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Baggage & Price */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Luggage size={12} className={currentFlight.hasCarryOn ? 'text-[#00652c]' : 'text-slate-400'} />
              <span className="text-[11px] text-slate-600">Carry-on</span>
              {currentFlight.hasCarryOn ? (
                <Check size={11} className="text-[#00652c]" />
              ) : (
                <X size={11} className="text-slate-400" />
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-600">Checked bag</span>
              {currentFlight.hasCheckedBag ? (
                <Check size={11} className="text-[#00652c]" />
              ) : (
                <X size={11} className="text-slate-400" />
              )}
            </div>
          </div>

          <span
            className="text-base font-bold text-[#00652c]"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            {currentFlight.price}
          </span>
        </div>
      </div>

      {/* RHS (50%): Interactive Leaflet Polyline Map */}
      <div className="w-full md:w-1/2 relative bg-slate-100 min-h-[220px] md:min-h-full overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full min-h-[220px]" />
      </div>
    </div>
  )
}

export default FlightTravelCard
