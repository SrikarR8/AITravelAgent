"""
Tool: search_activities
Description: Searches for curated activities, guided walking tours, artisan workshops,
and experiential things to do using Tavily Web Search and OpenTripMap APIs.
"""

from langchain_core.tools import tool


@tool
def search_activities(query: str, location: str, category: str = "all") -> str:
    """
    Searches for activities, walking tours, cultural experiences, artisan workshops,
    and unique things to do in a given city or region.

    Args:
        query: Specific activity or interest to find (e.g., 'pottery workshop', 'historical walking tour', 'tea ceremony').
        location: City, region, or neighborhood (e.g., 'Kyoto, Japan', 'Amalfi Coast').
        category: Optional category filter (e.g., 'workshops', 'tours', 'cultural', 'outdoor', 'all').

    Returns:
        A list of curated activities, descriptions, durations, and local provider recommendations.
    """
    # TODO: Implement Tavily web search + OpenTripMap API integration
    return f"Activity search for '{query}' in '{location}' (Category: {category}) - Tool implementation pending."
