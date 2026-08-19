import os
import requests
from dotenv import load_dotenv, find_dotenv
from langchain_core.tools import tool

load_dotenv(find_dotenv())

# Supports local Docker instance (e.g., http://localhost:5000) or public OSRM server
OSRM_BASE_URL = os.getenv("OSRM_URL", "http://router.project-osrm.org").rstrip("/")


@tool
def calculate_travel_time(origin_lat: float,origin_lon: float,dest_lat: float,dest_lon: float,mode: str = "driving") -> str:
    """
    Calculates distance and estimated travel time between two GPS coordinates (latitude & longitude) using OSRM.
    Use this tool after finding places (via search_places) to check travel times between hotels, attractions, or neighborhoods.

    Args:
        origin_lat: Latitude of starting point (e.g., 48.8584).
        origin_lon: Longitude of starting point (e.g., 2.2945).
        dest_lat: Latitude of destination point (e.g., 48.8606).
        dest_lon: Longitude of destination point (e.g., 2.3376).
        mode: Travel mode, either 'driving' or 'walking' (default is 'driving').

    Returns:
        A formatted string with distance in km/miles and travel duration in minutes/hours, or an error message if routing fails.
    """
    # 1. Parameter Type & Range Validations
    try:
        o_lat = float(origin_lat)
        o_lon = float(origin_lon)
        d_lat = float(dest_lat)
        d_lon = float(dest_lon)
    except (ValueError, TypeError):
        return "Invalid coordinates provided. origin_lat, origin_lon, dest_lat, and dest_lon must all be numbers."

    if not (-90.0 <= o_lat <= 90.0 and -90.0 <= d_lat <= 90.0):
        return f"Invalid latitude values ({o_lat}, {d_lat}). Latitude must be between -90 and 90."

    if not (-180.0 <= o_lon <= 180.0 and -180.0 <= d_lon <= 180.0):
        return f"Invalid longitude values ({o_lon}, {d_lon}). Longitude must be between -180 and 180."

    if round(o_lat, 6) == round(d_lat, 6) and round(o_lon, 6) == round(d_lon, 6):
        return "Starting location and destination coordinates are identical (0 km / 0 minutes travel time)."

    clean_mode = str(mode).lower().strip() if mode else "driving"
    if clean_mode not in ["driving", "walking"]:
        clean_mode = "driving"

    # 2. OSRM API Request (OSRM expects {lon},{lat};{lon},{lat})
    try:
        url = f"{OSRM_BASE_URL}/route/v1/{clean_mode}/{o_lon},{o_lat};{d_lon},{d_lat}?overview=false"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            # If public server has an issue, try fallback
            return f"Routing service returned HTTP status {response.status_code}."

        data = response.json()
        if data.get("code") != "Ok" or not data.get("routes"):
            return f"No route could be found between ({o_lat:.4f}, {o_lon:.4f}) and ({d_lat:.4f}, {d_lon:.4f})."

        route = data["routes"][0]
        distance_meters = route.get("distance", 0.0)
        duration_seconds = route.get("duration", 0.0)

        distance_km = distance_meters / 1000.0
        distance_miles = distance_km * 0.621371

        duration_minutes = duration_seconds / 60.0

        if duration_minutes < 60:
            time_str = f"{duration_minutes:.0f} mins"
        else:
            hours = int(duration_minutes // 60)
            mins = int(duration_minutes % 60)
            time_str = f"{hours} hr {mins} mins"

        return (
            f"Mode: {clean_mode.title()} | "
            f"Distance: {distance_km:.1f} km ({distance_miles:.1f} miles) | "
            f"Estimated Travel Time: {time_str}"
        )

    except requests.exceptions.RequestException as e:
        return f"Network error connecting to OSRM routing service: {str(e)}"
    except Exception as e:
        return f"Error calculating travel time: {str(e)}"
