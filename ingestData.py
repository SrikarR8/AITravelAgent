import os
from datasets import load_dataset
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from dotenv import load_dotenv

#load env variables
load_dotenv()
# Database connection string
CONNECTION_STRING = f"postgresql+psycopg://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@localhost:{os.getenv("PORT_NUM")}/travel_db"
#Data set name
COLLECTION_NAME = "reddit_travel_qa_local"

#Create embeddings using HuggingFace's lightweight model
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
        model_kwargs={'device': 'cpu'}, 
        encode_kwargs={'normalize_embeddings': True}
    )

# connect to the pgvector database
def get_vector_store():
    return PGVector(
        embeddings=get_embeddings(),
        collection_name=COLLECTION_NAME,
        connection=CONNECTION_STRING,
        use_jsonb=True,
    )

#Function to load the reddit travel QA data 
def ingestData(clearOldData = False):
    print("Loading dataset from HuggingFace...")
    dataset = load_dataset("soniawmeyer/reddit-travel-QA-finetuning", split="train")
    
    documents = []
    
    print("Formatting documents...")
    for row in dataset:
        title = row.get("title", "").strip()
        selftext = row.get("selftext", "").strip()
        answer = row.get("falcon_summary", "").strip()
        
        #Skip rows that are completely empty
        if not title and not selftext:
            continue
            
        # Combine title and body for the context, then append the answer
        question_text = f"{title}\n{selftext}".strip()
        page_content = f"Question: {question_text}\nAnswer: {answer}"
        
        metadata = {
            "title": title if title else "No Title",
            "source": "reddit"
        }
        
        documents.append(Document(page_content=page_content, metadata=metadata))
    
    print(f"Total valid documents to ingest: {len(documents)}")    

    if clearOldData:
        print("Clearing existing vector store collection if present...")
        try:
            vector_store.drop_tables()
            print("Old tables dropped successfully.")
        except Exception as e:
            print("No existing tables found to drop. Proceeding with creation.")
        
    # initialize the vector store 
    vector_store = get_vector_store()
    
    # Batch ingestion
    batch_size = 100
    print("Starting batch ingestion...")
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        vector_store.add_documents(batch)
        print(f"Ingested documents {i} to {i + len(batch)}")
        
    print("Ingestion complete!")

#Tests the vector DB:
#Queries the database and prints the top k results
def printData(query, k=3):

    print(f"\nQuerying vector store for: '{query}'...")
    vector_store = get_vector_store()
    
    results = vector_store.similarity_search(query, k=k)
    
    if not results:
        print("No matching documents found.")
        return

    for i, doc in enumerate(results, 1):
        print(f"\n--- Match #{i} ---")
        print(f"Title: {doc.metadata.get('title', 'None')}")
        print("-" * 40)
        print(doc.page_content)
        print("=" * 60)

if __name__ == "__main__":
    # 1. Run this ONCE to process the full dataset and populate the database
    #ingestData()
    
    # 2. Test your queries
    printData("What are some budget-friendly travel tips for visiting Europe?", k=3)