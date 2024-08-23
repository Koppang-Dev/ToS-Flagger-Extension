import openai
import os

# Initialize OpenAI client
openai.api_key = os.environ.get("OPENAI_API_KEY")


def summarize_tos(text):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt=f"Please summarize the following Terms of Service document, highlighting key points and any potential issues or obligations:\n\n{text}",
        max_tokens=1500,
        temperature=0.5
    )
    return response.choices[0].text.strip()

def find_red_flags(text):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt=f"Analyze the following Terms of Service document and identify any potential red flags, problematic clauses, or user obligations that might affect users negatively:\n\n{text}",
        max_tokens=1500,
        temperature=0.5
    )
    return response.choices[0].text.strip()

# Example DataFrame
data = {
    'Header': ['Product Overview', 'SurveyMonkey', 'Integrations', 'SurveyMonkey Forms', 'SurveyMonkey Genius'],
    'Content': ['SurveyMonkey is built to handle every use case...', 'Get data-driven insights from a global leader ...', 'Integrate with 100+ apps and plug-ins to get m...', 'Build and customize online forms to collect in...', 'Create better surveys and spot insights quickl...']
}
df = pd.DataFrame(data)

# Apply summarization and red flag detection
df['Summary'] = df['Content'].apply(summarize_tos)
df['Red Flags'] = df['Content'].apply(find_red_flags)

print(df)