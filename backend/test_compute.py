import requests
import json
import numpy as np

BASE_URL = "http://localhost:8000/api/compute"

def test_vector_add():
    print("Testing Vector Add...")
    try:
        res = requests.post(f"{BASE_URL}/vector-add", json={"v1": [1, 2], "v2": [3, 4]})
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print("Response:", res.json())
        else:
            print("Error:", res.text)
    except Exception as e:
        print("Exception:", e)

def test_svd():
    print("\nTesting SVD...")
    try:
        # Simple identity matrix 2x2 padded to 4x4
        matrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        res = requests.post(f"{BASE_URL}/svd-compression", json={"matrix": matrix, "k": 2})
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print("Response Keys:", res.json().keys())
            print("Reconstructed Shape:", len(res.json()['reconstructed']), "x", len(res.json()['reconstructed'][0]))
        else:
            print("Error:", res.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_vector_add()
    test_svd()
