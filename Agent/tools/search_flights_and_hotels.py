import requests
import os
from langchain_core.tools import tool
from dotenv import load_dotenv



load_dotenv()
headers = {
        "Content-Type": "application/json",
        "X-API-Key": os.getenv("LITE_API_KEY") 
    }

#@tool
def search_hotels(cityName: str, countryCode: str, checkinDate: str, checkoutDate:str) -> dict:
    """
    Use this tool to search hotels, their prices, ratings, etc.
    Args:
        cityName: The city in which hotels will be searched
        countryCode: The country of the city in iso 3166 alpha-2 format
        checkinDate: The check in date for the hotel in YYYY-MM-DD format
        checkoutDate: The check out date for the hotel in YYYY-MM-DD format
    Returns a dictionary where hotelID is the key and the value holds another dictionary which holds the hotel's properties
    """
    #TODO: Sort out occupanies, currently hardcoded to 4 adults, needs to be dynamic instead

    url = "https://api.liteapi.travel/v3.0/hotels/rates"

    payload = {
        "cityName": f"{cityName}",
        "countryCode": f"{countryCode}",
        "checkin": f"{checkinDate}",
        "checkout": f"{checkoutDate}",
        "currency": "USD",
        "guestNationality": "US",
        "occupancies": [
            {
                "adults": 4,
                "children": []
            }
        ]
    }
    hotelDataDict = {}
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    for hotel in data.get("hotels", []):
        id = hotel.get("id")
        hotelDataDict[id] = hotel

    for hotel in data.get("data", []):
        hotel_id = hotel.get("hotelId")
        rooms = hotel.get("roomTypes",[])
        lowestPrice = None

        for r in rooms:
            ssp = r.get("suggestedSellingPrice")
            if ssp:
                newPrice = r.get("suggestedSellingPrice").get("amount")
                if lowestPrice is None:
                    lowestPrice = newPrice
                else:
                    lowestPrice = min(lowestPrice,newPrice)

        if lowestPrice is not None:
            if hotel_id in hotelDataDict:
                hotelDataDict[hotel_id]["lowest_price"] = lowestPrice
            else:
                hotelDataDict[hotel_id] = {"lowest_price": lowestPrice}  
    return hotelDataDict




#@tool
def search_flights(startDate: str, endDate:str, airportNameDep: str = "", airportNameArr: str = "") -> dict:
    """
    Use this tool to search flights, their prices, and related metadata
    Args:
        startDate: The start date of the flight in YYYY-MM-DD format
        endDate: The end date of the flight in YYYY-MM-DD format
        airportNameDep: The IATA code for airport the user initially wants to depart from
        airportNameArr: The IATA code for the destination airport the user wants to go to
    Returns a dictionary where offerID is the key and the value holds another dictionary which holds the hotel's properties
    """
#def search_flights(airportName: str = "") -> dict:
    #TODO: Sort out occupanies, currently hardcoded to 4 adults, needs to be dynamic instead
    url = "https://api.liteapi.travel/v3.0/flights/rates"

    payload = {
    "legs": [
        {
            "origin": f"{airportNameDep}",
            "destination": f"{airportNameArr}",
            "date": f"{startDate}",
            "direction": "OUTBOUND"
        },
        {
            "origin": f"{airportNameArr}",
            "destination": f"{airportNameDep}",
            "date": f"{endDate}",
            "direction": "INBOUND"
        }
    ],
    "adults": 1,
    "children": 0,
    "infants": 0,
    "currency": "USD",
    "country": "US",
    "maxStops": -1,
    "sort": {
    "sortBy": "price",
    "sortOrder": "asc"
    }
}   
    #API response data
    response = requests.post(url, headers=headers, json=payload)
    data = response.json().get("data",[])

    #Create a dict for comprehensive flight info
    flightsResDict = {}
    for item in data:
        for journey in item.get("journeys",[]):

            segments = journey.get("segments", [])
            if segments:
                carrier_info = segments[0].get("carrier", {})
                airline_name = carrier_info.get("operatingName", "Unknown Airline")
            else:
                airline_name = "Unknown Airline"
            conn_info = [
                {
                    "airport" :  conn.get("arrivalAirportCode"),
                    "duration": conn.get("duration", {}).get("iso8601"),
                    "direction": conn.get("direction")
                }
                for conn in journey.get("connections",[])
            ]

            for offer in journey.get("offers",[]):
                offerID = offer.get("offerId")
                pricing = offer.get("pricing", {}).get("display", {})
                
                # Extract baggage policy
                baggage = offer.get("baggage", {})
                
                # Extract fare details
                fare = offer.get("fare", {})
                # Construct flattened entry for this specific offer
                flightsResDict[offerID] = {
                    "airline": airline_name,
                    "total_price": pricing.get("total"),
                    "currency": pricing.get("currency"),
                    "base_fare": pricing.get("base"),
                    "taxes": pricing.get("taxes"),
                    "fare_family": fare.get("family"),
                    "seats_remaining": fare.get("seatsRemaining"),
                    "has_carry_on": baggage.get("hasCarryOnBag", False),
                    "has_checked_bag": baggage.get("hasCheckedBag", False),
                    "connections": conn_info
                }

    if not flightsResDict:
        return "No matching flights found"

    #Logic for getting the 3 best flights
    #Only this info will be returned to LLM tool call to avoid bloating context
    #The full dict will only be retunred when absolutely needed
    sorted_offers = sorted(
        flightsResDict.items(),
        key=lambda item: float(item[1].get("total_price")) if item[1].get("total_price") is not None else float("inf")
    )
    cheapest = sorted_offers[:3]
    summary_lines = [f"Found {len(flightsResDict)} total flight offers. Top 3 cheapest options:"]
    
    for idx, (offer_id,details) in enumerate(cheapest, start=1):
        airline = details.get('airline')
        price = details.get('total_price')
        curr = details.get('currency', '')
        stops = len(details.get('connections', []))
        stop_desc = "Direct" if stops == 0 else f"{stops} stop(s)"
        carry_on = "Yes" if details.get('has_carry_on') else "No"
        checked = "Yes" if details.get('has_checked_bag') else "No"

        summary_lines.append(
            f"{idx}. Offer ID: {offer_id} | Airline: {airline} |Price: {price} {curr} | {stop_desc} | Carry-on: {carry_on} | Checked: {checked}"
        )

    llm_summary = "\n".join(summary_lines)
#LangGraph only passes [0] to state
    return llm_summary, flightsResDict


    



