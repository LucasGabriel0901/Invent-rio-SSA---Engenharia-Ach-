/* ============================================================
   1. BANCO DE DADOS E ESTADO INICIAL
   ============================================================ */
let estoque = [
    {id: 1, cod: "21001029", desc: "BASE BAIXA METALICA", loc: "TIEN12C15", qtd: 5, unidade: "UN"}
];

let requisicoes = [
    {id: 101, req: "Lucas Gabriel", data: "08/04/2026", ordem: "100067438", depto: "Engenharia", entregue: "Marcos Lima", materiais: ["Item Teste (1UN)"], fin: "Teste de sistema"}
];

let coletas = []; 
let materiaisTemporariosColeta = [];


// COLOQUE ESTE BLOCO APENAS UMA VEZ NO SCRIPT
function renderTabelas() {
    const cEstoque = document.getElementById('corpo-consulta');
    const cAdm = document.getElementById('corpo-adm');
    const cReq = document.getElementById('corpo-requisicoes');

    if (cEstoque) cEstoque.innerHTML = "";
    if (cAdm) cAdm.innerHTML = "";
    if (cReq) cReq.innerHTML = "";

    estoque.forEach(i => {
        const statusTexto = i.qtd > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL';
        const statusClasse = i.qtd > 0 ? 'bg-ok' : 'bg-empty';
        
        if (cEstoque) {
            cEstoque.innerHTML += `
                <tr onclick="verDetalhesProduto(${i.id})">
                    <td><b>${i.cod}</b></td>
                    <td>${i.desc}</td>
                    <td style="color:var(--magenta)">${i.loc}</td>
                    <td>${i.qtd}</td>
                    <td><span class="badge ${statusClasse}">${statusTexto}</span></td>
                </tr>`;
        }
        if (cAdm) {
            cAdm.innerHTML += `
                <tr>
                    <td><b>${i.cod}</b></td>
                    <td>${i.desc}</td>
                    <td>
                        <button class="btn-icon" onclick="editarProd(${i.id})">✏️</button>
                        <button class="btn-icon" onclick="excluirProdPorId(${i.id})">🗑️</button>
                    </td>
                </tr>`;
        }
    });

    if (cReq) {
        requisicoes.forEach(r => {
            cReq.innerHTML += `
                <tr onclick="verDetalhesReq(${r.id})" style="cursor:pointer;">
                    <td>${r.req}</td>
                    <td>${r.data}</td>
                    <td>${r.ordem}</td>
                    <td>${r.depto}</td>
                </tr>`;
        });
    }
}



    
function verDetalhesReq(id) {
    const r = requisicoes.find(x => x.id.toString() === id.toString());
    if (!r) return;

    document.getElementById('conteudo-painel').innerHTML = `
        <div class="panel-header-pro"><h2>🔍 Detalhes da Requisição</h2></div>
        <div class="pro-card full-width"><label>REQUISITANTE</label><p>${r.req}</p></div>
        <div class="details-grid-pro">
            <div class="pro-card"><label>DATA</label><p>${r.data}</p></div>
            <div class="pro-card"><label>ORDEM SAP</label><p>${r.ordem}</p></div>
        </div>
        <div class="pro-card full-width" style="margin-top:10px;">
            <label>ITENS RETIRADOS</label>
            <p>${r.materiais ? r.materiais.join('<br>') : 'Nenhum item'}</p>
        </div>
    `;
    document.getElementById('panel-sistema').classList.add('active');
}

/* ============================================================
   4. GESTÃO DE ESTOQUE E COLETAS
   ============================================================ */
