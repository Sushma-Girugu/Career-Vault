import { useState } from "react";

function JobTest() {
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const startTest = async () => {
    if (!category) {
      alert("Please select a category");
      return;
    }

    try {
      setLoading(true);
      setScore(null);
      setAnswers({});

      const response = await fetch(
        `/api/questions?category=${category}`
      );

      const data = await response.json();

      setQuestions(data);
    } catch (error) {
      console.log("Error fetching questions:", error);
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const submitTest = () => {
    let totalScore = 0;

    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  return (
    <div>
      <h2>Job Test / Interview Preparation</h2>

      <p>
        Practice technical questions and prepare for job interviews.
      </p>

      <h3>Select Test Category</h3>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- Select Category --</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
        <option value="DBMS">DBMS</option>
        <option value="DSA">DSA</option>
        <option value="Aptitude">Aptitude</option>
      </select>

      <br />
      <br />

      <button onClick={startTest}>
        Start Test
      </button>

      <br />
      <br />

      {loading && <p>Loading questions...</p>}

      {questions.length > 0 && (
        <div>
          <h3>{category} Test</h3>

          {questions.map((q, index) => (
            <div key={q._id}>
              <p>
                <strong>
                  {index + 1}. {q.question}
                </strong>
              </p>

              <label>
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  value="A"
                  checked={answers[q._id] === "A"}
                  onChange={() => selectAnswer(q._id, "A")}
                />
                {q.optionA}
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  value="B"
                  checked={answers[q._id] === "B"}
                  onChange={() => selectAnswer(q._id, "B")}
                />
                {q.optionB}
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  value="C"
                  checked={answers[q._id] === "C"}
                  onChange={() => selectAnswer(q._id, "C")}
                />
                {q.optionC}
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  value="D"
                  checked={answers[q._id] === "D"}
                  onChange={() => selectAnswer(q._id, "D")}
                />
                {q.optionD}
              </label>

              <hr />
            </div>
          ))}

          <button onClick={submitTest}>
            Submit Test
          </button>
        </div>
      )}

      {score !== null && (
        <div>
          <h2>Test Result</h2>

          <p>
            Your Score: <strong>{score}</strong> / {questions.length}
          </p>

          <p>
            Correct Answers: {score}
          </p>

          <p>
            Wrong Answers: {questions.length - score}
          </p>
        </div>
      )}

      {questions.length === 0 && !loading && category && (
        <p>No questions found for this category.</p>
      )}
    </div>
  );
}

export default JobTest;