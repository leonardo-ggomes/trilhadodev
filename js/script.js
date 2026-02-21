document.addEventListener('DOMContentLoaded', () => {
    // 1. Definição das trilhas (Títulos de cada passo por página)
    const trackData = {
        'how-create-node-server.html': ["Conceito", "Estrutura", "Portas", "Finalização"],
        'npm-lesson.html': ["O que é?", "Iniciar", "Instalar", "Gerenciar", "Resumo"],
        'mvc.html': ["Introdução", "Model", "View", "Controller", "Estrutura", "Conclusão"],
        'api.html': ["Definição", "Analogia", "Fluxo", "Código"],
        'json.html': ["Conceito", "Vantagens", "Sintaxe", "Exemplo"],
        'debug.html': ["Conceito", "Uso", "Recurso", "Exemplo"],
        'arquitetura.html': ["Conceito", "Metáfora", "Vantagens", "Protocolos", "Stateless", "Tipos", "Mapa", "Desafio"],
        'banco_dados.html': ["Definição", "O SGBD", "Tabelas", "SQL", "Persistência", "Quiz"],
        'window_location.html': ["O que é URL", "Navegação JS", "Query Strings", "Captura de Dados", "Prática Dinâmica", "Quiz"],
        'dom_api.html': ["O que é o DOM", "Árvore de Elementos", "Seletores (ID)", "Manipulação", "Eventos", "Quiz"],
        'projetos.html': ["O que é Front-End", "Tríade Fundamental", "UX/UI Design", "Prática", "Quiz"],
        'condicionais.html': ["Definição", "Sintaxe Básica", "Exemplo Prático", "Operadores Lógicos", "Quiz"],
        'acessibilidade.html': ["Conceito", "Padrões W3C", "Práticas", "Recursos", "Quiz"],
        'flexbox.html': ["Conceito", "Pai & Filhos", "Os Eixos", "Propriedades", "Quiz"],
        'logica_while.html': ["Conceito", "Fluxo", "Sintaxe", "Loop Infinito", "Quiz"],
        'logica_do_while.html': ["Conceito", "Comparativo", "Sintaxe", "Desafio"],
        'logica_for.html': ["O Loop Organizado", "Anatomia", "Na Prática", "Desafio Final"],
        'logica_git.html': ["GitHub", "Conceitos Git", "Configuração", "Ciclo Local", "Fluxo Remoto", "Desafio"],    };

    // 2. Identifica a página atual
    const currentPage = window.location.pathname.split('/').pop();
    const currentTitles = trackData[currentPage] || ["Aula", "Conteúdo", "Conclusão"];

    // 3. Seleção de Elementos
    let currentStep = 1;
    const stepCards = document.querySelectorAll('.step-card');
    const totalSteps = stepCards.length;
    const progressBar = document.getElementById('progress-bar');
    const titleDisplay = document.getElementById('current-step-title');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!nextBtn) return; // Segurança caso a página não tenha carrossel

    // 4. Função de Atualização da Interface
    const updateUI = () => {
        // Esconde todos os cards e mostra o atual
        stepCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('active');
        });
        
        const activeCard = document.querySelector(`.step-card[data-step="${currentStep}"]`);
        if (activeCard) {
            activeCard.style.display = 'block';
            setTimeout(() => activeCard.classList.add('active'), 10);
        }

        // Atualiza Título e Progresso
        if (titleDisplay) titleDisplay.innerText = currentTitles[currentStep - 1] || "Aprendizado";
        if (progressBar) progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;

        // Controle dos Botões
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = 'Concluir Aula <i class="fa-solid fa-flag-checkered"></i>';
            nextBtn.classList.add('btn-finish');
        } else {
            nextBtn.innerHTML = 'Próximo <i class="fa-solid fa-chevron-right"></i>';
            nextBtn.classList.remove('btn-finish');
        }
    };

    // 5. Eventos de Clique
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
            window.scrollTo(0, 0); // Volta ao topo para leitura
        } else {
            // Feedback visual antes de sair
            nextBtn.innerText = "Salvando progresso...";
            setTimeout(() => {
                window.location.href = 'trilhas.html';
            }, 800);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    // Inicializa a primeira tela
    updateUI();
});