function salvarNovoProduto() {
    const cod = document.getElementById('f-cod').value;
    const desc = document.getElementById('f-desc').value;
    if (!cod || !desc) return alert("Preencha Código e Descrição!");

    estoque.push({
        id: Date.now(),
        cod: cod,
        desc: desc,
        loc: document.getElementById('f-loc').value,
        qtd: parseInt(document.getElementById('f-qtd').value) || 0
    });

    function excluirProdPorId(id) {
    if(confirm("Excluir item?")) {
        estoque = estoque.filter(item => item.id !== id);
        renderTabelas(); // <--- COLOQUE AQUI PARA ATUALIZAR APÓS APAGAR
    }
}
    
    alert("Produto Salvo!");
}
function finalizarColeta(id) {
    // 1. Procuramos a coleta usando o ID convertido para String (evita erros de tipo)
    const item = coletas.find(c => String(c.id) === String(id));
    
    if(item) {
        const agora = new Date();
        
        // 2. Mudamos o status para concluído
        item.status = "concluido";
        
        // 3. Registramos a hora da conclusão
        item.dataConclusao = agora.toLocaleDateString('pt-BR') + " às " + agora.getHours() + ":" + String(agora.getMinutes()).padStart(2, '0');
        
        // 4. CHAVE DO SUCESSO: Chamamos o render para atualizar a tela na hora!
        renderColetas();
        
        console.log("✅ Coleta #" + id + " finalizada!");
    } else {
        console.error("❌ Erro: Coleta não encontrada!");
    }
}


    function autenticar() {
    // 1. Pega a senha digitada pelo Lucas Gabriel no campo do HTML
    const senhaDigitada = document.getElementById('pass-field').value;

    // 2. Verifica se a senha é a correta (123)
    if (senhaDigitada === "123") {
        // 3. Esconde a tela de login original
        document.getElementById('tela-login-split').style.setProperty('display', 'none', 'important');
        
        // 4. Mostra o Hub de Seleção de Módulos que criamos
        const hub = document.getElementById('hub-modulos');
        if (hub) {
            hub.style.display = 'flex';
        } else {
            // Se der esse erro, significa que você esqueceu de colocar o <div id="hub-modulos"> no HTML
            console.error("Erro técnico: O contêiner 'hub-modulos' não existe no HTML.");
            alert("Erro no sistema: Hub de módulos não encontrado.");
        }
    } else {
        alert("Senha incorreta! Tente 123.");
    }
}
/* ============================================================
   6. INTERFACE ERP - GESTÃO DE MÓDULOS (HUB)
   ============================================================ */

// 1. Função disparada após o login para escolher o caminho
function entrarModulo(modulo) {
    // Esconde o Hub de seleção
    document.getElementById('hub-modulos').style.display = 'none';
    
    // Mostra o sistema principal (Sidebar + Main)
    document.getElementById('sistema-principal').style.setProperty('display', 'flex', 'important');
    
    if (modulo === 'almoxarifado') {
        // Ajusta o título e carrega a primeira aba do Almoxarifado
        document.getElementById('page-title').innerText = "Consulta de Peças SSA";
        configurarMenu('almoxarifado');
        switchTab('consulta', document.getElementById('btn-consulta'));
    } 
    else if (modulo === 'solicitacoes') {
        // Ajusta o título e carrega o Portal de Solicitações
        document.getElementById('page-title').innerText = "Portal de Solicitações - Compras e Serviços";
        configurarMenu('solicitacoes');
        switchTab('solicitacoes', document.getElementById('btn-solicitacoes'));
        renderSolicitacoes(); // Chama a função que desenha a tabela de solicitações
    }
}

// 2. Função que troca os botões da Sidebar dependendo do módulo
function configurarMenu(modulo) {
    const btnAlmoxarifado = document.querySelectorAll('.menu-almoxarifado');
    const btnSolicitacoes = document.querySelectorAll('.menu-solicitacoes');

    if (modulo === 'almoxarifado') {
        btnAlmoxarifado.forEach(el => el.style.display = 'block');
        btnSolicitacoes.forEach(el => el.style.display = 'none');
    } else {
        btnAlmoxarifado.forEach(el => el.style.display = 'none');
        btnSolicitacoes.forEach(el => el.style.display = 'block');
    }
}

