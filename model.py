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

def summarize_tos(text):
    model.generate_content("This is a section of a Terms of Service, please summarize the following text, highlighting red flags and potential issues for issues. If it seems like it has nothing to do with terms and service, respond with nothing")
    response = model.generate_content("Here is the text:" + text)
    print(response.text)
    return response