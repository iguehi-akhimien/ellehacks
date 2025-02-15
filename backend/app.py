import os
import io
import base64
from google import genai
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    print(request)
    data = request.get_json()
    print(data)
    question = data.get('question')
    response = client.models.generate_content(model="gemini-2.0-flash", contents=[question])
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(debug=True)
