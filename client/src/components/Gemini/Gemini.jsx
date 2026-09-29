import { useState } from "react";
import ReactMarkdown from "react-markdown";

const API = "http://localhost:5000/api";

function Gemini({ profile, skills }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askGemini = async (question) => {
    setError("");
    setAnswer("");

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setLoading(true);

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
${question.trim()}

Give practical, personalized career advice based on the user's profile and skills.
If the provided profile or skills do not contain enough information, clearly say what information is missing.
`
        })
      });

      const responseText = await response.text();

      console.log("Gemini status:", response.status);
      console.log("Gemini response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Gemini server returned a non-JSON response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to get response from Gemini."
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

  const handleSubmit = (e) => {
    e.preventDefault();
    askGemini(prompt);
  };

  const handleSkillGap = () => {
    const question =
      "Analyze my current skills and identify the most important skills I should learn for a software engineering internship.";

    setPrompt(question);
    askGemini(question);
  };

  const handleResumeImprovement = () => {
    const question =
      "Review my profile and skills and give me specific recommendations to improve my resume for a software engineering internship.";

    setPrompt(question);
    askGemini(question);
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
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Ask Gemini</label>

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
            onClick={handleSkillGap}
          >
            {loading ? "Thinking..." : "Skill Gap Analysis"}
          </button>

          <button
            type="button"
            className="secondary-btn"
            disabled={loading}
            onClick={handleResumeImprovement}
          >
            {loading ? "Thinking..." : "Resume Improvement"}
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
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gemini;