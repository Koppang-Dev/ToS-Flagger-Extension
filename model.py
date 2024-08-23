import os
import pandas as pd
from dotenv import load_dotenv

# Importing gemini ai
import google.generativeai as genai

# Loading environment variables from .env file
load_dotenv()

# Configuring gemini api
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def summarize_tos(text, redflag_threshold=0.7):
    # Access your Gemini model instance here (explained later)
    summary = model.generate_text(
        prompt=f"Please summarize the following text, highlighting red flags with a confidence score above {redflag_threshold}:\n\n{text}",
        max_tokens=1500,
        temperature=0.5
    )
    # Extract and return the generated summary
    return summary.choices[0].text.strip()