// COLOQUE AQUI EMBAIXO A SUA FUNÇÃO switchTab(tab, btn) QUE JÁ EXISTE...

function switchTab(tab, btn) {
    document.querySelectorAll('.container').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).style.display = 'block';
    btn.classList.add('active');
    if(tab === 'coleta') renderColetas();
    fecharPainel();
}

function fecharPainel() { document.getElementById('panel-sistema').classList.remove('active'); }
function verificarAdmin(btn) { if(prompt("Senha ADM:") === "123") switchTab('gestao', btn); }

window.onload = () => { renderTabelas(); };
function renderColetas() {
    const pendentes = document.getElementById('grid-coletas-pendentes');
    const concluidas = document.getElementById('grid-coletas-concluidas');
    if(!pendentes) return;

    pendentes.innerHTML = ""; concluidas.innerHTML = "";
    const agora = new Date();

    coletas.forEach(c => {
        const dataPedido = new Date(c.data);
        const diffHoras = Math.abs(agora - dataPedido) / 36e5;
        let corBorda = "#22c55e"; let icon = "🕒";

        if (diffHoras > 3 && diffHoras <= 6) { corBorda = "#eab308"; icon = "⚠️"; } 
        else if (diffHoras > 6) { corBorda = "#ef4444"; icon = "🔥"; }

        const cardHtml = `
            <div class="card-coleta" style="border-left: 8px solid ${corBorda}; background: #1e293b; padding:15px; border-radius:10px; margin-bottom:10px; position:relative;">
                <span style="position:absolute; top:10px; right:10px;">${icon}</span>
                <h4 style="font-size:0.7rem; color:#94a3b8;">COLETA #${c.id}</h4>
                <span style="display:block; font-weight:800; margin:5px 0;">${c.solicitante}</span>
                <small style="color:#94a3b8;">Recebido: ${dataPedido.getHours()}:${dataPedido.getMinutes()}</small>
                <div style="margin-top:10px; color:#E10098; font-weight:800; font-size:0.8rem;">Pedido: ${c.pedido}</div>
                ${c.status === 'pendente' ? `<button onclick="finalizarColeta(${c.id})" style="width:100%; margin-top:10px; background:#E10098; border:none; color:white; padding:5px; border-radius:5px; cursor:pointer;">Concluir</button>` : ''}
            </div>`;

        if(c.status === 'pendente') pendentes.innerHTML += cardHtml;
        else concluidas.innerHTML += cardHtml;
    });
}

