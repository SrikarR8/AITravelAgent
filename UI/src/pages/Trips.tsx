import React, { useState } from 'react'
import { MessageSquareDashed } from 'lucide-react'
import { Navbar, type NavSection } from '../components'
import { TimelineCard, FlightTravelCard } from '../components/timeline cards'
import dest0 from '../assets/images/destination_0.jpg'
import dest1 from '../assets/images/destination_1.jpg'
import dest2 from '../assets/images/destination_2.jpg'
import dest3 from '../assets/images/destination_3.jpg'
import dest4 from '../assets/images/destination_4.jpg'

export interface TripsProps {
  onNavigate?: (section: NavSection) => void
  isLoggedIn?: boolean
}

// Initial 3 static hotels (from search_hotels)
const staticHotels = [
  {
    id: '1',
    image: dest3,
    title: 'Sowaka Heritage Sanctuary',
    address: 'Gion District, Kyoto, Japan',
    price: '$340/night',
    rating: 5.0,
    ratingCount: 142,
    summary:
      'A serene restorative sanctuary blending traditional Japanese cedar architecture, lush private moss gardens, and exclusive morning matcha tea ceremonies.',
  },
  {
    id: '2',
    image: dest0,
    title: 'Monastero Santa Rosa Hotel',
    address: 'Conca dei Marini, Amalfi Coast, Italy',
    price: '$520/night',
    rating: 5.0,
    ratingCount: 198,
    summary:
      'A dramatic clifftop 17th-century monastery featuring terraced lemon groves, an infinity pool suspended over the sea, and bespoke Michelin-starred dining.',
  },
  {
    id: '3',
    image: dest1,
    title: "Ca' Maria Adele Canal Palace",
    address: 'Dorsoduro, Venice, Italy',
    price: '$410/night',
    rating: 5.0,
    ratingCount: 115,
    summary:
      'An intimate canal-front boutique palazzo overlooking the iconic Salute Basilica, known for romantic gondola water-gate arrivals and curated artisanal breakfasts.',
  },
]

// Initial 3 static places & attractions (from search_places)
const staticPlaces = [
  {
    id: 'p1',
    image: dest3,
    title: 'Kiyomizu-dera Temple',
    category: 'Historic Temple & Viewpoint',
    address: 'Higashiyama Ward, Kyoto, Japan',
    summary:
      'Famous 8th-century wooden stage offering sweeping sunset panoramas across Kyoto and cherry blossom canopies, built entirely without a single nail.',
  },
  {
    id: 'p2',
    image: dest2,
    title: 'Monsaraz Castle & Megaliths',
    category: 'Medieval Fortress',
    address: 'Alentejo Region, Portugal',
    summary:
      'Walled hilltop citadel surrounded by olive groves and ancient prehistoric stone circles with boundless views across the Alqueva dark-sky reserve.',
  },
  {
    id: 'p3',
    image: dest4,
    title: 'Brooklyn Bridge Promenade',
    category: 'Iconic Landmark',
    address: 'New York, NY, USA',
    summary:
      'Historic 19th-century suspension bridge featuring elevated timber pedestrian walkways with unmatched views of the Manhattan skyline.',
  },
]

