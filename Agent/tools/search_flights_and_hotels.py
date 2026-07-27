import requests
import os
from langchain_core.tools import tool
from dotenv import load_dotenv



load_dotenv()

#@tool
def search_hotels(cityName, countryCode, checkinDate, checkoutDate):
    #TODO: Sort out occupanies, currently hardcoded to 4 adults, needs to be dynamic instead

    url = "https://api.liteapi.travel/v3.0/hotels/rates"

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": os.getenv("LITE_API_KEY") 
    }

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





@tool
def search_flights(destination: str, dates: str) -> str:
    """Use this tool to access flight information.
    Args:
        destination: The user's destination.
        dates: The user's check-in and check-out dates.
    """
    return f"Mock Result: Found 'United Airlines' for $400 and 'Delta Airlines' for $450 in {destination} for dates {dates}."