/* --- FUNÇÃO PARA ABRIR O FORMULÁRIO DE REQUISIÇÃO --- */
function abrirNovaRequisicao() {
    const painel = document.getElementById('conteudo-painel');
    const gaveta = document.getElementById('panel-sistema');

    if (!painel || !gaveta) {
        console.error("Erro: Elementos do painel não encontrados!");
        return;
    }

    // Desenha o formulário dinamicamente
    painel.innerHTML = `
        <div class="panel-header-pro"><h2>📝 Nova Requisição</h2></div>
        
        <div class="users-flow-pro" style="display:flex; gap:15px; margin-bottom:20px; background:var(--bg-sidebar); padding:15px; border-radius:10px;">
            <div style="flex:1;">
                <label style="font-size:0.7rem; color:var(--magenta); font-weight:800;">ENTREGUE POR</label>
                <input type="text" id="n-entregue" placeholder="Operador..." style="width:100%;">
            </div>
            <div style="flex:1;">
                <label style="font-size:0.7rem; color:var(--magenta); font-weight:800;">REQUISITANTE</label>
                <input type="text" id="n-req" placeholder="Nome do funcionário..." style="width:100%;">
            </div>
        </div>

        <div class="form-grid-adm" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div class="group"><label>ORDEM SAP</label><input type="text" id="n-ordem"></div>
            <div class="group"><label>DEPTO</label><input type="text" id="n-depto" placeholder="Ex: Produção"></div>
            <div class="group"><label>C. CUSTO</label><input type="text" id="n-cc"></div>
            <div class="group"><label>FINALIDADE</label><input type="text" id="n-finalidade"></div>
        </div>

        <div style="margin-top:20px; border-top:1px solid var(--borda); padding-top:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <label style="font-weight:800; font-size:0.8rem;">📦 ITENS RETIRADOS</label>
                <button onclick="addMaterialLinha()" style="background:var(--magenta); color:white; border:none; padding:2px 10px; border-radius:5px; cursor:pointer;">+ Item</button>
            </div>
            <div id="lista-materiais-input">
                <div class="mat-row-input" style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="text" class="mat-nome" placeholder="Cód - Peça..." style="flex:3;">
                    <input type="number" class="mat-qtd" placeholder="Qtd" style="flex:1;">
                </div>
            </div>
        </div>

        <button class="btn-pill-save" style="margin-top:30px;" onclick="salvarReqFinal()">✨ FINALIZAR E SALVAR</button>
    `;

    // Abre a gaveta lateral
    gaveta.classList.add('active');
}
function salvarReqFinal() {
    // 1. Captura os dados do formulário lateral
    const req = document.getElementById('n-req').value;
    const entregue = document.getElementById('n-entregue').value;
    const ordem = document.getElementById('n-ordem').value;
    const depto = document.getElementById('n-depto').value;
    const fin = document.getElementById('n-finalidade').value;

    // 2. Validação básica (Não deixa salvar vazio)
    if(!req || !ordem) { 
        alert("⚠️ Preencha o Requisitante e a Ordem SAP!"); 
        return; 
    }

    // 3. Captura os materiais que você adicionou nas linhas
    const nomes = document.querySelectorAll('.mat-nome');
    const qtds = document.querySelectorAll('.mat-qtd');
    let mats = [];
    nomes.forEach((n, i) => { 
        if(n.value) mats.push(`${n.value} (${qtds[i].value || 1}UN)`); 
    });

    // 4. Adiciona ao array global de requisições
    requisicoes.unshift({
        id: Date.now(),
        req: req,
        entregue: entregue,
        data: new Date().toLocaleDateString('pt-BR'),
        ordem: ordem,
        depto: depto || "Engenharia",
        materiais: mats,
        fin: fin
    });

    // 5. ATUALIZA A TELA (Gatilho crucial)
    renderTabelas(); 
    
    // 6. Fecha o painel e avisa o sucesso
    fecharPainel();
    alert("✅ Requisição salva e registrada no histórico!");
}

/* --- SALVAR E ATUALIZAR --- */
function salvarNovoProduto() {
    const cod = document.getElementById('f-cod').value;
    const desc = document.getElementById('f-desc').value;
    const qtd = document.getElementById('f-qtd').value;

    if (!cod || !desc) {
        alert("⚠️ Preencha Código e Descrição!");
        return;
    }

    const novoItem = {
        id: Date.now(),
        cod: cod,
        desc: desc,
        loc: document.getElementById('f-loc').value || "N/A",
        qtd: parseInt(qtd) || 0,
        unidade: document.getElementById('f-unidade').value || "UN",
        familia: document.getElementById('f-familia').value || "",
        espec: document.getElementById('f-espec').value || ""
    };

    estoque.push(novoItem); // Adiciona ao array
    renderTabelas();       // Roda a atualização na tela
    
    // Limpa os campos
    document.querySelectorAll('.form-grid-adm input, .form-grid-adm textarea').forEach(el => el.value = "");
    alert("✅ Estoque Atualizado!");
}

