import { useState } from "react";

const questions = [
  {
    question: "Tell me about yourself.",
    options: [
      "Give a brief professional introduction",
      "Talk only about hobbies",
      "Say nothing",
      "Describe your family only",
    ],
    answer: "Give a brief professional introduction",
  },
  {
    question: "What is your greatest strength?",
    options: [
      "I never prepare",
      "Problem-solving and continuous learning",
      "I avoid teamwork",
      "I dislike challenges",
    ],
    answer: "Problem-solving and continuous learning",
  },
  {
    question: "Why should we hire you?",
    options: [
      "I have no interest in the role",
      "I can contribute my skills and learn quickly",
      "I do not want responsibilities",
      "I cannot work with others",
    ],
    answer: "I can contribute my skills and learn quickly",
  },
];

function JobTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }

    if (selectedAnswer === question.answer) {
      setScore(score + 1);
    }

    if (currentQuestion === questions.length - 1) {
      setCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div>
        <h2>Interview Practice Results</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>

        <button onClick={restartTest}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Job Test / Interview Practice</h2>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h3>{question.question}</h3>

      {question.options.map((option) => (
        <div key={option}>
          <label>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            {option}
          </label>
        </div>
      ))}

      <br />

      <button onClick={handleNext}>
        {currentQuestion === questions.length - 1
          ? "Finish Test"
          : "Next Question"}
      </button>
    </div>
  );
}

export default JobTest;