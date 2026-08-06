import requests
from datetime import datetime, timedelta
from langchain_core.tools import tool

#@tool
import requests
from datetime import datetime

def get_weather(city_name: str, start_date: str, end_date: str):
    """
    Gets 14-day live weather or 10-year climate averages for a city.
    start_date and end_date must be YYYY-MM-DD.
    """
    if city_name == "":
        return "City name not provided, cannot call API"
    if start_date == "":
        return "Start date not provided, cannot call API"
    if end_date == "":
        return "End date not provided, cannot call API"
    
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1"
    location = requests.get(geo_url).json()["results"][0]
    lat = location["latitude"]
    lon = location["longitude"]
    
    trip_start = datetime.strptime(start_date, "%Y-%m-%d")
    trip_end = datetime.strptime(end_date, "%Y-%m-%d")
    
    days_until_start = (trip_start - datetime.now()).days
    days_until_end = (trip_end - datetime.now()).days
    if days_until_start >= 0 and days_until_end <= 14:
        
        url = (
            f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,wind_speed_10m_max"
            f"&timezone=auto&start_date={start_date}&end_date={end_date}"
        )
        data = requests.get(url).json()

        if "daily" not in data:
            return "Error fetching forecast data."

        daily = data["daily"]
        
        avg_high = sum(daily["temperature_2m_max"]) / len(daily["temperature_2m_max"]) if daily["temperature_2m_max"] else 0
        avg_low = sum(daily["temperature_2m_min"]) / len(daily["temperature_2m_min"]) if daily["temperature_2m_min"] else 0
        avg_precip = sum(daily["precipitation_sum"]) / len(daily["precipitation_sum"]) if daily["precipitation_sum"] else 0
        total_precip = sum(daily["precipitation_sum"])
        
        peak_uv = max(daily["uv_index_max"]) if daily["uv_index_max"] else 0
        avg_wind = sum(daily["wind_speed_10m_max"]) / len(daily["wind_speed_10m_max"]) if daily["wind_speed_10m_max"] else 0

        return f"""
                Average High: {avg_high:.1f}°C
                Average Low: {avg_low:.1f}°C
                Average Daily Precipitation: {avg_precip:.2f} mm
                Total Period Precipitation: {total_precip:.1f} mm
                Peak UV Index: {peak_uv:.1f}
                Average Wind Speed: {avg_wind:.1f} km/h
            """
    else:
        end_year = datetime.now().year - 1
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
        archive_res = requests.get(archive_url).json()

        if "daily" not in archive_res:
            return "Error fetching historical climate data."

        daily_archive = archive_res["daily"]

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

        return f"""
Trip Dates: {start_date} to {end_date} (10-Year Historical Climate Baseline: {start_year}-{end_year})
Average High: {avg_high:.1f}°C
Average Low: {avg_low:.1f}°C
Average Daily Precipitation: {avg_precip:.2f} mm
Estimated Total Trip Precipitation: {est_total_precip:.1f} mm
Average Max Wind Speed: {avg_wind:.1f} km/h
"""
