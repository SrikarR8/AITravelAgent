import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapPin, ExternalLink } from 'lucide-react'

export interface RouteWaypoint {
  name: string
  lat?: number
  lon?: number
}

export interface WalkTransitCardProps {
  originName?: string
  originAddress?: string
  originLat?: number
  originLon?: number
  destName?: string
  destAddress?: string
  destLat?: number
  destLon?: number
  mode?: 'walking' | 'driving'
  distanceKm?: number
  distanceMiles?: number
  durationMinutes?: number
  waypoints?: RouteWaypoint[]
  className?: string
}

export const WalkTransitCard: React.FC<WalkTransitCardProps> = ({
  originName = 'Sowaka Heritage Sanctuary',
  originAddress = 'Gion District, Kyoto',
  originLat = 34.9998,
  originLon = 135.7788,
  destName = 'Kiyomizu-dera Temple',
  destAddress = 'Higashiyama Ward, Kyoto',
  destLat = 34.9949,
  destLon = 135.785,
  mode = 'walking',
  distanceKm = 1.4,
  distanceMiles = 0.9,
  durationMinutes = 18,
  waypoints = [],
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Google Maps directions URL for easy navigation
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${destLat},${destLon}&travelmode=${mode}`

  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        attributionControl: false,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
      })

      // Standard OpenStreetMap tiles (free, reliable, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map)

      const layerGroup = L.layerGroup().addTo(map)
      mapInstanceRef.current = map
      layerGroupRef.current = layerGroup
    }

    const map = mapInstanceRef.current
    const layerGroup = layerGroupRef.current

    if (map && layerGroup) {
      layerGroup.clearLayers()

      const originPoint: [number, number] = [originLat, originLon]
      const destPoint: [number, number] = [destLat, destLon]
      const routePoints: [number, number][] = [originPoint]

      // Origin Marker Icon (Sage Green)
      const originIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: #00652c;
            color: white;
            font-weight: 700;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            border: 1.5px solid white;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>A</span>
          </div>
        `,
        iconSize: [28, 22],
        iconAnchor: [14, 11],
      })
      L.marker(originPoint, { icon: originIcon }).addTo(layerGroup)

      // Waypoints if provided
      if (waypoints && waypoints.length > 0) {
        waypoints.forEach((wp) => {
          if (wp.lat && wp.lon) {
            const wpPoint: [number, number] = [wp.lat, wp.lon]
            routePoints.push(wpPoint)

            const wpIcon = L.divIcon({
              className: 'custom-map-pin',
              html: `
                <div style="
                  background: #d97706;
                  color: white;
                  font-weight: 700;
                  font-size: 9px;
                  padding: 2px 6px;
                  border-radius: 10px;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                  white-space: nowrap;
                  border: 1.5px solid white;
                ">
                  ${wp.name}
                </div>
              `,
              iconSize: [36, 18],
              iconAnchor: [18, 9],
            })
            L.marker(wpPoint, { icon: wpIcon }).addTo(layerGroup)
          }
        })
      }

      // Destination Marker Icon (Terracotta Accent)
      const destIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: #c2410c;
            color: white;
            font-weight: 700;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            border: 1.5px solid white;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>B</span>
          </div>
        `,
        iconSize: [28, 22],
        iconAnchor: [14, 11],
      })
      L.marker(destPoint, { icon: destIcon }).addTo(layerGroup)

      routePoints.push(destPoint)

      // Polyline route connecting origin and destination
      const polyline = L.polyline(routePoints, {
        color: mode === 'walking' ? '#00652c' : '#c2410c',
        weight: 3.5,
        opacity: 0.85,
        dashArray: mode === 'walking' ? '5, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup)

      // Fit map view to encompass both points with padding
      const bounds = L.latLngBounds(routePoints)
      map.fitBounds(bounds, {
        padding: [36, 36],
        maxZoom: 16,
      })
    }

    return () => {
      // Map instance is kept for subsequent prop updates
    }
  }, [originLat, originLon, destLat, destLon, mode, waypoints])

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-md ${className}`}
    >
      {/* Left Column: Route Details & Metrics */}
      <div className="w-full md:w-[54%] p-5 md:p-6 flex flex-col justify-between">
        {/* Primary ETA & Distance Stat */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              {durationMinutes} mins
            </span>
            <span
              className="text-sm font-semibold text-slate-500"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              ({distanceKm.toFixed(1)} km / {distanceMiles.toFixed(1)} mi)
            </span>
          </div>
        </div>

        {/* Origin -> Destination Visual Timeline */}
        <div className="relative pl-6 py-1 space-y-3">
          {/* Vertical dashed timeline connector */}
          <div className="absolute left-[9px] top-2.5 bottom-2.5 w-0.5 border-l-2 border-dashed border-slate-200" />

          {/* Origin Point */}
          <div className="relative flex items-start gap-2.5">
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
            </div>
            <div className="min-w-0">
              <h5
                className="text-sm font-bold text-slate-800 truncate m-0"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {originName}
              </h5>
              <p
                className="text-xs text-slate-400 truncate m-0"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {originAddress}
              </p>
            </div>
          </div>

          {/* Destination Point */}
          <div className="relative flex items-start gap-2.5">
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-orange-100 border-2 border-[#c2410c] flex items-center justify-center">
              <MapPin className="w-2.5 h-2.5 text-[#c2410c]" />
            </div>
            <div className="min-w-0">
              <h5
                className="text-sm font-bold text-slate-800 truncate m-0"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {destName}
              </h5>
              <p
                className="text-xs text-slate-400 truncate m-0"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {destAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Leaflet Mini Route Map */}
      <div className="w-full md:w-[46%] min-h-[175px] md:min-h-full relative bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200/80">
        <div ref={mapContainerRef} className="w-full h-full min-h-[175px] z-0" />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs border border-slate-200/80 inline-flex items-center gap-1.5 transition-all duration-200 z-10 group"
          style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
        >
          <span>Open in Maps</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-colors" />
        </a>
      </div>
    </div>
  )
}

export default WalkTransitCard