function verDetalhesProduto(id) {
    const i = estoque.find(x => x.id === id);
    document.getElementById('conteudo-painel').innerHTML = `
        <div class="panel-header-pro"><h2>Detalhes do Material</h2></div>
        <div class="details-grid-pro"><div class="pro-card full-width"><label>Descrição</label><p>${i.desc}</p></div><div class="pro-card"><label>Código SAP</label><p>${i.cod}</p></div><div class="pro-card highlight"><label>Localização</label><p>${i.loc}</p></div><div class="pro-card qtd-box"><label>Quantidade</label><p>${i.qtd}</p></div></div>`;
    document.getElementById('panel-sistema').classList.add('active');
}

function verDetalhesReq(id) {
    const r = requisicoes.find(x => x.id === id);
    document.getElementById('conteudo-painel').innerHTML = `
        <div class="panel-header-pro"><h2>Dados da Requisição</h2></div>
        <div class="users-flow-pro">
            <div class="u-box"><div class="av-pro">${r.entregue ? r.entregue[0] : '?'}</div><span>${r.entregue}</span><small>Entregue</small></div>
            <div class="u-arrow">⇄</div>
            <div class="u-box"><div class="av-pro">${r.req[0]}</div><span>${r.req}</span><small>Requisitante</small></div>
        </div>
        <div style="padding:15px; background:rgba(0,0,0,0.2); border-radius:10px; margin-top:15px;">
            <p style="font-size:0.8rem; color:#94a3b8;">FINALIDADE:</p>
            <p style="font-weight:600;">${r.fin || 'Não informada'}</p>
        </div>
        <div class="materials-list-pro"><label>Materiais Retirados</label>${r.materiais.map(m => `<div class="mat-item-pro">🔹 ${m}</div>`).join('')}</div>`;
    document.getElementById('panel-sistema').classList.add('active');
}

function fecharPainel() { document.getElementById('panel-sistema').classList.remove('active'); }
function excluirProd(idx) { if(confirm("Excluir item?")) { estoque.splice(idx, 1); renderTabelas(); } }
function verificarAdmin(btn) { if(prompt("Senha ADM:") === "123") switchTab('gestao', btn); else alert("Negado"); }

function filtrarTabela(idTabela, termo) {
    const b = termo.toUpperCase();
    const r = document.getElementById(idTabela).getElementsByTagName('tr');
    for (let row of r) row.style.display = row.innerText.toUpperCase().includes(b) ? "" : "none";
}
function filtrarPorPeriodo() {
    const inicioStr = document.getElementById('data-inicio').value;
    const fimStr = document.getElementById('data-fim').value;

    if (!inicioStr || !fimStr) {
        alert("Por favor, selecione as duas datas para o período.");
        return;
    }

    const dataInicio = new Date(inicioStr);
    const dataFim = new Date(fimStr);
    
    // Ajustamos a data fim para o final do dia
    dataFim.setHours(23, 59, 59);

    const linhas = document.getElementById('corpo-requisicoes').getElementsByTagName('tr');

    for (let row of linhas) {
        // Pega o texto da segunda coluna (Data) - índice 1
        const dataTabelaStr = row.cells[1].innerText; 
        
        // Converte "dd/mm/aaaa" para Objeto Date
        const partes = dataTabelaStr.split('/');
        const dataFormatada = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);

        // Verifica se a data está dentro do intervalo
        if (dataFormatada >= dataInicio && dataFormatada <= dataFim) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}


// 2. FUNÇÕES DO MODAL DE COLETA (LÓGICA LIMPA)
function abrirModalColeta() {
    fecharPainel(); // Fecha a gaveta de detalhes antes
    const modal = document.getElementById('modal-coleta');
    if (modal) {
        modal.classList.add('active');
        console.log("🚀 Modal de Coleta aberto com sucesso!");
    } else {
        console.error("❌ Erro: O ID 'modal-coleta' não foi encontrado no seu HTML.");
    }
}

