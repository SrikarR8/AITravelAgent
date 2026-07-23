from langchain_core.tools import tool

@tool
def get_weather(location: str, date_reference: str) -> str:
    """
    Retrieves the weather forecast for a specific location using OpenWeather.
    Use this tool to get information about the weather, temperature, or what to pack.

    Args:
        location: The city or region to check (e.g., "Tokyo, Japan", "London").
        date_reference: The specific date or general timeframe the user is asking about
                        (e.g., "today", "2026-10-10", "next weekend").
    """

    return (
        f"Mock OpenWeather Result for {location} around {date_reference}:\n"
        f"Conditions: Mostly Sunny.\n"
        f"High: 72°F (22°C)\n"
        f"Low: 55°F (13°C)\n"
        f"Precipitation: 100% chance of rain."
    )