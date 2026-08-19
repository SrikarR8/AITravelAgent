#Imports - General Python
from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel, Field
from typing import Optional, Annotated, TypedDict
from datetime import datetime
import time

#Imports - LangGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AnyMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, START, END, add_messages
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

#Imports - tools
from tools.search_reddit import search_reddit_travel_qa
from tools.search_flights_and_hotels import search_flights, search_hotels
from tools.search_places import search_places
from tools.get_weather import get_weather
from tools.convert_currency import convert_currency
from tools.calculate_travel_time import calculate_travel_time


load_dotenv(find_dotenv())
# get current local date and time
now = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S")

llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")

class CityDetails(BaseModel):
    city_name: str = Field(description="The city name, e.g., 'Rome'")
    country_code: str = Field(description="2-letter ISO country code, e.g., 'IT'")

# Graph state used by extractor assistant and 
class TripConstraint(BaseModel):
    starting: Optional[CityDetails] = Field(default=None, description="The starting city and 2 letter ISO code")
    destination: Optional[CityDetails] = Field(default=None, description="The destination city and 2 letter ISO code")
    budget: Optional[str] = Field(default=None, description="The budget for the trip in USD")
    start_date: Optional[str] = Field(default=None, description="The start date of the trip in YYYY-MM-DD format")
    end_date: Optional[str] = Field(default=None, description="The end date of the trip in YYYY-MM-DD format")
    num_travelers: Optional[int] = Field(default=None, description="The total number of travelers/guests/adults (e.g. 1, 2, 4)")

# Graph State Used by main Assistant, inherited from ^, also stores messages list with a reducer allowing for convos.
class AgenticTravelState(TripConstraint):
    messages: Annotated[list[AnyMessage], add_messages]
    missing_fields: Optional[list[str]] = Field(default_factory=list)
    status: Optional[str] = Field(default="ready")

# Stores list of trip constraints need updating, might be needed if we want to store multiple trip contraints in the future
# ==========================================
# class ExtractionResult(BaseModel):
#     updates: list[TripConstraint]
# ==========================================

#Assistant node gets current state (if not exists uses null values or equivalent) calls the LLM with the convo and returns the LLM output
def assistant(state: AgenticTravelState):

    #for the vars below, if they are defined in state, get those values,
    #otherwise initialize with "Not Specified" (or a similar variant)
    if state.destination:
        destination = f"{state.destination.city_name}, {state.destination.country_code}"
    else:
        destination = "Not specified"

    budget = state.budget or 0
    arrival = state.start_date or "Not specified"
    departure = state.end_date or "Not specified"
    travelers = state.num_travelers or "Not specified"
    dest_str = f"{state.destination.city_name} ({state.destination.country_code})" if state.destination else "Not specified"
    start_str = f"{state.starting.city_name} ({state.starting.country_code})" if state.starting else "Not specified"
    #System Prompt, LLM prioritizes this most, more than any user inputs, etc.
    sys_msg = SystemMessage(content=f"""You are a friendly AI Travel Assistant currently running in a demo environment.
        Current Date/Time: {now}
        ACTIVE TRIP CONSTRAINTS: Origin/Starting: {start_str}, Destination: {dest_str},
        Budget: {budget}, Start Date: {arrival}, End Date: {departure}, Number of Travelers: {travelers}

        When presenting flight or hotel options, summarize the airline, price, and baggage, but never display the Offer ID to the user. When searching for flights or hotels, pass the active Number of Travelers (if specified) as `numAdults` into `search_flights` and `search_hotels`.
        Try to make sure all 6 trip constraints (origin, destination, budget, start date, end date, number of travelers) are specified, otherwise it may lead to empty results.


        Currency & Budget: If a budget or cost is mentioned and the destination country uses a currency other than USD (e.g., EUR for EU countries, JPY for Japan, GBP for UK, INR for India, etc.), check the destination variable in state to determine the appropriate local currency and use the `convert_currency` tool to provide the traveler with both USD and local currency equivalents.
        
        Travel Times & Itineraries: When users ask about transit time between attractions, hotels, or neighborhoods, use `search_places` to get their GPS coordinates, and then use `calculate_travel_time` with origin and destination coordinates to compute driving or walking distances and travel duration.
    """)

    #Get and return LLM response using GEMINI (llm_with_tools)
    response = llm_with_tools.invoke([sys_msg] + state.messages)
    return {"messages": [response]}

#Find the last human message, get the contents then use a LLM that extracts the important state details and updates them
def update_node(state: AgenticTravelState):
    structured_llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite").with_structured_output(TripConstraint)

    # Find the last human message
    last_user_msg = ""
    for msg in reversed(state.messages):
        if msg.type == "human":
            last_user_msg = msg.content
            break

    if not last_user_msg:
        return {}

    dest_str = f"{state.destination.city_name}, {state.destination.country_code}" if state.destination else "Not specified"
    start_str = f"{state.starting.city_name}, {state.starting.country_code}" if state.starting else "Not specified"
    
    current_state_str = f"Starting: {start_str}, Destination: {dest_str}, Budget: {state.budget}, StartDate: {state.start_date}, EndDate: {state.end_date}, NumTravelers: {state.num_travelers}"
    prompt = f"""
        You are a background state manager.
        Current Reference Date/Time: {now}
        Current State: {current_state_str}
        User's latest message: {last_user_msg}

        Extract the travel constraints. If the user is changing their mind (e.g., a new city instead of the old one, or 3 people instead of 2), output the new values.
        - If the user mentions a city but not a country, infer and provide the correct 2-letter ISO country code yourself.
        - If the user mentions natural or relative dates (e.g. 'next weekend', 'next month', 'next Friday for 5 days', 'two weeks in October'), use Current Reference Date ({now}) to calculate and resolve the exact 'YYYY-MM-DD' dates for start_date and end_date.
        - If the user mentions group size (e.g. 'me and my girlfriend' -> 2, 'solo' -> 1, 'family of 4' -> 4), extract num_travelers as an integer.
        If no constraints are mentioned, return nothing.
    """

    result = structured_llm.invoke(prompt)

    #Return the result of the LLM dumped it into a dict
    return result.model_dump(exclude_none=True)

