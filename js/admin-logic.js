let currentData = { trilhas: [] };
let draggedElement = null;

// Inicializa ou Carrega
document.getElementById('json-upload').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        currentData = JSON.parse(event.target.result);
        renderEditor();
    };
    reader.readAsText(e.target.files[0]);
});

// Renderização Principal
function renderEditor() {
    const container = document.getElementById('editor-container');
    container.innerHTML = '';

    currentData.trilhas.forEach((trilha, sIdx) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'edit-section';
        sectionDiv.draggable = true;
        sectionDiv.dataset.sIdx = sIdx;
        sectionDiv.dataset.type = 'section';

        sectionDiv.innerHTML = `
            <div class="section-header">
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fa-solid fa-grip-lines" style="cursor:grab; color:#ccc"></i>
                    <input type="text" value="${trilha.secao}" onchange="updateSectionName(${sIdx}, this.value)" 
                           style="font-weight:900; border:none; font-size:1.2rem; outline:none; background:transparent;">
                </div>
                <button class="btn-danger" onclick="deleteSection(${sIdx})"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="items-drop-zone" data-s-idx="${sIdx}"></div>
            <button onclick="addNewItem(${sIdx})" style="margin-top:15px; cursor:pointer; background:none; border:1px dashed #ccc; padding:10px; width:100%; border-radius:10px; color:#666;">
                + Adicionar Aula
            </button>
        `;

        const itemsZone = sectionDiv.querySelector('.items-drop-zone');

        trilha.items.forEach((item, iIdx) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'draggable-item';
            itemDiv.draggable = true;
            itemDiv.dataset.type = 'item';
            itemDiv.dataset.sIdx = sIdx;
            itemDiv.dataset.iIdx = iIdx;

            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px;">
                    <i class="fa-solid fa-ellipsis-vertical" style="color:#ddd"></i>
                    <i class="${item.icone || 'fa-solid fa-code'}"></i>
                    <input type="text" value="${item.title}" onchange="updateItemTitle(${sIdx}, ${iIdx}, this.value)" 
                           style="border:none; outline:none; width:200px;">
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <small style="color:#ccc">${item.id}</small>
                    <button class="btn-danger" onclick="deleteItem(${sIdx}, ${iIdx})"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
            setupDragEvents(itemDiv);
            itemsZone.appendChild(itemDiv);
        });

        setupDragEvents(sectionDiv);
        container.appendChild(sectionDiv);
    });
}

// --- FUNÇÕES DE MANIPULAÇÃO ---

function addNewSection() {
    const nome = prompt("Nome da nova seção:", "Nova Seção");
    if (!nome) return;
    currentData.trilhas.push({
        ordem: currentData.trilhas.length + 1,
        secao: nome,
        classe_estilo: "logic",
        items: []
    });
    renderEditor();
}

function addNewItem(sIdx) {
    const title = prompt("Título da aula:");
    if (!title) return;
    const id = title.toLowerCase().replace(/\s+/g, '-');
    currentData.trilhas[sIdx].items.push({
        id: id,
        title: title,
        icone: "fa-solid fa-book",
        item_ordem: currentData.trilhas[sIdx].items.length + 1
    });
    renderEditor();
}

function deleteSection(idx) {
    if(confirm("Excluir seção inteira?")) {
        currentData.trilhas.splice(idx, 1);
        renderEditor();
    }
}

function deleteItem(sIdx, iIdx) {
    currentData.trilhas[sIdx].items.splice(iIdx, 1);
    renderEditor();
}

function updateSectionName(sIdx, val) { currentData.trilhas[sIdx].secao = val; }
function updateItemTitle(sIdx, iIdx, val) { currentData.trilhas[sIdx].items[iIdx].title = val; }

// --- LÓGICA DE DRAG & DROP (REUTILIZADA E OTIMIZADA) ---

function setupDragEvents(el) {
    el.addEventListener('dragstart', (e) => {
        draggedElement = el;
        el.classList.add('dragging');
        e.stopPropagation();
    });

    el.addEventListener('dragend', () => el.classList.remove('dragging'));

    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.add('drag-over-zone');
    });

    el.addEventListener('dragleave', () => el.classList.remove('drag-over-zone'));

    el.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.remove('drag-over-zone');

        const fromType = draggedElement.dataset.type;
        const toType = el.dataset.type;

        if (fromType === 'section' && toType === 'section') {
            const from = parseInt(draggedElement.dataset.sIdx);
            const to = parseInt(el.dataset.sIdx);
            currentData.trilhas.splice(to, 0, currentData.trilhas.splice(from, 1)[0]);
        } 
        else if (fromType === 'item') {
            const fromS = parseInt(draggedElement.dataset.sIdx);
            const fromI = parseInt(draggedElement.dataset.iIdx);
            const toS = parseInt(el.dataset.sIdx); // Seção alvo (funciona se soltar na seção ou no item)
            
            const item = currentData.trilhas[fromS].items.splice(fromI, 1)[0];
            
            if (toType === 'item') {
                const toI = parseInt(el.dataset.iIdx);
                currentData.trilhas[toS].items.splice(toI, 0, item);
            } else {
                currentData.trilhas[toS].items.push(item);
            }
        }
        renderEditor();
    });
}

function exportarJSON() {
    // Normalização final de ordens
    currentData.trilhas.forEach((t, sIdx) => {
        t.ordem = sIdx + 1;
        t.items.forEach((item, iIdx) => item.item_ordem = iIdx + 1);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 4));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "data.json");
    dlAnchor.click();
}