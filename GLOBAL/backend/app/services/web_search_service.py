from __future__ import annotations

import warnings

import requests
from ddgs import DDGS

from app.config import SEARCH_MAX_RESULTS, SEARCH_REGION, SEARCH_SAFESEARCH

def search_web(query: str, max_results: int = SEARCH_MAX_RESULTS) -> list[dict[str, str]]:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            with DDGS() as ddgs:
                results = list(
                    ddgs.text(
                        query,
                        max_results=max_results,
                        region=SEARCH_REGION,
                        safesearch=SEARCH_SAFESEARCH,
                    )
                )
    except Exception:
        results = []

    normalized_results: list[dict[str, str]] = []
    for result in results:
        normalized_results.append(
            {
                "type": "web",
                "title": result.get("title", "Resultado web"),
                "href": result.get("href") or result.get("url"),
                "body": result.get("body", ""),
            }
        )

    if normalized_results:
        return normalized_results

    try:
        response = requests.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "opensearch",
                "search": query,
                "limit": 3,
                "namespace": 0,
                "format": "json",
            },
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()
        titles = payload[1]
        descriptions = payload[2]
        urls = payload[3]
        for title, description, url in zip(titles, descriptions, urls):
            normalized_results.append(
                {
                    "type": "web",
                    "title": title,
                    "href": url,
                    "body": description,
                }
            )
    except Exception:
        return []

    return normalized_results
