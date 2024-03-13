from youtube_transcript_api import YouTubeTranscriptApi

video_id = "vpvtZZi5ZWk"

try:
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    for entry in transcript:
        print(entry['start'], entry['start'] + entry['duration'], entry['text'])
except Exception as e:
    print(f"An error occurred: {e}")
