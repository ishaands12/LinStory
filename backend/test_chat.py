import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("INCEPTION_API_KEY")
print(f"Loaded Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("Error: No API Key found.")
    exit(1)

try:
    print("Sending request to Inception Labs...")
    response = requests.post(
        "https://api.inceptionlabs.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mercury",
            "messages": [
                {"role": "system", "content": "You are a test script."},
                {"role": "user", "content": "Hello world"}
            ]
        }
    )
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:", response.json()['choices'][0]['message']['content'])
    else:
        print("Error Response:", response.text)

except Exception as e:
    print(f"Exception: {e}")
