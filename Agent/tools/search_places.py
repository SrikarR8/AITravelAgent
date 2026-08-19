from langchain_core.tools import tool


@tool
def search_places(query: str, location: str) -> str:
    """
    Searches for restaurants, attractions, neighborhoods, or landmarks near a location.
    Use this tool to find things to do, places to eat, or what is near a specific destination.

    Args:
        query: The type of place or specific name (e.g., 'sushi restaurants', 'museums', 'Eiffel Tower').
        location: The city, neighborhood, or specific address to search near (e.g., 'Shinjuku, Tokyo', 'Paris, France').

    Returns:
        A formatted string of places and ratings, or a descriptive error message if inputs are missing.
    """
    if not query or not query.strip():
        return "Search query was not provided. Please specify what kind of place you are looking for (e.g., 'ramen', 'museums')."

    if not location or not location.strip():
        return "Location was not provided. Please specify a city or neighborhood to search near."

    try:
        q_clean = query.strip()
        loc_clean = location.strip()
        return (
            f"Places found for '{q_clean}' near '{loc_clean}': \n"
            f"1. 'Top Rated {q_clean.title()}' (4.8 ★, 1,500+ reviews) - 0.5 miles from center.\n"
            f"2. 'Local Favorite {q_clean.title()}' (4.6 ★, 820 reviews) - 1.1 miles from center.\n"
            f"3. 'Historic {q_clean.title()}' (4.5 ★, 640 reviews) - 1.8 miles from center."
        )
    except Exception as e:
        return f"Error searching for places '{query}' near '{location}': {str(e)}"
