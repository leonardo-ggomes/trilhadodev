/**
 * Coders - Global Scripts
 * Este arquivo gerencia apenas interações globais e componentes comuns.
 * A lógica das aulas agora reside em 'lesson-engine.js'.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Gerenciamento de Navegação Ativa
    const highlightCurrentPage = () => {
        const links = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname;

        links.forEach(link => {
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    };

    // 2. Efeitos Visuais Simples (Opcional)
    const setupInteractions = () => {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transition = '0.3s';
                logo.style.filter = 'brightness(1.2)';
            });
            logo.addEventListener('mouseleave', () => {
                logo.style.filter = 'brightness(1)';
            });
        }
    };

    // 3. Inicialização
    highlightCurrentPage();
    setupInteractions();
});
