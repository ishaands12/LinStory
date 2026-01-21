# Deployment Guide 🚀

## Quick Start (Vercel)

This repository is configured as a Monorepo with a Python Backend and React Frontend.

1.  **Push to GitHub**.
2.  **Import to Vercel**:
    - Select the repository.
    - **Framework Preset**: Vite (should auto-detect).
    - **Root Directory**: `./` (Leave as Root).
    - **Environment Variables**:
        - `INCEPTION_API_KEY`: (Your API key for the AI Chat).
3.  **Deploy**.

### How it Works
The `vercel.json` file in the root directory tells Vercel how to handle traffic:
- Requests to `/api/*` are routed to the Python Backend (`backend/main.py`).
- All other requests are served by the React Frontend (`frontend/index.html`).

## Troubleshooting

### "Function Size Too Large" (Backend)
Vercel has a 250MB limit for Serverless Functions. The `numpy` and `scipy` libraries are heavy.
- If the deployment fails due to size, try removing `scipy` or `pandas` from `backend/requirements.txt` if not critical.

### "404 Not Found" (Frontend)
If you see a white screen or 404s on refresh:
- Ensure `frontend/vercel.json` handles the client-side routing rewrites.

### "Method Not Allowed" (Backend)
- Check CORS settings in `backend/main.py`. It should be set to allow `*` or your production domain.
