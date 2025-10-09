import os
from flask import Blueprint, request, jsonify
import requests
from dotenv import load_dotenv

load_dotenv()

openai_bp = Blueprint('openai_bp', __name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@openai_bp.route("/generate-email-template", methods=["POST"])
def generate_email_template():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Call OpenAI REST API
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are an expert email campaign writer. Generate modular HTML email content (header, hero, content, CTA, footer) without <html> or <body>."},
                {"role": "user", "content": f"Create an email template based on: {prompt}"}
            ],
            "temperature": 0.8
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise error if status != 200

        data = response.json()
        ai_html = data["choices"][0]["message"]["content"]

        return jsonify({"html": ai_html})

    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": f"HTTP error: {str(http_err)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