def validate_state(state: AgenticTravelState):
    """Deterministically checks if the user is planning a trip and what constraints are missing."""
    if state.destination:
        missing = []
        if not state.starting:
            missing.append("Origin / Departure city or airport (e.g. 'New York' / 'JFK')")
        if not state.start_date or not state.end_date:
            missing.append("Travel dates or duration (e.g. 'next weekend', 'next month', or specific dates)")
        if not state.num_travelers:
            missing.append("Number of travelers (e.g. 2 people, solo)")
        if not state.budget:
            missing.append("Approximate budget (e.g. $3000)")

        if missing:
            return {"status": "needs_info", "missing_fields": missing}

    return {"status": "ready", "missing_fields": []}



def ask_missing_info(state: AgenticTravelState):
    """Prompts the user directly for missing constraints before calling tool search APIs."""
    missing = state.missing_fields or []
    dest = f"{state.destination.city_name} ({state.destination.country_code})" if state.destination else "your destination"
    
    bullets = "\n".join([f"• {item}" for item in missing])
    content = (
        f"I'm excited to help you plan your trip to **{dest}**!\n\n"
        f"To find live flight options, hotel rates, and tailored recommendations, please specify the following missing details:\n\n"
        f"{bullets}\n\n"
        f"Once you share these, I will pull all live flight, hotel, and itinerary options for you!"
    )
    return {"messages": [AIMessage(content=content)]}


def route_after_validation(state: AgenticTravelState):
    if state.status == "needs_info":
        return "ask_missing_info"
    return "assistant"

#Define and bind tools
tools = [search_hotels, search_flights, get_weather, search_reddit_travel_qa, search_places, convert_currency, calculate_travel_time]
llm_with_tools = llm.bind_tools(tools=tools)

#Routes to tools if the assistant called them, otherwise ends the turn.
def route_after_assistant(state: AgenticTravelState):
    last_message = state.messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# building the Graph
builder = StateGraph(AgenticTravelState)

builder.add_node("update_node", update_node)
builder.add_node("validate_state", validate_state)
builder.add_node("ask_missing_info", ask_missing_info)
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "update_node")
builder.add_edge("update_node", "validate_state")
builder.add_conditional_edges(
    "validate_state",
    route_after_validation,
    {
        "ask_missing_info": "ask_missing_info",
        "assistant": "assistant"
    }
)
builder.add_edge("ask_missing_info", END)
builder.add_conditional_edges(
    "assistant",
    route_after_assistant,
    {
        "tools": "tools",
        END: END
    }
)
builder.add_edge("tools", "assistant")

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

def userRequest(name, request, thread_id="session_1", debug=False):
    """
    Executes a single user request through the LangGraph agent state flow.
    
    :param name: Username identifier
    :param request: The human message input string
    :param thread_id: Memory thread identifier for persistent conversation
    :param debug: If True, prints internal state variables alongside messages
    """
    config = {"configurable": {"thread_id": thread_id}}
    initial_input = {"messages": [(name, request)]}
    
    printed_messages = set()
    for event in graph.stream(initial_input, config=config, stream_mode="values"):
        last_message = event["messages"][-1]

        if last_message.id not in printed_messages:
            # Print state variables only when debug mode is enabled
            if debug:
                print(f"\n--- State Variables ---")
                dest = event.get('destination')
                if dest:
                    city = dest.get('city_name') if isinstance(dest, dict) else getattr(dest, 'city_name', 'None')
                    country = dest.get('country_code') if isinstance(dest, dict) else getattr(dest, 'country_code', 'None')
                    print(f"Destination: {city} ({country})")
                else:
                    print("Destination: None")
                print(f"Budget: {event.get('budget')}")
                print(f"Start Date: {event.get('start_date')}")
                print(f"End Date: {event.get('end_date')}")
                print(f"Num Travelers: {event.get('num_travelers')}")
                print(f"-----------------------")


            # Always print conversational message flow
            last_message.pretty_print()
            printed_messages.add(last_message.id)


def main():
    print("=== AI Travel Agent Interactive Session ===")
    print("Type 'quit' or 'exit' to end the session.\n")
    
    # Set to True to display state variables, or False to only display conversation
    DEBUG_MODE = False
    
    # Shared session ID keeps memory checkpointer active across turns
    session_id = "terminal_chat_1"

    while True:
        try:
            user_input = input("\nYou: ")
            
            if user_input.lower().strip() in ["quit", "exit", "q"]:
                print("\nEnding session. Safe travels!")
                break

            if not user_input.strip():
                continue

            # Calls userRequest with the debug flag setting
            userRequest("user", user_input, thread_id=session_id, debug=DEBUG_MODE)

        except (KeyboardInterrupt, EOFError):
            print("\nEnding session. Safe travels!")
            break


if __name__ == "__main__":
    main()

# def ask_missing_info(state: AgenticTravelState):
#     return {
#         "messages": [AIMessage(content="Please provide the missing trip details:")],
#         "ui_form_required": {
#             "need_origin": state.starting is None,
#             "need_dates": state.start_date is None or state.end_date is None,
#             "need_travelers": state.num_travelers is None,
#             "need_budget": state.budget is None
#         }
#     }
