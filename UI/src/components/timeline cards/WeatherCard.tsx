import React from 'react'
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiDayShowers,
  WiRain,
  WiDayThunderstorm,
} from 'react-icons/wi'
import { Calendar, Thermometer, Info } from 'lucide-react'

export type WeatherConditionType =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'sun-rain'
  | 'thunderstorm'
  | 'auto'

export interface WeatherCardProps {
  id?: string
  city?: string
  country?: string
  startDate?: string
  endDate?: string
  avgHighC?: number
  avgLowC?: number
  avgHighF?: number
  avgLowF?: number
  precipDailyMm?: number
  totalPrecipMm?: number
  peakUvIndex?: number
  windSpeedKmh?: number
  isHistorical?: boolean
  condition?: WeatherConditionType
  className?: string
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city = 'Paris',
  country = 'France',
  startDate = 'Oct 25, 2026',
  endDate = 'Nov 01, 2026',
  avgHighC = 16,
  avgLowC = 8,
  avgHighF = 61,
  avgLowF = 46,
  precipDailyMm = 1.8,
  totalPrecipMm = 12.6,
  peakUvIndex = 3.2,
  windSpeedKmh = 16.0,
  isHistorical = true,
  condition = 'auto',
  className = '',
}) => {
  // Dynamically determine the weather icon from explicit prop or calculated data combinations
  const renderWeatherIcon = () => {
    let activeCondition = condition

    if (activeCondition === 'auto') {
      if (precipDailyMm >= 3.0) {
        activeCondition = 'rainy'
      } else if (precipDailyMm > 0 && peakUvIndex >= 5.0) {
        activeCondition = 'sun-rain' // Combination: Sunny, cloudy, and rainy
      } else if (precipDailyMm > 0) {
        activeCondition = 'rainy'
      } else if (peakUvIndex >= 6.0) {
        activeCondition = 'sunny'
      } else if (peakUvIndex >= 3.0) {
        activeCondition = 'partly-cloudy' // Combination: Sun and clouds
      } else {
        activeCondition = 'cloudy'
      }
    }

    switch (activeCondition) {
      case 'sunny':
        return <WiDaySunny size={46} className="text-[#00652c]" />
      case 'partly-cloudy':
        return <WiDayCloudy size={46} className="text-[#00652c]" />
      case 'cloudy':
        return <WiCloudy size={46} className="text-[#00652c]" />
      case 'sun-rain':
        return <WiDayShowers size={46} className="text-[#00652c]" />
      case 'rainy':
        return <WiRain size={46} className="text-[#00652c]" />
      case 'thunderstorm':
        return <WiDayThunderstorm size={46} className="text-[#00652c]" />
      default:
        return <WiDaySunny size={46} className="text-[#00652c]" />
    }
  }

  return (
    <section
      className={`w-full bg-white rounded-4 shadow-xs p-[5%] border border-slate-200/70 relative overflow-hidden ${className}`}
      style={{ width: '100%' }}
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Row: City, Date, Weather Icon, and Hero Temperature */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-3">
          {/* Left: Date & City Title */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-2">
              <Calendar size={15} className="text-[#00652c]" />
              <span
                className="text-xs font-medium text-slate-600"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                {startDate} – {endDate}
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 m-0 tracking-tight"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              {city}, <span className="text-slate-500 font-normal">{country}</span>
            </h2>
          </div>

          {/* Right: Weather Icon & Temperature Readout */}
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white border border-slate-200/60 rounded-full flex items-center justify-center shadow-2xs">
              {renderWeatherIcon()}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  {avgHighC}°C
                </span>
                <span
                  className="text-base text-slate-400 font-medium"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  ({avgHighF}°F)
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                <Thermometer size={13} className="text-[#00652c]" />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
                >
                  Low: {avgLowC}°C ({avgLowF}°F)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Metric Grid with Clean Dividing Lines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70 pt-2">
          {/* Metric 1: Precipitation */}
          <div className="py-2.5 sm:py-1 px-3 sm:first:pl-0">
            <div className="mb-1.5">
              <span
                className="text-xs font-medium text-slate-500"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Precipitation
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
              >
                {precipDailyMm}
              </span>
              <span className="text-xs font-semibold text-slate-700">mm</span>
              <span className="text-[11px] text-slate-400">/day</span>
            </div>
            <p
              className="text-[11px] text-slate-500 m-0"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              Low rain probability
            </p>
          </div>

          {/* Metric 2: Wind Speed */}
          <div className="py-2.5 sm:py-1 px-3 sm:px-4">
            <div className="mb-1.5">
              <span
                className="text-xs font-medium text-slate-500"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Wind Speed
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
              >
                {windSpeedKmh}
              </span>
              <span className="text-xs font-semibold text-slate-700">km/h</span>
            </div>
            <p
              className="text-[11px] text-slate-500 m-0"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              Gentle breeze
            </p>
          </div>

          {/* Metric 3: UV Index */}
          <div className="py-2.5 sm:py-1 px-3 sm:px-4">
            <div className="mb-1.5">
              <span
                className="text-xs font-medium text-slate-500"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Peak UV Index
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
              >
                {peakUvIndex.toFixed(1)}
              </span>
            </div>
            <p
              className="text-[11px] text-amber-700 m-0 font-medium"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              Moderate sun exposure
            </p>
          </div>

          {/* Metric 4: Total Precip */}
          <div className="py-2.5 sm:py-1 px-3 sm:last:pr-0 sm:px-4">
            <div className="mb-1.5">
              <span
                className="text-xs font-medium text-slate-500"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Total Precip
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                className="text-xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
              >
                {totalPrecipMm}
              </span>
              <span className="text-xs font-semibold text-slate-700">mm</span>
            </div>
            <p
              className="text-[11px] text-[#00652c] m-0 font-medium"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              Ideal sightseeing weather
            </p>
          </div>
        </div>

        {/* Historical Climate Baseline Note */}
        {isHistorical && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Info size={13} className="text-slate-400 shrink-0" />
            <span style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}>
              10-year historical climate averages were used as the selected travel date is beyond the live forecast window.
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export default WeatherCard
