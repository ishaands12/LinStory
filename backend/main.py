from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import os
import requests
from dotenv import load_dotenv


load_dotenv()
# Trigger reload
app = FastAPI(title="Linear Algebra Storytelling API")

INCEPTION_API_KEY = os.getenv("INCEPTION_API_KEY")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Linear Algebra Storytelling App API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/compute/vector-add")
async def compute_vector_add(v1: list[float], v2: list[float]):
    """
    Example computation endpoint.
    Adds two vectors.
    """
    if len(v1) != len(v2):
        return {"error": "Vectors must have the same dimension"}
    
    result = (np.array(v1) + np.array(v2)).tolist()
    return {
        "operation": "vector_addition",
        "v1": v1,
        "v2": v2,
        "result": result,
        "explanation": f"Adding corresponding components: {v1} + {v2} = {result}"
    }

@app.post("/api/compute/matrix-transform")
async def compute_matrix_transform(matrix: list[list[float]], vector: list[float]):
    """
    Computes M * v
    """
    m_np = np.array(matrix)
    v_np = np.array(vector)
    
    # Check dimensions
    if m_np.shape[1] != v_np.shape[0]:
         return {"error": f"Dimension mismatch: Matrix is {m_np.shape}, Vector is {v_np.shape}"}

    result = np.dot(m_np, v_np).tolist()
    
    return {
        "operation": "matrix_vector_multiplication",
        "matrix": matrix,
        "vector": vector,
        "result": result,
        "explanation": "Result is a linear combination of the matrix columns."
    }

@app.post("/api/compute/dot-product")
async def compute_dot_product(v1: list[float], v2: list[float]):
    """
    Computes dot product and cosine similarity
    """
    a = np.array(v1)
    b = np.array(v2)
    
    dot_prod = float(np.dot(a, b))
    
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a == 0 or norm_b == 0:
        cosine_sim = 0.0
    else:
        cosine_sim = dot_prod / (norm_a * norm_b)
        
    return {
        "operation": "dot_product",
        "v1": v1,
        "v2": v2,
        "dot_product": dot_prod,
        "cosine_similarity": cosine_sim,
        "explanation": f"Dot Product: {dot_prod:.2f}. Agreement (Cosine): {cosine_sim:.2f}"
    }

@app.post("/api/compute/solve-system")
async def solve_system(matrix: list[list[float]], target: list[float]):
    """
    Solves Ax = b
    """
    try:
        A = np.array(matrix)
        b = np.array(target)
        x = np.linalg.solve(A, b).tolist()
        return {
            "operation": "solve_system",
            "solution": x,
            "explanation": "Found the unique intersection point."
        }
    except np.linalg.LinAlgError:
         return {
            "error": "System has no unique solution (Singular matrix)",
            "solution": None
        }

@app.post("/api/compute/determinant")
async def compute_determinant(matrix: list[list[float]]):
    """
    Computes Determinant
    """
    det = float(np.linalg.det(np.array(matrix)))
    return {
        "operation": "determinant",
        "determinant": det,
        "explanation": f"The area scaling factor is {det:.2f}"
    }

@app.post("/api/compute/matrix-inverse")
async def compute_inverse(matrix: list[list[float]]):
    """
    Computes Inverse Matrix
    """
    try:
        arr = np.array(matrix)
        inv = np.linalg.inv(arr).tolist()
        return {
            "operation": "inverse",
            "inverse": inv,
            "explanation": "This matrix undoes the transformation."
        }
    except np.linalg.LinAlgError:
         return {
            "error": "Matrix is singular (cannot be inverted)",
            "inverse": None
        }
@app.post("/api/progress/reset")
async def reset_progress(body: dict):
    user_id = body.get("user_id")
    try:
        conn = get_db_connection()
        # Reset User stats
        conn.execute("UPDATE users SET current_level = 1, current_xp = 0 WHERE id = ?", (user_id,))
        # Delete progress
        conn.execute("DELETE FROM module_progress WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM quiz_results WHERE user_id = ?", (user_id,))
        conn.commit()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/compute/eigen")
async def compute_eigen(matrix: list[list[float]]):
    """
    Computes Eigenvalues and Eigenvectors
    """
    try:
        arr = np.array(matrix)
        vals, vecs = np.linalg.eig(arr)
        
        # Convert complex numbers to string or something JSON serializable if needed, 
        # but for this MVP we might assume real inputs often give real outputs (not always).
        # We will filter for real eigenvalues for visualization purposes.
        
        eigen_data = []
        for i in range(len(vals)):
            if np.iscomplex(vals[i]):
                continue # Skip complex eigenvalues for simple visualizer
            
            # vecs[:, i] is the eigenvector corresponding to vals[i]
            v = vecs[:, i].tolist()
            eigen_data.append({
                "eigenvalue": float(vals[i]),
                "eigenvector": v
            })

        return {
            "operation": "eigen",
            "results": eigen_data,
            "explanation": "Eigenvectors are directions that do not rotate, only stretch."
        }
    except Exception as e:
        return {
            "operation": "eigen",
            "results": [],
            "error": str(e)
        }
