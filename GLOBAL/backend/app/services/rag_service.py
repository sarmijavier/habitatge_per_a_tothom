from __future__ import annotations

import os
import shutil
import time
from pathlib import Path
from typing import Iterable

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)

from app.config import (
    CHROMA_COLLECTION,
    CORPUS_ROOT,
    DEMO_MODE,
    EMBEDDING_BATCH_SIZE,
    EMBEDDING_RETRY_SECONDS,
    GEMINI_EMBEDDING_MODEL,
    INCLUDE_CATEGORIES,
    INCLUDE_COUNTRIES,
    INDEX_DATASET_CARDS,
    MAX_CHUNKS,
    MAX_DOCUMENTS,
    RETRIEVER_K,
    VECTORSTORE_DIR,
)


def _require_google_api_key() -> None:
    if not (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")):
        raise RuntimeError(
            "Falta GOOGLE_API_KEY o GEMINI_API_KEY. Configúrala antes de usar el índice RAG."
        )


def _strip_frontmatter(text: str) -> str:
    if not text.startswith("---\n"):
        return text
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return text
    return parts[1].lstrip()


def _category_from_path(path: Path) -> str:
    lowered = str(path).replace("\\", "/").lower()
    if "/leyes/" in lowered:
        return "leyes"
    if "/informes/" in lowered:
        return "informes"
    if "/derivados/" in lowered:
        return "derivados"
    if "/datasets/" in lowered:
        return "datasets"
    return "general"


def _country_from_path(path: Path) -> str:
    parts = [part.lower() for part in path.parts]
    if "por_pais" in parts:
        idx = parts.index("por_pais")
        if idx + 1 < len(parts):
            return path.parts[idx + 1]
    return "comparativo"


def candidate_markdown_paths(
    corpus_root: Path = CORPUS_ROOT,
    include_dataset_cards: bool = INDEX_DATASET_CARDS,
) -> list[Path]:
    selected: list[Path] = []
    for path in sorted(corpus_root.rglob("*.md")):
        category = _category_from_path(path)
        if category == "datasets" and not include_dataset_cards:
            continue
        if INCLUDE_CATEGORIES and category not in INCLUDE_CATEGORIES:
            continue
        country = _country_from_path(path).lower()
        if INCLUDE_COUNTRIES and country not in INCLUDE_COUNTRIES and country != "comparativo":
            continue
        selected.append(path)
    return selected


def load_markdown_documents(
    corpus_root: Path = CORPUS_ROOT,
    include_dataset_cards: bool = INDEX_DATASET_CARDS,
) -> list[Document]:
    documents: list[Document] = []
    for path in candidate_markdown_paths(corpus_root, include_dataset_cards):
        text = path.read_text(encoding="utf-8")
        documents.append(
            Document(
                page_content=_strip_frontmatter(text),
                metadata={
                    "source": str(path),
                    "relative_path": str(path.relative_to(corpus_root)).replace("\\", "/"),
                    "category": _category_from_path(path),
                    "country": _country_from_path(path),
                },
            )
        )
        if MAX_DOCUMENTS and len(documents) >= MAX_DOCUMENTS:
            break
    return documents


def split_documents(documents: Iterable[Document]) -> list[Document]:
    header_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "titulo_1"),
            ("##", "titulo_2"),
            ("###", "titulo_3"),
            ("####", "titulo_4"),
        ]
    )
    char_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=150,
    )

    intermediate_chunks: list[Document] = []
    for document in documents:
        parts = header_splitter.split_text(document.page_content)
        if not parts:
            intermediate_chunks.append(document)
            continue
        for part in parts:
            part.metadata.update(document.metadata)
            intermediate_chunks.append(part)
    chunks = char_splitter.split_documents(intermediate_chunks)
    if MAX_CHUNKS:
        return chunks[:MAX_CHUNKS]
    return chunks


def _embedding_function(task_type: str) -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        model=GEMINI_EMBEDDING_MODEL,
        task_type=task_type,
    )


def _add_documents_with_retry(vectorstore: Chroma, chunks: list[Document]) -> None:
    for index in range(0, len(chunks), EMBEDDING_BATCH_SIZE):
        batch = chunks[index : index + EMBEDDING_BATCH_SIZE]
        while True:
            try:
                vectorstore.add_documents(batch)
                break
            except Exception as exc:  # pragma: no cover - quota/network dependent
                message = str(exc)
                if "RESOURCE_EXHAUSTED" not in message and "429" not in message:
                    raise
                print(
                    f"Cuota de embeddings agotada en el lote {index // EMBEDDING_BATCH_SIZE + 1}. "
                    f"Esperando {EMBEDDING_RETRY_SECONDS}s antes de reintentar..."
                )
                time.sleep(EMBEDDING_RETRY_SECONDS)


def build_vectorstore(
    corpus_root: Path = CORPUS_ROOT,
    persist_directory: Path = VECTORSTORE_DIR,
    include_dataset_cards: bool = INDEX_DATASET_CARDS,
    recreate: bool = False,
) -> tuple[Chroma, int, int]:
    _require_google_api_key()

    if recreate and persist_directory.exists():
        shutil.rmtree(persist_directory)
    persist_directory.mkdir(parents=True, exist_ok=True)

    documents = load_markdown_documents(corpus_root, include_dataset_cards)
    chunks = split_documents(documents)
    vectorstore = Chroma(
        persist_directory=str(persist_directory),
        embedding_function=_embedding_function("RETRIEVAL_DOCUMENT"),
        collection_name=CHROMA_COLLECTION,
    )
    _add_documents_with_retry(vectorstore, chunks)
    return vectorstore, len(documents), len(chunks)


def get_vectorstore(persist_directory: Path = VECTORSTORE_DIR) -> Chroma:
    _require_google_api_key()
    return Chroma(
        persist_directory=str(persist_directory),
        embedding_function=_embedding_function("RETRIEVAL_QUERY"),
        collection_name=CHROMA_COLLECTION,
    )


def get_retriever(k: int = RETRIEVER_K):
    return get_vectorstore().as_retriever(
        search_type="mmr",
        search_kwargs={"k": k, "fetch_k": max(k * 3, 12)},
    )


def retrieve_context(
    question: str,
    *,
    k: int = RETRIEVER_K,
    focus_country_id: str | None = None,
) -> dict:
    try:
        if not (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")):
            raise RuntimeError("Gemini embeddings no configurados para consulta RAG.")
        retriever = get_retriever(k=k)
        documents = retriever.invoke(question)
    except Exception:
        documents = []

    if focus_country_id:
        filtered = [
            document
            for document in documents
            if document.metadata.get("country") in {focus_country_id, "comparativo"}
        ]
        if filtered:
            documents = filtered

    seen_sources: set[tuple[str, str, str]] = set()
    sources: list[dict[str, str]] = []
    for document in documents:
        item = (
            document.metadata.get("relative_path", ""),
            document.metadata.get("category", ""),
            document.metadata.get("country", ""),
        )
        if item in seen_sources:
            continue
        seen_sources.add(item)
        sources.append(
            {
                "type": "rag",
                "path": item[0],
                "title": Path(item[0]).stem,
                "country": item[2],
            }
        )

    context = "\n\n".join(document.page_content for document in documents)
    return {
        "context": context,
        "documents": documents,
        "sources": sources,
    }
