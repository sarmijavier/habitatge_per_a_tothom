from rest_framework.response import Response
from rest_framework.decorators import api_view
from .lang_chain_service import bulk_ingest_markdown, get_answer_with_agent
import os

@api_view(['POST'])
def upload_file(request):
    # Get the file from the request
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({"error": "No file uploaded"}, status=400)

    # Save temp file to disk so LangChain can read it
    temp_path = f"temp_{uploaded_file.name}"
    with open(temp_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    # Process into Chroma
    bulk_ingest_markdown(temp_path)
    os.remove(temp_path) # Clean up
    
    return Response({"message": f"File {uploaded_file.name} indexed successfully."})

@api_view(['POST'])
def ask_question(request):
    query = request.data.get('query')
    if not query:
        return Response({"error": "No query provided"}, status=400)
    
    answer = get_answer_with_agent(query)
    return Response({"query": query, "answer": answer})