import os
import re
from datetime import datetime
import requests
from dotenv import load_dotenv, find_dotenv
from langchain_core.tools import tool

load_dotenv(find_dotenv())

headers = {
    "Content-Type": "application/json",
    "X-API-Key": os.getenv("LITE_API_KEY", "")
}


def _validate_date(date_str: str, field_name: str) -> str | None:
    """Validates YYYY-MM-DD date format. Returns error string if invalid, None if valid."""
    if not date_str or not date_str.strip():
        return f"{field_name} was not provided."
    try:
        datetime.strptime(date_str.strip(), "%Y-%m-%d")
        return None
    except ValueError:
        return f"Invalid {field_name} '{date_str}'. Expected format is YYYY-MM-DD (e.g., '2026-08-01')."


def _validate_iata(iata_code: str, field_name: str) -> str | None:
    """Validates 3-letter IATA airport code. Returns error string if invalid, None if valid."""
    if not iata_code or not iata_code.strip():
        return f"{field_name} was not provided."
    code = iata_code.strip().upper()
    if len(code) != 3 or not code.isalpha():
        return (
            f"'{iata_code}' is an invalid IATA airport code for {field_name}. "
            f"Please provide a standard 3-letter IATA code (e.g., 'JFK' for New York, 'LHR' for London, 'HND' or 'NRT' for Tokyo)."
        )
    return None


