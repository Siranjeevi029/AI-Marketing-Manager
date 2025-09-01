# AI Marketing App (Gemini)

This app takes a business idea and generates:
- Brand profile (name suggestions, voice, UVPs)
- SEO keywords
- Content samples (caption, blog outline, ad copy + SMM tactics)
- A multi-day content calendar
- (Optional) SEO score via Google PageSpeed Insights

## Project Structure
```
ai-marketing-app/
  backend/
    app.py
    requirements.txt
    .env.example
  frontend/
    index.html
    styles.css
    app.js
```

## Prerequisites
- Python 3.10+ (Windows/macOS/Linux)
- A Google **Gemini** API key (free tier available)
- (Optional) Google PageSpeed API key if you want live SEO score

## Setup — Backend
```bash
cd backend
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt

# Create .env from example and put your real keys
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
# Then open .env and set: GEMINI_API_KEY=...
# (Optionally set PAGE_SPEED_KEY=...)

python app.py
```
The server starts at **http://127.0.0.1:5000**

## Setup — Frontend
Open **frontend/index.html** in your browser.
(If you use VS Code, the **Live Server** extension is convenient.)

Ensure `frontend/app.js` points to your backend base URL:
```js
const API = 'http://127.0.0.1:5000/api';
```

## Troubleshooting
- **ModuleNotFoundError: flask** — You didn't install requirements inside the venv. Run:
  `pip install -r backend/requirements.txt` with the venv activated.
- **CORS error in browser** — Ensure backend prints `* Running on http://127.0.0.1:5000`
  and that `CORS(app)` is present in `app.py` (it is).
- **401/403 from Gemini** — Your GEMINI_API_KEY is missing or invalid. Check backend/.env.
- **404 /api/analyze-business** — Update backend/app.py to this fixed version (included).
- **SEO score is null** — You didn’t set PAGE_SPEED_KEY or omitted your website URL.

## Notes
- Model used: `gemini-1.5-flash`. You can switch to `gemini-1.5-pro` in `backend/app.py`.
- Do **not** expose your API keys in the frontend.