export const Trips: React.FC<TripsProps> = ({
  onNavigate,
  isLoggedIn = true,
}) => {
  // Selection state for hotels and places
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)

  // Clicking a card selects it and expands it to full width while smoothly animating the others closed
  const handleHotelClick = (hotelId: string) => {
    setSelectedHotelId((prev) => (prev === hotelId ? null : hotelId))
  }

  const handlePlaceClick = (placeId: string) => {
    setSelectedPlaceId((prev) => (prev === placeId ? null : placeId))
  }

  return (
    <div className="h-screen flex flex-col bg-[#fdfcf0] overflow-hidden">
      {/* Navbar for Trips page */}
      <Navbar
        isLoggedIn={isLoggedIn}
        isLandingPage={false}
        activeSection="Trips"
        onSectionChange={onNavigate}
      />

      <main className="flex-1 w-full px-[2.5%] py-4 flex flex-col min-h-0">
        {/* 2-Column Split with Vertical Divider separating LHS and RHS */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-stretch flex-1 gap-6 lg:gap-0 min-h-0">
          {/* Left: Chat Window Placeholder spanning 2.5% -> 45% of viewport width */}
          <div
            className="w-full lg:w-[44.737%] h-full bg-white rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-xs"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <MessageSquareDashed className="w-8 h-8 text-slate-400" />
            </div>
            <h3
              className="text-lg font-bold text-slate-700 mb-1"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              Chat Window Placeholder
            </h3>
            <p
              className="text-xs text-slate-400 max-w-sm m-0"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            >
              The AI Concierge conversational stream and input window will be positioned here.
            </p>
          </div>

          {/* Center Vertical Separator Line between LHS and RHS */}
          <div className="hidden lg:block w-px self-stretch bg-slate-300/70 my-2" />

          {/* Right: Timeline Cards Column spanning 50% -> 97.5% of viewport width */}
          <div className="w-full lg:w-[50%] h-full flex flex-col gap-6 overflow-y-auto timeline-scrollbar pr-2 pb-8">
            {/* Timeline Item 0: Flight / Transit (London to Paris) */}
            <div className="flex flex-col gap-2.5">
              <div className="w-full">
                <h4
                  className="text-base md:text-lg font-bold text-slate-900 m-0"
                  style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
                >
                  Day 0: Travel & Departure
                </h4>
              </div>

              {/* 100% Full-Width FlightTravelCard with 3 flight options & layover support */}
              <div className="w-full">
                <FlightTravelCard />
              </div>
            </div>

            {/* Timeline Item 1: Day 0 - Hotels */}
            <div className="flex flex-col gap-2.5">
              <div className="w-full">
                <h4
                  className="text-base md:text-lg font-bold text-slate-900 m-0"
                  style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
                >
                  Day 0: Stays
                </h4>
              </div>

              {/* Animated Flex Accordion: Smooth horizontal expand & collapse */}
              <div className="flex w-full items-stretch overflow-hidden" style={{ gap: selectedHotelId ? '0px' : '16px' }}>
                {staticHotels.map((hotel) => {
                  const isSelected = selectedHotelId === hotel.id
                  const isCollapsed = selectedHotelId !== null && !isSelected

                  return (
                    <div
                      key={hotel.id}
                      className={`overflow-hidden transition-all duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isCollapsed
                          ? 'w-0 flex-[0_0_0px] max-h-[195px] opacity-0 pointer-events-none p-0 m-0'
                          : isSelected
                          ? 'w-full flex-1 max-h-[195px] opacity-100'
                          : 'w-full flex-1 max-h-[320px] opacity-100'
                      }`}
                    >
                      <TimelineCard
                        id={hotel.id}
                        image={hotel.image}
                        title={hotel.title}
                        address={hotel.address}
                        price={hotel.price}
                        rating={hotel.rating}
                        ratingCount={hotel.ratingCount}
                        summary={hotel.summary}
                        isSelected={isSelected}
                        isExpanded={isSelected}
                        onClick={() => handleHotelClick(hotel.id)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timeline Item 2: Day 1 - Landmarks */}
            <div className="flex flex-col gap-2.5">
              <div className="w-full">
                <h4
                  className="text-base md:text-lg font-bold text-slate-900 m-0"
                  style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
                >
                  Day 1: Places to Visit
                </h4>
              </div>

              {/* Animated Flex Accordion: Smooth horizontal expand & collapse */}
              <div className="flex w-full items-stretch overflow-hidden" style={{ gap: selectedPlaceId ? '0px' : '16px' }}>
                {staticPlaces.map((place) => {
                  const isSelected = selectedPlaceId === place.id
                  const isCollapsed = selectedPlaceId !== null && !isSelected

                  return (
                    <div
                      key={place.id}
                      className={`overflow-hidden transition-all duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isCollapsed
                          ? 'w-0 flex-[0_0_0px] max-h-[195px] opacity-0 pointer-events-none p-0 m-0'
                          : isSelected
                          ? 'w-full flex-1 max-h-[195px] opacity-100'
                          : 'w-full flex-1 max-h-[320px] opacity-100'
                      }`}
                    >
                      <TimelineCard
                        id={place.id}
                        image={place.image}
                        title={place.title}
                        category={place.category}
                        address={place.address}
                        summary={place.summary}
                        isSelected={isSelected}
                        isExpanded={isSelected}
                        onClick={() => handlePlaceClick(place.id)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Trips