function fecharModalColeta() {
    const modal = document.getElementById('modal-coleta');
    if (modal) {
        modal.classList.remove('active');
        // Limpa os dados temporários ao fechar
        materiaisTemporariosColeta = [];
    }
}
// Troca de Aba (SPA) - Força o fechamento de tudo ao navegar
function switchTab(tab, btn) {
    // Fecha qualquer coisa aberta para liberar o mouse
    fecharPainel();
    fecharModalColeta();

    // Lógica de esconder/mostrar containers
    document.querySelectorAll('.container').forEach(c => {
        c.style.display = 'none';
        c.classList.remove('visible');
    });

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const abaAlvo = document.getElementById('tab-' + tab);
    if(abaAlvo) {
        abaAlvo.style.display = 'block';
        abaAlvo.classList.add('visible');
    }
    
    btn.classList.add('active');

    if(tab === 'coleta') renderColetas();
}
// Troca de Aba (SPA) - Força o fechamento de tudo ao navegar

function adicionarMaterialLista() {
    const cod = document.getElementById('temp-cod').value;
    const desc = document.getElementById('temp-desc').value;
    const qtd = document.getElementById('temp-qtd').value;

    if(!cod || !desc) { alert("Preencha os dados do material!"); return; }

    const item = { cod, desc, qtd };
    materiaisTemporariosColeta.push(item);

    // Atualiza visualização na direita
    renderListaMateriaisColeta();

    // Limpa campos de inserção
    document.getElementById('temp-cod').value = "";
    document.getElementById('temp-desc').value = "";
    document.getElementById('temp-qtd').value = "1";
}

function renderListaMateriaisColeta() {
    const lista = document.getElementById('lista-materiais-coleta');
    lista.innerHTML = materiaisTemporariosColeta.map((m, index) => `
        <div style="background: var(--dark-card); padding: 12px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--magenta);">
            <div>
                <strong style="display:block; font-size:0.9rem;">${m.desc}</strong>
                <small style="color: var(--text-dim);">Cód: ${m.cod} | Qtd: ${m.qtd}</small>
            </div>
            <button onclick="materiaisTemporariosColeta.splice(${index}, 1); renderListaMateriaisColeta();" style="background:none; border:none; color:#ef4444; cursor:pointer;">✕</button>
        </div>
    `).join('');
}

function salvarNovaColeta() {
    const pedido = document.getElementById('c-pedido').value;
    const solicitante = document.getElementById('c-solicitante').value;

    if(!pedido || materiaisTemporariosColeta.length === 0) {
        alert("Preencha o número do pedido e adicione ao menos um material!");
        return;
    }

    const novaColeta = {
        id: Date.now().toString().slice(-3), // Simula ID #919, #920...
        solicitante: solicitante,
        pedido: pedido,
        data: new Date().toISOString(),
        status: "pendente",
        materiais: [...materiaisTemporariosColeta]
    };

    coletas.unshift(novaColeta); // Adiciona ao banco de coletas
    if(typeof renderColetas === "function") renderColetas(); // Atualiza a aba Coleta
    
    fecharModalColeta();
    alert("✅ Coleta solicitada com sucesso!");
}

// Função para apagar o produto do estoque
function excluirProdPorId(id) {
    if (confirm("⚠️ Tem certeza que deseja remover este material?")) {
        // Filtra o array para remover o item
        estoque = estoque.filter(item => String(item.id) !== String(id));
        // Atualiza a tela para o item sumir na hora
        renderTabelas(); 
        alert("✅ Item removido!");
    }
}

// Função para editar (carregar os dados no formulário)
function editarProd(id) {
    const item = estoque.find(i => String(i.id) === String(id));
    if (item) {
        document.getElementById('f-cod').value = item.cod;
        document.getElementById('f-desc').value = item.desc;
        document.getElementById('f-qtd').value = item.qtd;
        document.getElementById('f-loc').value = item.loc || "";
        
        // Dica: você pode focar no primeiro campo para facilitar
        document.getElementById('f-cod').focus();
        alert("📝 Dados carregados! Altere e salve o novo produto.");
    }
}
