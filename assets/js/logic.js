// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;
var score = 0;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");


function startQuiz() {
  // hide start screen
  document.getElementById("start-screen").style.display = "none";
  // un-hide questions section
  questionsEl.style.display = "block";
  // start timer
  timerId = setInterval(function () {
    time--;
    timerEl.textContent = time;
  }, 1000);
  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.getElementById("question-title").textContent = currentQuestion.title;
  // clear out any old question choices

  choicesEl.innerHTML = ""

  // loop over choices ALPER
  currentQuestion.choices.forEach(function (choice, i) {
    // create new button for each choice

    var newButton = document.createElement("Button");
    choicesEl.appendChild(newButton);
    newButton.textContent = choice;
    

    // attach click event listener to each choice
    newButton.setAttribute("onclick", "questionClick(event)")
      
    });
    // display on the page
    
  };


function questionClick(event) {
  // check if user guessed wrong
  if (event.currentTarget.innerHTML !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    feedbackEl.textContent = "Wrong!";
  } else {
  

    feedbackEl.textContent = "Correct!";
    score++;
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;
  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  document.getElementById("end-screen").style.display= "block";
  // show final score
  document.getElementById("final-score").innerHTML= score
  // hide questions section
  questionsEl.style.display = "none";
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.nodeValue
  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
    // format new score object for current user
    var newScore = {
      score: score,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore)
    localStorage.setItem("highscores", JSON.stringify(highscores))

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initialsEl.addEventListener("onkeyup", checkForEnter);
