from langchain_core.tools import tool

@tool
def search_flights(destination: str, dates: str) -> str:
    """Use this tool to access flight information.
    Args:
        destination: The user's destination.
        dates: The user's check-in and check-out dates.
    """
    return f"Mock Result: Found 'United Airlines' for $400 and 'Delta Airlines' for $450 in {destination} for dates {dates}."

@tool
def search_hotels(destination: str, dates: str) -> str:

    """Simulates looking up hotel availability
    Args:
        destination: The user's destination.
        dates: The user's check-in and check-out dates.
    """

    return f"Mock Result: Found 'Grand Plaza Hotel' ($150/night) and 'Beachside Resort' ($220/night) in {destination} for dates {dates}."