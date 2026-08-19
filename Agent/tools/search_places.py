import time
import requests
from langchain_core.tools import tool

HEADERS = {
    "User-Agent": "TravelAgentBot/1.0 (travelagent-project@local.dev)"
}


@tool
def search_places(query: str, location: str, limit: int = 5) -> str:
    """
    Searches for real points of interest, tourist attractions, museums, restaurants, landmarks, or parks.
    Returns real place names, addresses, and latitude/longitude coordinates.

    Args:
        query: What type of place or specific spot to search for (e.g., 'museums', 'Eiffel Tower', 'sushi restaurants', 'parks').
        location: City, region, or neighborhood to search within (e.g., 'Paris', 'Tokyo', 'Rome, Italy').
        limit: Maximum number of places to return (default is 5).

    Returns:
        A formatted list of matching places with names, types, addresses, and GPS coordinates (lat/lon).
    """
    if not query or not str(query).strip():
        return "Search query was not provided. Please specify what you are looking for (e.g., 'museums', 'attractions', 'restaurants')."

    if not location or not str(location).strip():
        return "Location was not provided. Please specify a city or area to search within."

    q_clean = query.strip()
    loc_clean = location.strip()
    full_search = f"{q_clean} in {loc_clean}"

    places = []

    # 1. Primary: Nominatim OpenStreetMap 
    try:
        time.sleep(1.1)
        url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(full_search)}&format=json&limit={limit}&addressdetails=1"
        response = requests.get(url, headers=HEADERS, timeout=8)
        
        if response.status_code == 200:
            data = response.json()
            for item in data:
                name = item.get("name") or item.get("display_name", "").split(",")[0]
                lat = item.get("lat")
                lon = item.get("lon")
                category = item.get("type") or item.get("class") or "attraction"
                address = item.get("display_name", "")

                places.append({
                    "name": name,
                    "type": category.replace("_", " ").title(),
                    "address": address,
                    "lat": float(lat) if lat else None,
                    "lon": float(lon) if lon else None
                })
    except Exception:
        pass

    # Fallback: Photon OpenStreetMap Search if Nominatim yielded no results
    if not places:
        try:
            time.sleep(1.1)
            photon_url = f"https://photon.komoot.io/api/?q={requests.utils.quote(f'{q_clean} {loc_clean}')}&limit={limit}"
            p_res = requests.get(photon_url, headers=HEADERS, timeout=8)
            if p_res.status_code == 200:
                p_data = p_res.json()
                for feature in p_data.get("features", []):
                    props = feature.get("properties", {})
                    name = props.get("name")
                    if not name:
                        continue
                    coords = feature.get("geometry", {}).get("coordinates", [])
                    lon_val = coords[0] if len(coords) >= 2 else None
                    lat_val = coords[1] if len(coords) >= 2 else None
                    
                    addr_parts = [props.get(k) for k in ["street", "city", "state", "country"] if props.get(k)]
                    addr_str = ", ".join(addr_parts) if addr_parts else loc_clean
                    cat = props.get("osm_value") or props.get("osm_key") or "attraction"

                    places.append({
                        "name": name,
                        "type": cat.replace("_", " ").title(),
                        "address": addr_str,
                        "lat": lat_val,
                        "lon": lon_val
                    })
        except Exception:
            pass

    if not places:
        return f"No points of interest found for '{q_clean}' in '{loc_clean}'. Try broadening your search or checking spelling."

    # Format result for the LLM agent
    formatted_lines = [f"Found {len(places)} places for '{q_clean}' in {loc_clean}:"]
    for idx, p in enumerate(places, 1):
        name = p['name']
        p_type = p['type']
        lat = f"{p['lat']:.4f}" if p['lat'] is not None else "N/A"
        lon = f"{p['lon']:.4f}" if p['lon'] is not None else "N/A"
        addr = p['address']
        formatted_lines.append(
            f"{idx}. {name} [{p_type}]\n   Coordinates: (Lat: {lat}, Lon: {lon})\n   Address: {addr}"
        )

    return "\n\n".join(formatted_lines)
