from flask import Flask, request, jsonify

from youtube_transcript_api import YouTubeTranscriptApi  # Import YouTubeTranscriptApi
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get_transcript', methods=['POST'])
def get_transcript():
    try:
        data = request.get_json()
        video_id = data.get('video_id', '')
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return jsonify(transcript)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