@tool
def search_hotels(cityName: str, countryCode: str, checkinDate: str, checkoutDate: str) -> str:
    """
    Use this tool to search hotels, room rates, lowest prices, and availability in a destination city.

    Args:
        cityName: The city name where hotels will be searched (e.g., 'Rome', 'Tokyo', 'Paris').
        countryCode: 2-letter ISO country code (e.g., 'IT', 'JP', 'FR', 'US').
        checkinDate: Check-in date in YYYY-MM-DD format.
        checkoutDate: Check-out date in YYYY-MM-DD format.

    Returns:
        A formatted string summarizing available hotels and prices, or a descriptive error message if inputs are invalid.
    """
    # 1. Input validations
    if not cityName or not cityName.strip():
        return "City name was not provided. Please specify a destination city to search hotels."

    if not countryCode or not countryCode.strip():
        return "Country code was not provided. Please provide a 2-letter ISO country code (e.g., 'US', 'FR', 'IT', 'JP')."
    
    country_code_clean = countryCode.strip().upper()
    if len(country_code_clean) != 2 or not country_code_clean.isalpha():
        return f"'{countryCode}' is not a valid 2-letter ISO country code (e.g., 'IT' for Italy, 'JP' for Japan, 'FR' for France)."

    date_err = _validate_date(checkinDate, "Check-in date")
    if date_err:
        return date_err

    date_err = _validate_date(checkoutDate, "Check-out date")
    if date_err:
        return date_err

    d_in = datetime.strptime(checkinDate.strip(), "%Y-%m-%d")
    d_out = datetime.strptime(checkoutDate.strip(), "%Y-%m-%d")
    if d_in >= d_out:
        return f"Check-in date ({checkinDate}) must be before check-out date ({checkoutDate})."

    # 2. API Call
    url = "https://api.liteapi.travel/v3.0/hotels/rates"
    payload = {
        "cityName": cityName.strip(),
        "countryCode": country_code_clean,
        "checkin": checkinDate.strip(),
        "checkout": checkoutDate.strip(),
        "currency": "USD",
        "guestNationality": "US",
        "occupancies": [
            {
                "adults": 2,
                "children": []
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        
        if response.status_code != 200:
            return f"Hotel search API returned error status {response.status_code}: {response.text}"

        data = response.json()
        hotel_data_dict = {}

        for hotel in data.get("hotels", []):
            h_id = hotel.get("id")
            if h_id:
                hotel_data_dict[h_id] = {
                    "name": hotel.get("name", "Unknown Hotel"),
                    "rating": hotel.get("rating", "N/A"),
                    "address": hotel.get("address", "N/A")
                }

        for hotel in data.get("data", []):
            hotel_id = hotel.get("hotelId")
            rooms = hotel.get("roomTypes", [])
            lowest_price = None

            for r in rooms:
                ssp = r.get("suggestedSellingPrice")
                if ssp:
                    price_val = ssp.get("amount")
                    if price_val is not None:
                        lowest_price = price_val if lowest_price is None else min(lowest_price, price_val)

            if hotel_id in hotel_data_dict:
                hotel_data_dict[hotel_id]["lowest_price"] = lowest_price

        if not hotel_data_dict:
            return f"No hotel availability found for '{cityName}', {country_code_clean} from {checkinDate} to {checkoutDate}."

        summary_lines = [f"Found {len(hotel_data_dict)} hotel options in {cityName.strip()}:"]
        for idx, (h_id, info) in enumerate(list(hotel_data_dict.items())[:5], start=1):
            name = info.get("name", "Hotel")
            price = f"${info.get('lowest_price')}" if info.get('lowest_price') else "Price unavailable"
            rating = f"Rating: {info.get('rating')}" if info.get('rating') else ""
            summary_lines.append(f"{idx}. {name} | {price} | {rating}")

        return "\n".join(summary_lines)

    except requests.exceptions.RequestException as e:
        return f"Network error connecting to hotel search API: {str(e)}"
    except Exception as e:
        return f"Unexpected error during hotel search: {str(e)}"


@tool
def search_flights(startDate: str, endDate: str, airportNameDep: str = "", airportNameArr: str = "") -> str:
    """
    Use this tool to search round-trip flights, pricing, airlines, luggage allowance, and connections.

    Args:
        startDate: Departure date in YYYY-MM-DD format (e.g., '2026-08-01').
        endDate: Return date in YYYY-MM-DD format (e.g., '2026-08-10').
        airportNameDep: 3-letter IATA code for departure airport (e.g., 'JFK', 'LAX', 'ORD', 'LHR').
        airportNameArr: 3-letter IATA code for arrival destination airport (e.g., 'HND', 'CDG', 'FCO', 'DXB').

    Returns:
        A summary of the cheapest flights and flight details, or a descriptive error message if inputs are invalid.
    """
    # 1. Validations
    dep_err = _validate_iata(airportNameDep, "Departure Airport (airportNameDep)")
    if dep_err:
        return dep_err

    arr_err = _validate_iata(airportNameArr, "Arrival Airport (airportNameArr)")
    if arr_err:
        return arr_err

    start_clean = startDate.strip() if startDate else ""
    end_clean = endDate.strip() if endDate else ""

    date_err = _validate_date(start_clean, "Departure date (startDate)")
    if date_err:
        return date_err

    date_err = _validate_date(end_clean, "Return date (endDate)")
    if date_err:
        return date_err

    d_start = datetime.strptime(start_clean, "%Y-%m-%d")
    d_end = datetime.strptime(end_clean, "%Y-%m-%d")
    if d_start > d_end:
        return f"Departure date ({start_clean}) cannot be after return date ({end_clean})."

    dep_code = airportNameDep.strip().upper()
    arr_code = airportNameArr.strip().upper()

    if dep_code == arr_code:
        return f"Departure airport '{dep_code}' and arrival airport '{arr_code}' cannot be the same."

    # 2. API Call
    url = "https://api.liteapi.travel/v3.0/flights/rates"
    payload = {
        "legs": [
            {
                "origin": dep_code,
                "destination": arr_code,
                "date": start_clean,
                "direction": "OUTBOUND"
            },
            {
                "origin": arr_code,
                "destination": dep_code,
                "date": end_clean,
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

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        
        if response.status_code != 200:
            return f"Flight search API returned error status {response.status_code}: {response.text}"

        data = response.json().get("data", [])
        flights_res_dict = {}

        for item in data:
            for journey in item.get("journeys", []):
                segments = journey.get("segments", [])
                airline_name = segments[0].get("carrier", {}).get("operatingName", "Unknown Airline") if segments else "Unknown Airline"
                
                conn_info = [
                    {
                        "airport": conn.get("arrivalAirportCode"),
                        "duration": conn.get("duration", {}).get("iso8601"),
                        "direction": conn.get("direction")
                    }
                    for conn in journey.get("connections", [])
                ]

                for offer in journey.get("offers", []):
                    offer_id = offer.get("offerId")
                    pricing = offer.get("pricing", {}).get("display", {})
                    baggage = offer.get("baggage", {})
                    fare = offer.get("fare", {})

                    flights_res_dict[offer_id] = {
                        "airline": airline_name,
                        "total_price": pricing.get("total"),
                        "currency": pricing.get("currency", "USD"),
                        "base_fare": pricing.get("base"),
                        "taxes": pricing.get("taxes"),
                        "fare_family": fare.get("family"),
                        "seats_remaining": fare.get("seatsRemaining"),
                        "has_carry_on": baggage.get("hasCarryOnBag", False),
                        "has_checked_bag": baggage.get("hasCheckedBag", False),
                        "connections": conn_info
                    }

        if not flights_res_dict:
            return f"No matching flights found from {dep_code} to {arr_code} for dates {start_clean} to {end_clean}."

        sorted_offers = sorted(
            flights_res_dict.items(),
            key=lambda item: float(item[1].get("total_price")) if item[1].get("total_price") is not None else float("inf")
        )
        cheapest = sorted_offers[:3]
        summary_lines = [f"Found {len(flights_res_dict)} flight offers from {dep_code} to {arr_code}. Top 3 options:"]

        for idx, (offer_id, details) in enumerate(cheapest, start=1):
            airline = details.get('airline', 'Airline')
            price = details.get('total_price')
            curr = details.get('currency', 'USD')
            stops = len(details.get('connections', []))
            stop_desc = "Nonstop" if stops == 0 else f"{stops} stop(s)"
            carry_on = "Included" if details.get('has_carry_on') else "Not included"
            checked = "Included" if details.get('has_checked_bag') else "Not included"

            summary_lines.append(
                f"{idx}. Airline: {airline} | Price: ${price} {curr} | {stop_desc} | Carry-on: {carry_on} | Checked: {checked}"
            )

        return "\n".join(summary_lines)

    except requests.exceptions.RequestException as e:
        return f"Network error connecting to flight search API: {str(e)}"
    except Exception as e:
        return f"Unexpected error during flight search: {str(e)}"
