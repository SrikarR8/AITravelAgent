from langchain_postgres.vectorstores import PGVector
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.tools import create_retriever_tool
from langchain_core.tools import tool
import os

embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
        model_kwargs={'device': 'cpu'}, 
        encode_kwargs={'normalize_embeddings': True}
    )
connection_string = f"postgresql+psycopg://travel_agent:securepassword@localhost:5433/travel_db"
collection_name = "reddit_travel_qa_local"

vector_store = PGVector(
    embeddings=embeddings,
    collection_name=collection_name,
    connection=connection_string,
    use_jsonb=True, 
)

retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

search_reddit_travel_qa = create_retriever_tool(
    retriever,
    name="search_reddit_travel_qa",
    description=(
        "Searches a localized database of Reddit travel questions and answers. "
        "Use this tool when users ask nuanced travel questions, seek specific "
        "human experiences, or need summarized travel advice."
    )
)

