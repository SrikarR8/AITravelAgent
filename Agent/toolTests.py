# This file tests external API and tool success and error handling behavior

from tools.search_flights_and_hotels import search_flights, search_hotels
from tools.search_places import search_places
from tools.get_weather import get_weather
from tools.search_reddit import search_reddit_travel_qa
from tools.convert_currency import convert_currency
from tools.calculate_travel_time import calculate_travel_time

print("=== 1. Testing Flight Search with Invalid IATA Code ===")
print(search_flights.invoke({
    "startDate": "2026-08-01",
    "endDate": "2026-08-10",
    "airportNameDep": "NewYork",
    "airportNameArr": "LON"
}))

print("\n=== 2. Testing Flight Search with Invalid Dates (Reversed) ===")
print(search_flights.invoke({
    "startDate": "2026-08-15",
    "endDate": "2026-08-01",
    "airportNameDep": "JFK",
    "airportNameArr": "LHR"
}))

print("\n=== 3. Testing Weather with Invalid Date Format ===")
print(get_weather.invoke({
    "city_name": "Paris",
    "start_date": "next week",
    "end_date": "2026-08-10"
}))

print("\n=== 4. Testing Weather with Non-Existent City ===")
print(get_weather.invoke({
    "city_name": "NonExistentCityXyZ999",
    "start_date": "2026-08-01",
    "end_date": "2026-08-10"
}))

print("\n=== 5. Testing Currency with Invalid Currency Code ===")
print(convert_currency.invoke({
    "amount": 100,
    "from_currency": "USD",
    "to_currency": "FAKECURR"
}))

print("\n=== 6. Testing Hotel with Invalid Country Code ===")
print(search_hotels.invoke({
    "cityName": "Rome",
    "countryCode": "ITALY",
    "checkinDate": "2026-08-01",
    "checkoutDate": "2026-08-05"
}))

print("\n=== 7. Testing Live OpenStreetMap Search Places ===")
print(search_places.invoke({
    "query": "museums",
    "location": "Paris",
    "limit": 3
}))

print("\n=== 8. Testing OSRM Route Calculation (Eiffel Tower -> Louvre) ===")
print(calculate_travel_time.invoke({
    "origin_lat": 48.8584,
    "origin_lon": 2.2945,
    "dest_lat": 48.8606,
    "dest_lon": 2.3376,
    "mode": "driving"
}))

print("\n=== 9. Testing OSRM Route Calculation (Walking Mode) ===")
print(calculate_travel_time.invoke({
    "origin_lat": 48.8584,
    "origin_lon": 2.2945,
    "dest_lat": 48.8606,
    "dest_lon": 2.3376,
    "mode": "walking"
}))

print("\n=== 10. Testing OSRM Route Calculation with Invalid Coordinates ===")
print(calculate_travel_time.invoke({
    "origin_lat": 999.0,
    "origin_lon": 2.2945,
    "dest_lat": 48.8606,
    "dest_lon": 2.3376
}))

print("\n=== 11. Testing Reddit Travel QA (Budget Cities in Europe) ===")
print(search_reddit_travel_qa.invoke({
    "query": "find budget cities in europe",
    "k": 2
}))

print("\n=== 12. Testing Hotel Search with numAdults ===")
print(search_hotels.invoke({
    "cityName": "Rome",
    "countryCode": "IT",
    "checkinDate": "2026-09-01",
    "checkoutDate": "2026-09-05",
    "numAdults": 2
}))