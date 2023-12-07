const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
  try {
    // Clear previous questions before fetching new ones
    clearQuestions();

    const response = await fetch("https://opentdb.com/api.php?amount=5&category=18");
    const data = await response.json();
    questions = data.results;
    if (questions.length > 0) {
      startQuiz();
    } else {
      console.error("No questions fetched.");
    }
  } catch (error) {
    console.error(error);
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function clearQuestions() {
  // Clear the questions array
  questions = [];
}

function showQuestion() {
  resetState();
  resetButtonStyles(); // Reset button styles

  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  // Create a copy of the incorrect_answers array
  let answers = currentQuestion.incorrect_answers.slice();

  answers.push(currentQuestion.correct_answer);
  answers.sort(); // Randomize the answer order

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.classList.add("btn");
    answerButton.appendChild(button);

    // Append a line break after each button
    answerButton.appendChild(document.createElement("br"));

    if (answer === currentQuestion.correct_answer) {
      button.dataset.correct = true;
    }
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
}

function resetButtonStyles() {
  Array.from(answerButton.children).forEach((button) => {
    button.classList.remove("correct", "incorrect");
    button.disabled = false;
  });
}

function selectAnswer(selectedBtn) {
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();

  if (score === questions.length) {
    // If the score is equal to the total number of questions, display a congratulatory message
    questionElement.innerHTML = `Congratulations! You scored ${score} out of ${questions.length}!`;
  } else {
    // Display the regular score message
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  }

  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

answerButton.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    selectAnswer(e.target);
  }
});

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fetchQuestions();
});
