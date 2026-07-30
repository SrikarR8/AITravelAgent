#Imports - General Python
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional, Annotated, TypedDict
from datetime import datetime

#Imports - LangGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AnyMessage, SystemMessage
from langgraph.graph import StateGraph, START, END, add_messages
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

#Imports - tools

from tools.search_flights_and_hotels import search_flights, search_hotels
from tools.search_places import search_places
from tools.get_weather import get_weather


load_dotenv()
# get current local date and time
now = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S")

llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")

class DestinationDetails(BaseModel):
    city_name: str = Field(description="The city name, e.g., 'Rome'")
    country_code: str = Field(description="2-letter ISO country code, e.g., 'IT'")

# Graph state used by extractor assistant and 
class TripConstraint(BaseModel):
    destination: Optional[DestinationDetails] = Field(default=None, description="The destination city and 2 letter ISO code")
    budget: Optional[str] = Field(default=None, description="The budget for the trip in USD")
    start_date: Optional[str] = Field(default=None, description="The start date of the trip in YYYY-MM-DD format")
    end_date: Optional[str] = Field(default=None, description="The end date of the trip in YYYY-MM-DD format")

# Graph State Used by main Assistant, inherited from ^, also stores messages list with a reducer allowing for convos.
class AgenticTravelState(TripConstraint):
    messages: Annotated[list[AnyMessage], add_messages]

# Stores list of trip constraints need updating, might be needed if we want to store multiple trip contraints in the future
# ==========================================
# class ExtractionResult(BaseModel):
#     updates: list[TripConstraint]
# ==========================================

#Assistant node gets current state (if not exists uses null values or equivalent) calls the LLM with the convo and returns the LLM output
def assistant(state: AgenticTravelState):

    #for the 4 vars below, if they are defined in state, get those values,
    #otherwise initalize with "Not Specified" (or a similar variant)
    if state.destination:
        destination = f"{state.destination.city_name}, {state.destination.country_code}"
    else:
        destination = "Not specified"

    budget = state.budget or 0
    arrival = state.start_date or "Not specified"
    departure = state.end_date or "Not specified"

    #System Prompt, LLM prioritizes this most, more than any user inputs, etc.
    sys_msg = SystemMessage(content=f"""
        You are a friendly AI Travel Assistant currently running in a demo environment. Your primary goal is to help users plan a trip by gathering their requirements and simulating tool calls. The current date is {now}
        When presenting flight or hotel options, summarize the airline, price, and baggage, but never display the Offer ID to the user. Keep the Offer ID for your own internal tool usage.
        When quoting flight prices, state that these are wholesale estimates and final checkout prices may vary slightly due to airline booking fees.
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

    # Pass current state to handle corrections
    if state.destination:
        dest_str = f"{state.destination.city_name}, {state.destination.country_code}"
    else:
        dest_str = "Not specified"

    current_state_str = f"Destination: {dest_str}, Budget: {state.budget}, StartDate: {state.start_date}, EndDate: {state.end_date}"

    prompt = f"""
        You are a background state manager.
        Current State: {current_state_str}
        User's latest message: {last_user_msg}

        Extract the travel constraints. If the user is changing their mind (e.g., a new city instead of the old one), output the new values.
        If the user mentions a city but not a country, infer and provide the correct 2-letter ISO country code yourself.
        If no constraints are mentioned, return nothing.
    """

    result = structured_llm.invoke(prompt)

    #Return the result of the LLM dumped it into a dict
    return result.model_dump(exclude_none=True)

#Define and bind tools
tools = [search_hotels,search_flights,search_places,get_weather]
llm_with_tools = llm.bind_tools(tools=tools)

#Routes to tools if the assistant called them, otherwise ends the turn.
def route_after_update(state: AgenticTravelState):
    last_message = state.messages[-1]

    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# building the Graph
builder = StateGraph(AgenticTravelState)

builder.add_node("assistant", assistant)
builder.add_node("update_node", update_node)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "assistant")
builder.add_edge("assistant", "update_node")
builder.add_conditional_edges(
    "update_node",
    route_after_update,
    {
        "tools": "tools",
        END: END
    }
)
builder.add_edge("tools", "assistant")

graph = builder.compile()

def userRequest(name,request):
    initial_state = {
    "messages": [
        (f"{name}", f"{request}")
    ]
}
    printed_messages = set()
    for event in graph.stream(initial_state, stream_mode="values"):
        last_message = event["messages"][-1]

        # Only print if we haven't seen this specific message ID yet
        if last_message.id not in printed_messages:
            print(f"--- State Variables ---")
            dest = event.get('destination')
            if dest:
                print(f"Destination: {dest.get('city_name')} ({dest.get('country_code')})")
            else:
                print("Destination: None")
                
            print(f"Budget: {event.get('budget')}")
            print(f"Start Date: {event.get('start_date')}")
            print(f"End Date: {event.get('end_date')}")
            print(f"-----------------------")

            last_message.pretty_print()

            # Add the message ID to our tracking set
            printed_messages.add(last_message.id)

userRequest("user","I want to go to Turin next weekend from NYC. Can you find me a hotel and check the weather? If it is not raining can you check flights?")

    