@app.post("/api/compute/least-squares")
async def compute_least_squares(points: list[list[float]]):
    """
    Computes Best Fit Line using Least Squares: A^T A x = A^T b
    Points is a list of [x, y]
    """
    try:
        # We want to fit y = mx + c
        # So for each point: m*x + c = y
        # Matrix form: [x, 1] * [m, c]^T = [y]
        
        pts = np.array(points)
        if len(pts) < 2:
             return {"error": "Need at least 2 points"}
             
        X = pts[:, 0]
        Y = pts[:, 1]
        
        # A matrix has column of Xs and column of 1s
        A = np.vstack([X, np.ones(len(X))]).T
        
        # Least Squares solution: (A^T A)^-1 A^T Y
        m, c = np.linalg.lstsq(A, Y, rcond=None)[0]
        
        return {
            "operation": "least_squares",
            "slope": m,
            "intercept": c,
            "equation": f"y = {m:.2f}x + {c:.2f}",
            "explanation": "Calculated the line that minimizes the sum of squared errors."
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/compute/svd-compression")
async def compute_svd_compression(data: dict):
    """
    Computes SVD and returns Rank-K approximation.
    Input: { "matrix": [[...], ...], "k": int }
    """
    try:
        matrix = np.array(data['matrix'])
        k = int(data['k'])
        
        # SVD
        U, S, Vt = np.linalg.svd(matrix, full_matrices=False)
        
        # Reconstruct with Rank K
        # U[:, :k] @ diag(S[:k]) @ Vt[:k, :]
        S_k = np.diag(S[:k])
        U_k = U[:, :k]
        Vt_k = Vt[:k, :]
        
        reconstructed = np.dot(U_k, np.dot(S_k, Vt_k))
        
        return {
            "operation": "svd_compression",
            "original_shape": matrix.shape,
            "k": k,
            "reconstructed": reconstructed.tolist(),
            "explanation": f"Compressed image using the top {k} singular values."
        }
    except Exception as e:
        return {"error": str(e)}

import sqlite3
from pydantic import BaseModel

# ... existing code ...

# --- DATABASE HELPERS ---
DB_PATH = "./db/linstory.db"

def init_db():
    if not os.path.exists("./db"):
        os.makedirs("./db")
    
    with sqlite3.connect(DB_PATH) as conn:
        with open("./db/schema.sql", "r") as f:
            conn.executescript(f.read())
            
# Initialize on startup (simple way)
init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- DATA MODELS ---
class ProgressUpdate(BaseModel):
    user_id: str
    module_id: str
    completed_sections: int
    total_sections: int
    is_completed: bool

class QuizSubmission(BaseModel):
    user_id: str
    quiz_id: str
    score: int
    max_score: int

# --- PERSISTENCE ENDPOINTS ---

@app.post("/api/progress/update")
async def update_progress(data: ProgressUpdate):
    try:
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO module_progress (user_id, module_id, completed_sections, total_sections, is_completed, last_updated)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, module_id) DO UPDATE SET
            completed_sections=excluded.completed_sections,
            total_sections=excluded.total_sections,
            is_completed=excluded.is_completed,
            last_updated=CURRENT_TIMESTAMP
        """, (data.user_id, data.module_id, data.completed_sections, data.total_sections, data.is_completed))
        conn.commit()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM module_progress WHERE user_id = ?", (user_id,)).fetchall()
    
    # Also get Level info
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    
    progress_map = {row['module_id']: dict(row) for row in rows}
    
    return {
        "user": dict(user) if user else None,
        "progress": progress_map
    }

@app.post("/api/progress/quiz")
async def submit_quiz(data: QuizSubmission):
    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO quiz_results (user_id, quiz_id, score, max_score) VALUES (?, ?, ?, ?)",
                     (data.user_id, data.quiz_id, data.score, data.max_score))
        
        # Simple XP Logic: 10 XP per point (placeholder)
        conn.execute("UPDATE users SET current_xp = current_xp + ? WHERE id = ?", (data.score * 10, data.user_id))
        
        conn.commit()
        conn.close()
        return {"status": "success", "xp_gained": data.score * 10}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Re-adding the chat endpoint and others...
@app.get("/api/users")
async def list_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, name, current_level FROM users").fetchall()
    conn.close()
    return {"users": [dict(u) for u in users]}

@app.post("/api/users/login")
async def login_user(body: dict):
    # Simple "Login" - returns user if exists, creates if not
    username = body.get("username")
    user_id = username.lower().replace(" ", "_")
    
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    
    if not user:
        conn.execute("INSERT INTO users (id, name, current_level, current_xp) VALUES (?, ?, 1, 0)", (user_id, username))
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    
    conn.close()
    return {"user": dict(user)}

@app.post("/api/chat")
async def chat_with_ai(body: dict):
    # ... (Keep existing chat logic)
    user_message = body.get("message", "")
    context = body.get("context", "")
    
    system_prompt = f"You are a friendly Linear Algebra tutor named 'Lin'. The user is currently learning about: {context}. Keep answers short, intuitive, and encouraging. Avoid heavy jargon unless necessary."
    
    try:
        if not INCEPTION_API_KEY:
             # Fallback mock response if API key is missing
            return {"reply": "I'm currently running in offline mode, but I'd say: Focus on the geometry! (API Key missing)"}

        response = requests.post(
          "https://api.inceptionlabs.ai/v1/chat/completions",
          headers={
            "Authorization": f"Bearer {INCEPTION_API_KEY}",
            "Content-Type": "application/json"
          },
          json={
            "model": "mercury",
            "messages": [
              {"role": "system", "content": system_prompt},
              {"role": "user", "content": user_message}
            ]
          }
        )
        
        response.raise_for_status()
        data = response.json()
        ai_reply = data['choices'][0]['message']['content']
        return {"reply": ai_reply}
        
    except Exception as e:
        print(f"AI Error: {e}")
        return {"reply": f"Sorry, I had a bit of a brain freeze. ({str(e)})"}

@app.get("/")
async def read_root():
    return {"message": "LinStory Backend Active"}


