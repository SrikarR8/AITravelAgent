import requests
from datetime import datetime, timedelta
from langchain_core.tools import tool


@tool
def get_weather(city_name: str, start_date: str, end_date: str) -> str:
    """
    Gets 14-day live weather forecast or 10-year historical climate averages for a destination city.

    Args:
        city_name: The destination city (e.g., 'Paris', 'Tokyo', 'Rome').
        start_date: Start date of the trip in YYYY-MM-DD format (e.g., '2026-08-01').
        end_date: End date of the trip in YYYY-MM-DD format (e.g., '2026-08-10').

    Returns:
        A formatted weather summary string (temperature, precipitation, wind), or a descriptive error message if inputs fail.
    """
    if not city_name or not city_name.strip():
        return "City name was not provided. Please provide a destination city."

    if not start_date or not start_date.strip():
        return "Start date was not provided. Please provide dates in YYYY-MM-DD format."

    if not end_date or not end_date.strip():
        return "End date was not provided. Please provide dates in YYYY-MM-DD format."

    try:
        trip_start = datetime.strptime(start_date.strip(), "%Y-%m-%d")
    except ValueError:
        return f"Invalid start_date '{start_date}'. Dates must be in YYYY-MM-DD format (e.g., '2026-08-01')."

    try:
        trip_end = datetime.strptime(end_date.strip(), "%Y-%m-%d")
    except ValueError:
        return f"Invalid end_date '{end_date}'. Dates must be in YYYY-MM-DD format (e.g., '2026-08-10')."

    if trip_start > trip_end:
        return f"Start date ({start_date}) cannot be after end date ({end_date})."

    try:
        # 1. Geocoding
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name.strip()}&count=1"
        geo_res = requests.get(geo_url, timeout=10)
        
        if geo_res.status_code != 200:
            return f"Geocoding service error (HTTP status {geo_res.status_code}) when searching for '{city_name}'."

        geo_data = geo_res.json()
        results = geo_data.get("results", [])
        if not results:
            return f"Could not find coordinates for '{city_name}'. Please verify the spelling or provide city and country (e.g., 'Paris, France')."

        location = results[0]
        lat = location.get("latitude")
        lon = location.get("longitude")
        country = location.get("country", "")

        now = datetime.now()
        days_until_start = (trip_start - now).days
        days_until_end = (trip_end - now).days

        # 2. Live Forecast (for trips within 14 days)
        if days_until_start >= 0 and days_until_end <= 14:
            url = (
                f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
                f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,wind_speed_10m_max"
                f"&timezone=auto&start_date={start_date.strip()}&end_date={end_date.strip()}"
            )
            res = requests.get(url, timeout=10)
            if res.status_code != 200:
                return f"Weather forecast API returned error {res.status_code}."

            data = res.json()
            if "daily" not in data:
                return f"No daily forecast data available for {city_name}."

            daily = data["daily"]
            t_max = [t for t in daily.get("temperature_2m_max", []) if t is not None]
            t_min = [t for t in daily.get("temperature_2m_min", []) if t is not None]
            p_sum = [p for p in daily.get("precipitation_sum", []) if p is not None]
            w_max = [w for w in daily.get("wind_speed_10m_max", []) if w is not None]
            uv_max = [u for u in daily.get("uv_index_max", []) if u is not None]

            avg_high = sum(t_max) / len(t_max) if t_max else 0
            avg_low = sum(t_min) / len(t_min) if t_min else 0
            avg_precip = sum(p_sum) / len(p_sum) if p_sum else 0
            total_precip = sum(p_sum) if p_sum else 0
            peak_uv = max(uv_max) if uv_max else 0
            avg_wind = sum(w_max) / len(w_max) if w_max else 0

            return (
                f"Weather Forecast for {city_name.title()} ({country}) from {start_date} to {end_date}:\n"
                f"- Average High: {avg_high:.1f}°C ({avg_high * 9/5 + 32:.1f}°F)\n"
                f"- Average Low: {avg_low:.1f}°C ({avg_low * 9/5 + 32:.1f}°F)\n"
                f"- Daily Precipitation Avg: {avg_precip:.2f} mm\n"
                f"- Total Precipitation: {total_precip:.1f} mm\n"
                f"- Peak UV Index: {peak_uv:.1f}\n"
                f"- Average Wind Speed: {avg_wind:.1f} km/h"
            )

        # 3. Historical Climate Baseline (for future trips beyond 14 days)
        else:
            end_year = now.year - 1
            start_year = end_year - 9

            target_md_set = set()
            curr_date = trip_start
            while curr_date <= trip_end:
                md_str = curr_date.strftime("%m-%d")
                if md_str == "02-29":
                    md_str = "02-28"
                target_md_set.add(md_str)
                curr_date += timedelta(days=1)

            archive_url = (
                f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}"
                f"&start_date={start_year}-01-01&end_date={end_year}-12-31"
                f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max"
                f"&timezone=auto"
            )
            archive_res = requests.get(archive_url, timeout=15)
            if archive_res.status_code != 200:
                return f"Historical weather archive returned error {archive_res.status_code}."

            data = archive_res.json()
            if "daily" not in data:
                return f"No historical climate data available for {city_name}."

            daily_archive = data["daily"]
            highs, lows, precips, winds = [], [], [], []

            for i, date_str in enumerate(daily_archive.get("time", [])):
                if date_str[-5:] in target_md_set:
                    t_max = daily_archive["temperature_2m_max"][i]
                    t_min = daily_archive["temperature_2m_min"][i]
                    p_sum = daily_archive["precipitation_sum"][i]
                    w_max = daily_archive["wind_speed_10m_max"][i]

                    if t_max is not None:
                        highs.append(t_max)
                    if t_min is not None:
                        lows.append(t_min)
                    if p_sum is not None:
                        precips.append(p_sum)
                    if w_max is not None:
                        winds.append(w_max)

            avg_high = sum(highs) / len(highs) if highs else 0
            avg_low = sum(lows) / len(lows) if lows else 0
            avg_precip = sum(precips) / len(precips) if precips else 0
            trip_length_days = (trip_end - trip_start).days + 1
            est_total_precip = avg_precip * trip_length_days
            avg_wind = sum(winds) / len(winds) if winds else 0

            return (
                f"Climate Averages for {city_name.title()} ({country}) for {start_date} to {end_date} (10-Yr Baseline: {start_year}-{end_year}):\n"
                f"- Historical Average High: {avg_high:.1f}°C ({avg_high * 9/5 + 32:.1f}°F)\n"
                f"- Historical Average Low: {avg_low:.1f}°C ({avg_low * 9/5 + 32:.1f}°F)\n"
                f"- Expected Daily Precipitation: {avg_precip:.2f} mm\n"
                f"- Estimated Total Trip Precipitation: {est_total_precip:.1f} mm\n"
                f"- Average Wind Speed: {avg_wind:.1f} km/h"
            )

    except requests.exceptions.RequestException as e:
        return f"Network error retrieving weather data: {str(e)}"
    except Exception as e:
        return f"Unexpected error retrieving weather for '{city_name}': {str(e)}"
