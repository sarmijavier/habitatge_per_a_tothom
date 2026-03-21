import os
from langchain_community.document_loaders import (
    DirectoryLoader, 
    UnstructuredXMLLoader, 
    CSVLoader, 
    UnstructuredExcelLoader, 
    JSONLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_classic.agents import AgentExecutor
from langchain_classic.agents import create_tool_calling_agent
import langchainhub as hub
from langchain_ollama import ChatOllama

import duckdb
from langchain.tools import tool
# Configuration
CHROMA_PATH = os.path.join(os.getcwd(), "chroma_db")
embeddings = OllamaEmbeddings(model="nomic-embed-text")


def bulk_ingest_markdown(folder_path):
    """
    Scans a folder specifically for Markdown files and indexes them into Chroma.
    """
    # Filter for .md or .markdown files
    supported_extensions = [".md", ".markdown"]
    docs = []
    
    # Iterate through all files in the folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(filename) # Full path used below
        full_path = os.path.join(folder_path, filename)
        ext = os.path.splitext(filename)[1].lower()

        if ext in supported_extensions:
            print(f"Indexing Markdown: {filename}")
            # 'mode="elements"' can be used if you want to preserve headers as metadata
            loader = UnstructuredMarkdownLoader(full_path)
            docs.extend(loader.load())

    if not docs:
        return "No Markdown files found in the directory."

    # Standard splitting for RAG
    # For Markdown, 1000 characters is usually a good balance for Gemini
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    # Save/Update Chroma using your existing embeddings (e.g., nomic-embed-text)
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    
    return f"Success: {len(docs)} Markdown files processed into {len(chunks)} chunks."

# Ensure your API Key is set
# os.environ["GOOGLE_API_KEY"] = "your-api-key-here"


# Herramienta para DuckDB (Números/CSV)
@tool
def query_csv_data(sql_query: str) -> str:
    """
    Útil para responder preguntas sobre estadísticas, ventas, índices nominales 
    o cualquier dato numérico del CSV. Entrada: Una consulta SQL válida para DuckDB.
    """
    try:
        con = duckdb.connect('mi_data.db')
        # Limitamos a 10 resultados por seguridad y convertimos a string
        result = con.execute(sql_query).fetchdf().to_string()
        con.close()
        return result
    except Exception as e:
        return f"Error en la consulta SQL: {e}"

# Herramienta para Chroma (Texto/PDF)
@tool
def search_pdf_documents(query: str) -> str:
    """
    Útil para responder preguntas conceptuales, descripciones o contexto 
    basado en los documentos PDF.
    """
    # Usamos tu lógica actual de retriever
    vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
    docs = vector_db.similarity_search(query, k=3)
    return "\n\n".join([d.page_content for d in docs])


def get_answer_with_agent(query):
    # 1. El modelo (Cerebro)
    use_ollama = False # Cambia a True si quieres usar Ollama localmente
    if use_ollama:
        # Asegúrate de tener ollama corriendo y el modelo descargado (ej. llama3)
        llm = ChatOllama(
            model="llama3.2:latest", # o el modelo que prefieras usar localmente
            temperature=0,
        )

    #{
    #    "query":"puedes decirme como han aumentado los precios de vivienda "
    #}

    else:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            #model='gemini-1.5-flash',
            temperature=0,
            google_api_key="AIzaSyDSgd9m-nJCZUhq2U3WzG8gbC4l_d6hNqM"
        )

    # 2. Tus herramientas (Asegúrate de tenerlas definidas arriba)
    # query_csv_data -> Para SQL en DuckDB
    # search_pdf_documents -> Para RAG en Chroma
    tools = [query_csv_data, search_pdf_documents]

    # 3. EL PROMPT (Sustituye a hub.pull)
    # Este prompt le explica al Agente cómo razonar
    prompt = ChatPromptTemplate.from_messages([
        ("system", """Eres un asistente analítico experto en datos de vivienda y economía.
        
        REGLAS DE HERRAMIENTAS:
        1. Para DATOS NUMÉRICOS o TABLAS (CSV), usa 'query_csv_data'. 
           - La tabla se llama 'usuarios'.
           - Si la columna es "freq,unit,geo\\TIME_PERIOD", usa LIKE '%,%,ES' para filtrar por país (ej. España).
           - Los años son columnas. Si necesitas varios años, usa UNPIVOT.
        2. Para CONCEPTOS, TEORÍA o TEXTO, usa 'search_pdf_documents' enviando una frase en lenguaje natural.

        EJEMPLOS DE CONSULTA PARA 'query_csv_data':
        - Si preguntan por precios en España: 
          SELECT "2022", "2023" FROM usuarios WHERE "freq,unit,geo\\TIME_PERIOD" LIKE '%,%,ES'
        - Si preguntan por el promedio de una columna:
          SELECT AVG(price) FROM usuarios WHERE country_code = 'ES'

        EJEMPLO PARA 'search_pdf_documents':
        - Si preguntan "¿Qué es el índice nominal?": 
          Simplemente envía la pregunta: "Definición y metodología del índice nominal"

        - Responde siempre en español de forma profesional."""),
        ("human", "{input}"),
        # Este componente permite al agente "anotar" sus pensamientos antes de responder
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    # 4. Construcción del Agente
    agent = create_tool_calling_agent(llm, tools, prompt)
    
    # 5. El Ejecutor
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, 
        handle_parsing_errors=True
    )
    
    return agent_executor.invoke({"input": query})["output"]



# To run it:

#bulk_ingest_data("../datasets/spain_internacional_housing/Hackaton dataset")

#bulk_ingest_markdown("../hack/corpus_markdown_rag/chunks/por_pais/espana/leyes")