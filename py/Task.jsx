import { useState } from "react";

function Task() {
  const [videoLink, setVideoLink] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/get_transcript", {
        method: "POST",
        mode: "no-cors", // Add 'no-cors' mode here
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: extractVideoId(videoLink),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (link) => {
    // Extract video ID from YouTube link
    const match = link.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : "";
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          YouTube Link:
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Get Transcript
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div>
        <h2>Transcript:</h2>
        <ul>
          {transcript.map((entry) => (
            <li key={entry.start}>{entry.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Task;
