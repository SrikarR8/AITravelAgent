import os
from dotenv import load_dotenv, find_dotenv
from langchain_core.tools import tool
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector

# Silence Hugging Face unauthenticated hub warnings & enable local cache mode
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

load_dotenv(find_dotenv())

DB_USER = os.getenv("DB_USER", "travel_agent")
DB_PASSWORD = os.getenv("DB_PASSWORD", "securepassword")
PORT_NUM = os.getenv("PORT_NUM", "5433")

CONNECTION_STRING = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@localhost:{PORT_NUM}/travel_db"
COLLECTION_NAME = "reddit_travel_qa_local"


def get_embeddings():
    """Initializes local HuggingFace embeddings."""
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
        model_kwargs={'device': 'cpu', 'local_files_only': True},
        encode_kwargs={'normalize_embeddings': True}
    )


def get_vector_store():
    """Connects to the pgvector vector store."""
    return PGVector(
        embeddings=get_embeddings(),
        collection_name=COLLECTION_NAME,
        connection=CONNECTION_STRING,
        use_jsonb=True,
    )


@tool
def search_reddit_travel_qa(query: str, k: int = 3) -> str:
    """
    Searches a localized database of Reddit travel questions and answers.
    Use this tool when users ask nuanced travel questions, seek specific human experiences,
    budget hacks, or need summarized travel advice from fellow travelers.

    Args:
        query: The search query or travel question to look up.
        k: The number of relevant discussion matches to retrieve (default is 3).

    Returns:
        A formatted string containing the matching Reddit questions and answers, or an error message.
    """
    if not query or not query.strip():
        return "Query was empty. Please provide a search phrase or travel question."

    try:
        vector_store = get_vector_store()
        results = vector_store.similarity_search(query.strip(), k=k)

        if not results:
            return f"No matching Reddit travel discussions found for '{query}'."

        formatted_matches = []
        for i, doc in enumerate(results, 1):
            title = doc.metadata.get("title", "Community Discussion")
            formatted_matches.append(
                f"--- Match #{i} ({title}) ---\n{doc.page_content}"
            )

        return "\n\n".join(formatted_matches)

    except Exception as e:
        return f"Unable to access Reddit travel database: {str(e)}. (Please ensure PostgreSQL/pgvector is running)."
