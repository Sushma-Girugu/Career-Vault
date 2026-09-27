require("dotenv").config();
const connectDB = require("./config/db");
const Question = require("./models/Question");

const questions = [
  {
    question: "Which keyword is used to create a class in Java?",
    optionA: "class",
    optionB: "Class",
    optionC: "create",
    optionD: "new",
    correctAnswer: "A",
    category: "Java",
    difficulty: "Easy"
  },
  {
    question: "Which method is the entry point of a Java program?",
    optionA: "start()",
    optionB: "main()",
    optionC: "run()",
    optionD: "execute()",
    correctAnswer: "B",
    category: "Java",
    difficulty: "Easy"
  },
  {
    question: "Which keyword is used to define a function in Python?",
    optionA: "function",
    optionB: "func",
    optionC: "def",
    optionD: "define",
    correctAnswer: "C",
    category: "Python",
    difficulty: "Easy"
  },
  {
    question: "Which symbol is used for comments in Python?",
    optionA: "//",
    optionB: "#",
    optionC: "/*",
    optionD: "--",
    correctAnswer: "B",
    category: "Python",
    difficulty: "Easy"
  },
  {
    question: "What does DBMS stand for?",
    optionA: "Database Management System",
    optionB: "Data Backup Management System",
    optionC: "Database Monitoring System",
    optionD: "Data Management Software",
    correctAnswer: "A",
    category: "DBMS",
    difficulty: "Easy"
  },
  {
    question: "Which SQL command is used to retrieve data?",
    optionA: "GET",
    optionB: "FETCH",
    optionC: "SELECT",
    optionD: "READ",
    correctAnswer: "C",
    category: "DBMS",
    difficulty: "Easy"
  },
  {
    question: "Which data structure follows LIFO?",
    optionA: "Queue",
    optionB: "Stack",
    optionC: "Array",
    optionD: "Linked List",
    correctAnswer: "B",
    category: "DSA",
    difficulty: "Easy"
  },
  {
    question: "Which data structure follows FIFO?",
    optionA: "Stack",
    optionB: "Tree",
    optionC: "Queue",
    optionD: "Graph",
    correctAnswer: "C",
    category: "DSA",
    difficulty: "Easy"
  },
  {
    question: "What is 10 + 20?",
    optionA: "20",
    optionB: "25",
    optionC: "30",
    optionD: "35",
    correctAnswer: "C",
    category: "Aptitude",
    difficulty: "Easy"
  },
  {
    question: "What is 25% of 100?",
    optionA: "10",
    optionB: "20",
    optionC: "25",
    optionD: "50",
    correctAnswer: "C",
    category: "Aptitude",
    difficulty: "Easy"
  }
];

const seedQuestions = async () => {
  try {
    await connectDB();

    await Question.deleteMany();

    await Question.insertMany(questions);

    console.log("Questions added successfully!");
    console.log("Total questions:", questions.length);

    process.exit(0);
  } catch (error) {
    console.log("Error adding questions:");
    console.log(error.message);
    process.exit(1);
  }
};

seedQuestions();