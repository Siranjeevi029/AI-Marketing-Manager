import os
from flask import Flask, request, jsonify, send_from_directory
import requests
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PAGESPEED_API_KEY = os.getenv("PAGE_SPEED_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)
@app.route("/api/analyze-business", methods=["POST"])
def analyze_business():
    data = request.get_json(force=True)
    idea = data.get("idea", "")
    website = data.get("website", "").strip()

    ai_text = ""
    ai_raw = {}
    ai_structured = {}
    pagespeed_result = None
    seo_score = None


    try:
        if GEMINI_API_KEY:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
            prompt = f"""
            You are a digital marketing assistant.
            Based on this business idea: "{idea}",
            return a JSON object with this exact structure:

            {{
              "brand": "short brand positioning and tagline",
              "seo": ["keyword1", "keyword2", "keyword3"],
              "content": ["sample caption1", "sample caption2"],
              "calendar": [
                {{"day": 1, "task": "what to post"}},
                {{"day": 2, "task": "what to post"}}
              ]
            }}
            """

            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            r = requests.post(url, json=payload)
            if r.ok:
                ai_raw = r.json()
                if "candidates" in ai_raw and ai_raw["candidates"]:
                    ai_text = ai_raw["candidates"][0].get("content", {}).get("parts", [{}])[0].get("text", "")

                    # Try to parse JSON from Gemini
                    import json
                    try:
                        ai_structured = json.loads(ai_text)
                    except Exception:
                        ai_structured = {}
    except Exception as e:
        ai_text = f"Error calling Gemini API: {str(e)}"

    
        
    if PAGESPEED_API_KEY and website:
        try:
            ps_url = (
    f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    f"?url={website}&category=SEO&strategy=desktop&key={PAGESPEED_API_KEY}"
)

            ps = requests.get(ps_url)
            if ps.ok:
                pagespeed_result = ps.json()   # assign JSON
                print("Categories:", pagespeed_result.get("lighthouseResult", {}).get("categories", {}).keys())
            else:
                pagespeed_result = {"error": ps.text}

            # ✅ Always try to extract SEO score
            categories = pagespeed_result.get("lighthouseResult", {}).get("categories", {})
            seo = categories.get("seo")
            if seo and "score" in seo:
                seo_score = round(seo["score"] * 100)
            else:
                seo_score = None  # SEO score not available

        except Exception as e:
            pagespeed_result = {"error": str(e)}

        
    import re, json

    try:
        # remove ```json ... ```
        clean_text = re.sub(r"^```json|```$", "", ai_text.strip(), flags=re.MULTILINE).strip()
        ai_structured = json.loads(clean_text)
    except Exception as e:
        print("JSON parse error:", e)
        ai_structured = {}


    return jsonify({
    "ai_text": ai_text,
    "ai_structured": ai_structured,
    "ai_raw": ai_raw,
    "pagespeed": pagespeed_result,
    "seo_score": seo_score,  # numeric (if available)
    "seo_keywords": ai_structured.get("seo", [])
})




@app.route("/api/generate", methods=["POST"])
def generate():
    return analyze_business()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
