import { useState } from "react";
import ReactMarkdown from "react-markdown";
const API = "http://localhost:5000/api";

function Gemini({ profile, skills }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askGemini = async (e) => {
    e.preventDefault();

    setError("");
    setAnswer("");

    if (!prompt.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(`${API}/gemini/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
       body: JSON.stringify({
  prompt: `
You are the AI career assistant inside CareerVault.

Here is the user's profile:
${JSON.stringify(profile, null, 2)}

Here are the user's skills:
${JSON.stringify(skills, null, 2)}

User's question:
${prompt.trim()}

Give practical, personalized career advice based on the user's profile and skills.
If the provided profile or skills do not contain enough information, clearly say what information is missing.
`
})
      });

      const data = await response.json();

      if (!response.ok) {
  throw new Error(
    data.error || data.message || "Failed to get response from Gemini."
  );
}

      setAnswer(data.answer || "No response received.");
    } catch (err) {
      console.error("Gemini error:", err);

      setError(
        err.message || "Something went wrong while contacting Gemini."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Gemini AI</h2>
          <p>
            Get AI-powered career guidance and assistance.
          </p>
        </div>
      </div>

      <div className="panel">

        <form onSubmit={askGemini}>

          <div className="field">

            <label>
              Ask Gemini
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: How can I improve my resume for a software engineering internship?"
              rows="6"
            />

          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask Gemini"}
          </button>
          <button
  type="button"
  className="secondary-btn"
  disabled={loading}
  onClick={() => {
    setPrompt(
      "Analyze my current skills and identify the most important skills I should learn for a software engineering internship."
    );
  }}
>
  Skill Gap Analysis
</button>
<button
  type="button"
  className="secondary-btn"
  disabled={loading}
  onClick={() => {
    setPrompt(
      "Review my profile and skills and give me specific recommendations to improve my resume for a software engineering internship."
    );
  }}
>
  Resume Improvement
</button>

        </form>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {answer && (
        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Gemini Response</h3>
            </div>
          </div>

          <div>
           <ReactMarkdown>
  {answer}
</ReactMarkdown>
          </div>

        </div>
      )}

    </section>
  );
}

export default Gemini;