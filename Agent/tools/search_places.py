from langchain_core.tools import tool

@tool
def search_places(query: str, location: str) -> str:
    """
    Searches for restaurants, attractions, neighborhoods, or landmarks
    Use this tool to find things to do, places to eat, or wants to know what is near a specific location.

    Args:
        query: The type of place or specific name (e.g., "sushi restaurants", "museums", "Eiffel Tower").
        location: The city, neighborhood, or specific address to search near (e.g., "Shinjuku, Tokyo", "Paris, France").
    """
    return (
        f"Mock Google Places Result for '{query}' near '{location}': \n"
        f"1. 'The Famous {query.title()} Spot' (4.8 stars, 1500 reviews) - 0.5 miles away.\n"
        f"2. 'Local Favorite {query.title()}' (4.5 stars, 800 reviews) - 1.2 miles away."
    )
