const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultEl = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const timerEl = document.getElementById('timer');
const questionCounterEl = document.getElementById('question-counter');
const paginationEl = document.getElementById('pagination');
const restartBtn = document.getElementById('restart-btn');



let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function startTimer() {
    timeLeft = 15;
    timerEl.textContent = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSelect();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}
function autoSelect() {
    const current = questions[currentQuestionIndex];
    const allButtons = answersEl.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === decodeHTML(current.correct_answer)) {
            btn.style.backgroundColor = 'green';
        }
    });

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function loadQuestion() {
    stopTimer();
    const current = questions[currentQuestionIndex];

    // Update question counter
    questionCounterEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // Update pagination steps
    const steps = paginationEl.querySelectorAll('.page-step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentQuestionIndex) {
            step.classList.add('completed');
        } else if (index === currentQuestionIndex) {
            step.classList.add('active');
        }
    });

    questionEl.innerHTML = decodeHTML(current.question);
    const answers = shuffle([...current.incorrect_answers, current.correct_answer]);
    answersEl.innerHTML = '';
    answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = decodeHTML(answer);
        btn.onclick = () => selectAnswer(answer, current.correct_answer)
        answersEl.appendChild(btn);
    });
    resultEl.textContent = '';
    startTimer();
}


function selectAnswer(selected, correct) {
    stopTimer();
    const allButtons = answersEl.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === decodeHTML(correct)) {
            btn.style.backgroundColor = 'green';
        } else if (btn.textContent === decodeHTML(selected)) {
            btn.style.backgroundColor = 'red';
        }
    });

    if (selected === correct) {
        score++;
    }
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    stopTimer();
    questionEl.textContent = 'Quiz Completed!';
    answersEl.innerHTML = '';
    timerEl.textContent = '';
    resultEl.textContent = `Your score is ${score} out of ${questions.length}`;
    restartBtn.style.display = 'inline-block'; // 👈 Show the button
}


startBtn.addEventListener("click", () => {
    fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple")
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            score = 0;
            currentQuestionIndex = 0;
            startScreen.style.display = 'none';
            quizScreen.style.display = 'block';

            paginationEl.innerHTML = '';
            for (let i = 0; i < questions.length; i++) {
                const step = document.createElement('div');
                step.className = 'page-step';
                step.textContent = i + 1; // Numbered
                paginationEl.appendChild(step);
            }


            loadQuestion();
        });
});
restartBtn.addEventListener('click', () => {
    fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple")
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            score = 0;
            currentQuestionIndex = 0;

            restartBtn.style.display = 'none';
            resultEl.textContent = '';
            loadQuestion();
        });
});

