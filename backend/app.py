# import os
# import io
# import base64
# from google import genai
# from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS
# from pyht import Client
# from dotenv import load_dotenv
# from pyht.client import TTSOptions

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# tts_client = Client(
#     user_id=os.getenv("PLAY_HT_USER_ID"),
#     api_key=os.getenv("PLAY_HT_API_KEY"),
# )
# options = TTSOptions(voice="s3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/jennifersaad/manifest.json")
# # Open a file to save the audio
# with open("output_jenn.wav", "wb") as audio_file:
#     for chunk in client.tts(, options, voice_engine = 'PlayDialog-http'):
#         # Write the audio chunk to the file
#         audio_file.write(chunk)

# print("Audio saved as output_jenn.wav")

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.get_json()
#     question = data.get('question')
#     response = client.models.generate_content(model="gemini-2.0-flash", contents=[question])
#     return jsonify({'response': response.text})

# if __name__ == '__main__':
#     app.run(debug=True)
import os
import base64
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from pyht import Client
from pyht.client import TTSOptions

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Gemini AI client
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize PlayHT TTS client
playht_client = Client(
    user_id=os.getenv("PLAY_HT_USER_ID"),
    api_key=os.getenv("PLAY_HT_API_KEY"),
)

# PlayHT voice options
tts_options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/jennifersaad/manifest.json"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question')

    # Generate AI response using Gemini
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash", 
        contents=[question]
    ).text

    # Generate speech using PlayHT
    audio_chunks = playht_client.tts(response, tts_options, voice_engine='PlayDialog-http')

    # Convert PlayHT audio output to Base64
    audio_content = b"".join(audio_chunks)
    audio_base64 = base64.b64encode(audio_content).decode("utf-8")

    return jsonify({
        'response': response,
        'audio': audio_base64  # Send Base64 audio for playback
    })

if __name__ == '__main__':
    app.run(debug=True)
