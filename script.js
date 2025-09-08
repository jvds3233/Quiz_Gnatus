// 1 - Perguntas
const questions = [
    {
        question: "Quantas peças de mão vem num Kit Acadêmico Gnatus?",
        options: ['2', '3', '4'],
        correct: 2, // índice correto (começa em 0)
    },
    {
        question: "Qual dos Kits Acadêmicos possui uma peça de mão de alta rotação com LED?",
        options: ['Prime', 'Plus', 'Professional'],
        correct: 2,
    },
    {
        question: "Quais peças de mão são acopladas no Micro-motor?",
        options: ['Alta Rotação, Contra-Angulo', 'Alta Rotação, Peça Reta', 'Contra-Angulo, Peça-Reta'],
        correct: 2,
    },
    {
        question: "Qual a garantia mínima dos Kits Acadêmicos Gnatos?",
        options: ['3 Meses', '6 Meses', '12 Meses'],
        correct: 2,
    },
    {
        question: "Qual dos Kits abaixo acompanham Spray Lubrificante?",
        options: ['Prime, Plus', 'Plus, Professional', 'Prime, Plus, Professional'],
        correct: 2,
    }
]

// 2 - Variáveis do jogo
let currentQuestion = 0;
let score = 0;
let selected = null;
let timerInterval = null;
let timerLeft = 30;

let shuffledOptions = [];
let currentCorrectIndex = null;

// 3 - Elementos DOM
const startScreen = document.getElementById('start-game');
const gameScreen = document.getElementById('gameQuiz');
const resultsScreen = document.getElementById('result-pont');
const startBtn = document.getElementById('initButton');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('resetGame');
const questionText = document.getElementById('question-text');
const optionButtons = document.querySelectorAll('.option');
const timerElement = document.getElementById('timer');
const progressElement = document.getElementById('progress');
const finalScoreElement = document.getElementById('final-pont');
const scoreMessageElement = document.getElementById('msg-pont');

// 4 - Função para embaralhar arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; // troca elementos
    }
    return array;
}

// 5 - Função para embaralhar opções e ajustar índice da correta
function shuffleOptionsFunc(question){
    const options = question.options.slice(); // copia das opções
    const correctAnswer = question.correct;

    const optionsWithIndex = options.map((option, index) => ({
        option,
        originalIndex: index
    }));

    shuffleArray(optionsWithIndex);

    const newCorrectIndex = optionsWithIndex.findIndex(item => item.originalIndex === correctAnswer);

    return {
        shuffledOptions: optionsWithIndex.map(item => item.option),
        newCorrectIndex
    };
}

// 6 - Iniciar jogo
function initGame() {
    startBtn.addEventListener('click', startGame);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', resetGame);

    optionButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => selectOption(e, index));
    });
}

// 7 - Começar o jogo
function startGame() {
    startScreen.style.display = 'none'; // escondendo tela inicial
    gameScreen.style.display = 'block'; // mostrando jogo
    currentQuestion = 0;
    score = 0;

    loadQuestion();
}

// 8 - Carregar pergunta
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestion];
    const shuffledData = shuffleOptionsFunc(question);
    shuffledOptions = shuffledData.shuffledOptions;
    currentCorrectIndex = shuffledData.newCorrectIndex;

    questionText.textContent = question.question;

    optionButtons.forEach((btn, index) => {
        btn.textContent = shuffledOptions[index];
        btn.className = 'option';
        btn.disabled = false;
    });

    selected = null;
    nextBtn.disabled = true;
    nextBtn.classList.remove('active');

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressElement.style.width = progress + '%';

    startTimer();
}

// 9 - Selecionar opção
function selectOption(e, index) {
    if (selected !== null) return;

    clearInterval(timerInterval);
    selected = index;

    optionButtons.forEach((btn, i) => {
        if (i === currentCorrectIndex) {
            btn.classList.add('correct');
        } else if (i === selected && i !== currentCorrectIndex) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    if (selected === currentCorrectIndex) {
        score++;
    }

    nextBtn.disabled = false;
    nextBtn.classList.add('active');
}

// 10 - Próxima pergunta
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

// 11 - Timer
function startTimer() {
    timerLeft = 30;
    timerElement.textContent = timerLeft + 's';
    timerElement.classList.remove('warning');

    timerInterval = setInterval(() => {
        timerLeft--;
        timerElement.textContent = timerLeft + 's';

        if (timerLeft <= 10) {
            timerElement.classList.add('warning');
        }

        if (timerLeft <= 0) {
            clearInterval(timerInterval);
            optionButtons.forEach(btn => btn.disabled = true);
            nextBtn.disabled = false;
            nextBtn.classList.add('active');
        }
    }, 1000);
}

// 12 - Finalizar o jogo
function endGame() {
    clearInterval(timerInterval);
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    finalScoreElement.textContent = `${score}/${questions.length}`;
    const percentage = (score / questions.length) * 100;
    let message = '';

    if (percentage === 100) {
        message = 'Parabéns!';
    } else {
        message = 'Infelismente não conseguiu tente novamente!!!';
    }

    scoreMessageElement.textContent = message;
}

// 13 - Reiniciar jogo
function resetGame() {
    resultsScreen.style.display = 'none';
    startScreen.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    progressElement.style.width = '0%';
}

// 14 - DOM carregado
document.addEventListener('DOMContentLoaded', initGame);