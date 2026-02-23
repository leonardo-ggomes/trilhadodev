/**
 * TrilhaDoDev - Lesson Engine
 * Gerencia o carregamento de dados e interações dos Flashcards/Quiz
 */

let currentStep = 0;
let totalSteps = 0;
let aulaData = null;

async function initTemplate() {
    const urlParams = new URLSearchParams(window.location.search);
    const aulaId = urlParams.get('track');
    const loadingSpinner = document.getElementById('loading-spinner');

    try {
        const response = await fetch('../data.json');
        const data = await response.json();

        let aulaAtiva = null;
        let secaoTitulo = "";

        // Busca a aula e a seção correspondente
        data.trilhas.forEach(trilha => {
            const item = trilha.items.find(i => i.id === aulaId);
            if (item) {
                aulaAtiva = item;
                secaoTitulo = trilha.secao;
            }
        });

        if (aulaAtiva) {
            aulaData = aulaAtiva;
            renderAula(aulaAtiva, secaoTitulo);
        } else {
            document.getElementById('flashcard-container').innerHTML =
                `<div class='error-msg'><h2>Aula não encontrada.</h2><a href='trilhas.html'>Voltar para trilhas</a></div>`;
        }
    } catch (error) {
        console.error("Erro ao carregar aula:", error);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

function renderAula(aula, secaoTitulo) {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = '';

    // 1. Atualiza Cabeçalho
    const badge = document.getElementById('lesson-badge');
    if (badge) badge.innerText = secaoTitulo.toUpperCase();
    document.getElementById('lesson-main-title').innerText = aula.title;

    const icon = document.getElementById('lesson-icon');
    if (icon && aula.icone) icon.className = aula.icone;

    // 2. Renderiza Flashcards
    aula.flashcards.forEach((card, index) => {
        const section = document.createElement('section');
        section.className = `learning-card step-card`;
        section.style.display = index === 0 ? 'block' : 'none';
        section.innerHTML = card.html;
        container.appendChild(section);
    });

    // 3. Renderiza Quiz (se existir)
    if (aula.quiz) {
        const quizSection = document.createElement('section');
        quizSection.className = 'learning-card step-card quiz-card';
        quizSection.style.display = 'none';
        quizSection.innerHTML = `
            <div class="quiz-container">
                <h2>${aula.quiz.title}</h2>
                <div class="quiz-description">${aula.quiz.descricao}</div>
                <div class="quiz-options">
                    ${aula.quiz.opcoes.map(opt => `
                        <button class="btn-quiz-option" 
                                data-correta="${opt.correta}" 
                                data-feedback="${opt.feedback.replace(/"/g, '&quot;')}"
                                onclick="handleQuizAnswer(this)">
                            <span>${opt.ordem}</span> ${opt.descricao}
                        </button>
                    `).join('')}
                </div>
                <div id="quiz-feedback" class="quiz-feedback-box"></div>
            </div>
        `;
        container.appendChild(quizSection);
    }

    totalSteps = document.querySelectorAll('.step-card').length;
    currentStep = 0;
    updateProgress();
}

function updateProgress() {
    const steps = document.querySelectorAll('.step-card');

    steps.forEach((step, i) => {
        step.style.display = (i === currentStep) ? 'block' : 'none';
        if (i === currentStep) step.classList.add('active');
        else step.classList.remove('active');
    });

    // Barra de Progresso
    const percent = ((currentStep + 1) / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;

    // Botões
    document.getElementById('prevBtn').style.visibility = (currentStep === 0) ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('nextBtn');

    if (currentStep === totalSteps - 1) {
        nextBtn.innerHTML = 'Finalizar Aula <i class="fa-solid fa-flag-checkered"></i>';
        nextBtn.classList.add('btn-finish');
    } else {
        nextBtn.innerHTML = 'Próximo <i class="fa-solid fa-chevron-right"></i>';
        nextBtn.classList.remove('btn-finish');
    }
}

function handleQuizAnswer(btn) {
    const isCorrect = btn.getAttribute('data-correta') === 'true';
    const feedbackText = btn.getAttribute('data-feedback');
    const feedbackDisplay = document.getElementById('quiz-feedback');
    const allButtons = document.querySelectorAll('.btn-quiz-option');

    // Desabilita cliques para evitar múltiplas tentativas simultâneas
    allButtons.forEach(b => {
        b.classList.remove('selected', 'wrong', 'correct');
        b.style.pointerEvents = 'none';
    });

    // Mostra o feedback com estilo moderno
    feedbackDisplay.innerHTML = `
        <div class="feedback-content ${isCorrect ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-icon">
                <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            </div>
            <div class="feedback-text">
                <strong>${isCorrect ? 'Muito bem!' : 'Quase lá...'}</strong>
                <p>${feedbackText}</p>
            </div>
        </div>
    `;

    feedbackDisplay.style.display = 'block';
    feedbackDisplay.classList.add('animate-pop');

    if (isCorrect) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        // Permite tentar novamente após 2 segundos
        setTimeout(() => {
            feedbackDisplay.classList.remove('animate-pop');
            feedbackDisplay.style.display = 'none';
            allButtons.forEach(b => b.style.pointerEvents = 'auto');
        }, 2500);
    }
}

// Event Listeners dos Controles
document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateProgress();
        window.scrollTo(0, 0);
    } else {
        window.location.href = 'trilhas.html';
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
    }
});

window.onload = initTemplate;