#This file will be used to test out the tools, example values will be passed in.

#Imports - tools
from tools.search_flights_and_hotels import search_flights, search_hotels
from tools.search_places import search_places
from tools.get_weather import get_weather

#print(search_hotels("Turin", "IT", "2026-08-01","2026-08-11"))
#print(search_flights("2026-08-01","2026-08-11","HYD","DEL"))
print(get_weather("Paris","2027-08-01","2027-08-04"))