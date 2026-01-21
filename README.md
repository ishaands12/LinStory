I got a C+ in Linear Algebra. But then—

Instead of accepting it as a weakness, I decided to relearn Linear Algebra by building it.

This project is a visual-first, interactive learning app that explains Linear Algebra through intuition, Python, and data-driven storytelling — not symbols first.
Vectors become directions, matrices become transformations, and eigenvectors become invariant directions you can actually see.

The app evolves alongside my own learning: as concepts click, the explanations improve.

This is a learning-by-building experiment rooted in one belief: understanding is a design problem.



# LinStory: The Linear Algebra Story 📐✨

**LinStory** is an interactive, gamified learning platform that reimagines how Linear Algebra is taught. Instead of dry textbooks or static videos, LinStory uses a **Hybrid Content Engine** to weave narrative storytelling with dynamic, interactive React visualizations.

## 🚀 Features

*   **Interactive Visualizations**: Don't just read about eigenvalues—watch exploring grid transformations, manipulate vectors, and see the math come alive with Three.js and Framer Motion.
*   **Gamified Learning**: Earn XP, level up, and unlock new "knowledge nodes" as you master concepts. Complete with sound effects and progress tracking.
*   **Hybrid Story Engine**: unique architecture that combines the ease of Markdown for content writing with the power of React components for interactivity.
*   **Knowledge Graph**: Visualize your learning path. See how Vectors connect to Matrices, and how Matrices unlock Systems of Equations.
*   **Profile System**: Multi-user support allows different students to track their own unique journey through the material.

## 🛠️ Tech Stack

### Frontend
*   **React 18** (Vite)
*   **Three.js / React-Three-Fiber** for 3D visualizations
*   **Framer Motion** for UI animations
*   **Recharts** & **SVG** for 2D plotting
*   **KaTeX** for beautiful math rendering

### Backend
*   **Python (FastAPI)**
*   **SQLite** for persistence
*   **NumPy** for heavy mathematical computations

## 📦 Installation

1.  **Clone the repository**
2.  **Start the Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python main.py
    ```
3.  **Start the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
4.  Open `http://localhost:5173` (or port shown in terminal) to begin your journey!

## 🌟 Concept

Linear Algebra is the language of modern data and AI. LinStory creates a "bridge of intuition" by allowing students to play with the geometric concepts *before* getting bogged down in algebraic notation.

---

*Built with ❤️ by [Your Name]*
