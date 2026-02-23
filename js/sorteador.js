
let listaAlunos = [];
let salaEstado = new Array(32).fill(null);
let dragSourceIndex = null;

const coresEquipes = ['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#9b59b6', '#d35400', '#1abc9c', '#2c3e50'];
const nomesEquipes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Sigma", "Omega"];

async function importarAlunos() {
    const { value: text } = await Swal.fire({
        title: 'Gerenciar Alunos',
        input: 'textarea',
        inputPlaceholder: 'Nome1, Nome2, Nome3...',
        showCancelButton: true
    });
    if (text) {
        listaAlunos = text.split(',').map(n => n.trim()).filter(n => n !== "");
        Swal.fire('OK!', `${listaAlunos.length} alunos cadastrados.`, 'success');
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function distribuirLugares() {
    if (listaAlunos.length === 0) return Swal.fire('Aviso', 'Defina os nomes primeiro.', 'warning');
    salaEstado.fill(null);
    const alunosEme = shuffle([...listaAlunos]);
    let indices = shuffle(Array.from({ length: 32 }, (_, i) => i));
    alunosEme.forEach((aluno, i) => {
        salaEstado[indices[i]] = { nome: aluno, cor: null };
    });
    renderizarSala();
}

function criarEquipes() {
    let presentes = salaEstado.filter(s => s !== null);
    if (presentes.length === 0) return;
    const size = parseInt(document.getElementById('team-size').value) || 4;

    // Atribui grupos baseado na ordem atual que estão sentados
    let count = 0;
    salaEstado.forEach((aluno, idx) => {
        if (aluno) {
            const groupIdx = Math.floor(count / size);
            salaEstado[idx].cor = coresEquipes[groupIdx % coresEquipes.length];
            count++;
        }
    });
    renderizarSala();
}

function resetarCores() {
    salaEstado.forEach(s => { if (s) s.cor = null; });
    renderizarSala();
}

// --- Drag and Drop Logic ---
function onDragStart(e, index) { dragSourceIndex = index; }
function onDragOver(e, element) { e.preventDefault(); element.classList.add('drag-over'); }
function onDragLeave(element) { element.classList.remove('drag-over'); }
function onDrop(e, targetIndex) {
    e.preventDefault();
    document.querySelectorAll('.mesa-slot')[targetIndex].classList.remove('drag-over');
    if (dragSourceIndex === null || dragSourceIndex === targetIndex) return;
    const temp = salaEstado[targetIndex];
    salaEstado[targetIndex] = salaEstado[dragSourceIndex];
    salaEstado[dragSourceIndex] = temp;
    renderizarSala();
}

function renderizarSala() {
    const colEsq = document.getElementById('col-esq');
    const colDir = document.getElementById('col-dir');
    colEsq.innerHTML = ''; colDir.innerHTML = '';

    const montar = (container, offset) => {
        for (let b = 0; b < 4; b++) {
            const bancada = document.createElement('div');
            bancada.className = 'bancada-linear';
            for (let m = 0; m < 4; m++) {
                const idx = offset + (b * 4) + m;
                const slot = salaEstado[idx];

                const mesaDiv = document.createElement('div');
                mesaDiv.className = `mesa-slot ${!slot ? 'slot-vazio' : ''}`;
                mesaDiv.innerHTML = `<span class="mesa-id">${idx + 1}</span>`;

                mesaDiv.ondragover = (e) => onDragOver(e, mesaDiv);
                mesaDiv.ondragleave = () => onDragLeave(mesaDiv);
                mesaDiv.ondrop = (e) => onDrop(e, idx);

                if (slot) {
                    const label = document.createElement('div');
                    label.className = 'aluno-label';
                    label.draggable = true;
                    label.innerText = slot.nome;
                    if (slot.cor) label.style.backgroundColor = slot.cor;
                    label.ondragstart = (e) => onDragStart(e, idx);
                    mesaDiv.appendChild(label);
                }
                bancada.appendChild(mesaDiv);
            }
            container.appendChild(bancada);
        }
    };

    montar(colEsq, 0);
    montar(colDir, 16);
    atualizarLegenda();
}

function atualizarLegenda() {
    const legenda = document.getElementById('equipes-legenda');
    legenda.innerHTML = '';
    const coresUsadas = [...new Set(salaEstado.filter(s => s && s.cor).map(s => s.cor))];
    coresUsadas.forEach((cor, i) => {
        const badge = document.createElement('span');
        badge.className = 'team-badge';
        badge.style.backgroundColor = cor;
        badge.innerText = `Equipe ${nomesEquipes[coresEquipes.indexOf(cor)] || i + 1}`;
        legenda.appendChild(badge);
    });
}

window.onload = renderizarSala;
