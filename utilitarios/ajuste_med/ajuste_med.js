(function () {
  // Catálogo interno das classes medicamentosas (adicione novos JSONs aqui)
  const classesDisponiveis = [
    {
      id: "antidiabeticos",
      nome: "Antidiabéticos",
      descricao:
        "Ajuste de antidiabéticos orais e injetáveis, conforme necessário.",
      caminho: "utilitarios/ajuste_med/data/antidiabeticos.json",
    },
    {
      id: "anticoagulantes",
      nome: "Anticoagulantes",
      descricao:
        "Ajuste de anticoagulantes orais e injetáveis, conforme necessário.",
      caminho: "utilitarios/ajuste_med/data/anticoagulantes.json",
    },
  ];

  let classeAtualDados = null; // Armazena o JSON carregado da classe atual

  // Função global exclusiva de inicialização
  window.iniciarAjusteMed = function () {
    renderizarHome();
  };

  // Função global para manipular o accordion
  window.toggleFarmaco = function (index) {
    const body = document.getElementById(`am-body-${index}`);
    const chevron = document.getElementById(`am-chevron-${index}`);

    if (body.classList.contains("open")) {
      body.classList.remove("open");
      chevron.classList.remove("open");
    } else {
      body.classList.add("open");
      chevron.classList.add("open");
    }
  };

  // Helper para sempre buscar o container fresco no DOM
  function getContainer() {
    return document.querySelector(".ajuste-med");
  }

  // --- ESTADO 1: HOME ---
  function renderizarHome() {
    const container = getContainer();
    if (!container) return;

    let html = `<h2>Ajuste por Função Renal</h2><div class="ajuste-med-cards">`;

    classesDisponiveis.forEach((c) => {
      // Usando data-id para delegação de eventos ou onclick direto
      html += `
        <div class="card-calculadora ajuste-med-card" onclick="window.abrirClasse('${c.id}')">
          <h3>${c.nome}</h3>
          <p>${c.descricao}</p>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // Como precisamos expor essa função para o onclick do HTML gerado dinamicamente:
  window.abrirClasse = async function (id) {
    const container = getContainer();
    if (!container) return;

    const classeMeta = classesDisponiveis.find((c) => c.id === id);
    if (!classeMeta) return;

    container.innerHTML = `<p>Carregando dados de ${classeMeta.nome}...</p>`;

    try {
      const resposta = await fetch(classeMeta.caminho);
      classeAtualDados = await resposta.json();
      renderizarClasse();
    } catch (erro) {
      console.error(erro);
      container.innerHTML = `
        <div class="mensagem-erro">Erro ao carregar os dados.</div>
        <button class="btn-voltar" onclick="window.iniciarAjusteMed()">← Voltar</button>
      `;
    }
  };

  // --- ESTADO 2: CLASSE E FÁRMACOS ---
  function renderizarClasse() {
    const container = getContainer();
    if (!container || !classeAtualDados) return;

    // Busca TFGe previamente salva pela calculadora CKD-EPI
    const tfgeSalva = sessionStorage.getItem("vcalcs_tfge");
    const valorInicial = tfgeSalva ? Number(tfgeSalva).toFixed(1) : "";
    const badgeHtml = tfgeSalva
      ? `<span class="badge-tfge" id="am-badge-tfge">Calculada recentemente: ${valorInicial} mL/min</span>`
      : `<span class="badge-tfge escondido" id="am-badge-tfge"></span>`;

    let html = `
      <div class="ajuste-med-header">
        <button class="btn-voltar" onclick="window.iniciarAjusteMed()">← Voltar</button>
        <h2>${classeAtualDados.classe}</h2>
      </div>

      <div class="tfge-container">
        <label for="am-input-tfge"><strong>Informe a TFGe (mL/min/1,73m²):</strong></label>
        <div class="tfge-input-group">
          <input type="number" id="am-input-tfge" placeholder="Ex: 45" value="${valorInicial}" step="0.1">
          ${badgeHtml}
        </div>
      </div>

      <div class="am-lista-farmacos">
    `;

    // Renderiza a estrutura do accordion
    classeAtualDados.farmacos.forEach((farmaco, index) => {
      html += `
        <div class="am-accordion-item">
          <div class="am-accordion-header" onclick="window.toggleFarmaco(${index})">
            <div class="am-accordion-title-group">
              <span class="am-chevron" id="am-chevron-${index}">▸</span>
              <span>${farmaco.farmaco}</span>
            </div>
            <!-- O badge começa vazio/escondido e é populado via JS na função de atualização -->
            <span id="am-badge-rec-${index}" class="badge-rec escondido"></span>
          </div>
          <div class="am-accordion-body" id="am-body-${index}">
            <p><strong>Classe:</strong> ${farmaco.classe}</p>
            <p style="margin-top:10px;"><strong>Via de Eliminação:</strong> ${farmaco.via_eliminacao}</p>
            <!-- Container dinâmico para a recomendação -->
            <div id="am-rec-texto-${index}"></div>
            <p style="margin-top:10px;"><strong>Cuidados e Riscos:</strong> ${farmaco.cuidados_e_riscos}</p>
          </div>
        </div>
      `;
    });

    html += `</div>`; // Fecha lista-farmacos

    // Renderiza Referências usando suas classes padrão
    if (
      classeAtualDados.referencias &&
      classeAtualDados.referencias.length > 0
    ) {
      html += `
        <div class="references" style="margin-top: 30px;">
          <h4 class="references-title">Referências Bibliográficas</h4>
          <ul class="references-list">
            ${classeAtualDados.referencias.map((ref) => `<li class="references-item">${ref.texto}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    container.innerHTML = html;

    // Configura o listener de input para atualizar ao digitar, sem perder o foco ou fechar accordions
    const inputTfge = document.getElementById("am-input-tfge");
    inputTfge.addEventListener("input", atualizarRecomendacoesDinamicamente);

    // Executa a primeira vez caso haja valor salvo na sessionStorage
    atualizarRecomendacoesDinamicamente();
  }

  // --- LÓGICA DE AVALIAÇÃO DE REGRAS E DOM ---
  function atualizarRecomendacoesDinamicamente() {
    const input = document.getElementById("am-input-tfge");
    if (!input) return;

    const tfge = parseFloat(input.value);
    const badgeRecente = document.getElementById("am-badge-tfge");

    // Se usuário digitou algo novo, esconde o badge "Calculada recentemente"
    if (badgeRecente && input.value !== sessionStorage.getItem("vcalcs_tfge")) {
      badgeRecente.classList.add("escondido");
    }

    // Avalia cada fármaco e injeta o texto diretamente nos nós específicos
    classeAtualDados.farmacos.forEach((farmaco, index) => {
      const badgeDOM = document.getElementById(`am-badge-rec-${index}`);
      const textoRecDOM = document.getElementById(`am-rec-texto-${index}`);

      if (isNaN(tfge)) {
        badgeDOM.className = "badge-rec escondido";
        badgeDOM.textContent = "";
        textoRecDOM.innerHTML = "";
        return;
      }

      const recEncontrada = interpretarFaixa(tfge, farmaco.ajustes);

      if (recEncontrada) {
        const categoriaCss = definirCorBadge(recEncontrada.recomendacao);
        const textoBadge = resumirBadge(recEncontrada.recomendacao);

        badgeDOM.className = `badge-rec ${categoriaCss}`;
        badgeDOM.textContent = textoBadge;

        textoRecDOM.innerHTML = `<p style="margin-top:10px; color: var(--cor-vermelho);"><strong>Recomendação (${recEncontrada.faixa} mL/min):</strong> ${recEncontrada.recomendacao}</p>`;
      } else {
        badgeDOM.className = "badge-rec escondido";
        textoRecDOM.innerHTML = `<p style="margin-top:10px;"><strong>Recomendação:</strong> Nenhuma diretriz específica encontrada para este valor de TFGe.</p>`;
      }
    });
  }

  // Avaliador de expressões lógicas e de intervalos do JSON
  function interpretarFaixa(valor, ajustes) {
    for (let ajuste of ajustes) {
      let faixa = ajuste.faixa.trim();

      if (faixa.startsWith("≥")) {
        if (valor >= parseFloat(faixa.replace("≥", ""))) return ajuste;
      } else if (faixa.startsWith(">")) {
        if (valor > parseFloat(faixa.replace(">", ""))) return ajuste;
      } else if (faixa.startsWith("≤")) {
        if (valor <= parseFloat(faixa.replace("≤", ""))) return ajuste;
      } else if (faixa.startsWith("<")) {
        if (valor < parseFloat(faixa.replace("<", ""))) return ajuste;
      } else if (faixa.includes("–") || faixa.includes("-")) {
        // Suporta travessão longo (–) e hífen normal (-)
        let partes = faixa.split(/[-–]/);
        if (partes.length === 2) {
          let min = parseFloat(partes[0]);
          let max = parseFloat(partes[1]);
          if (valor >= min && valor <= max) return ajuste;
        }
      }
    }
    return null;
  }

  // Retorna a classe CSS baseada no texto da recomendação
  function definirCorBadge(texto) {
    const txt = texto.toLowerCase();
    if (txt.includes("contraindicad") || txt.includes("não recomendado"))
      return "rec-contraindicado";
    if (
      txt.includes("cautela") ||
      txt.includes("reduzir") ||
      txt.includes("máxima") ||
      txt.includes("ajuste")
    )
      return "rec-cautela";
    if (txt.includes("habitual")) return "rec-normal";
    return "rec-cautela"; // Default para alertas
  }

  // Cria um resumo para caber bonito no badge do Header do Accordion
  function resumirBadge(texto) {
    const txt = texto.toLowerCase();
    if (txt.includes("contraindicad")) return "Contraindicado";
    if (
      txt.includes("cautela") ||
      txt.includes("máxima") ||
      txt.includes("monitorizar")
    )
      return "Ajuste / Cautela";
    if (txt.includes("habitual")) return "Sem ajustes necessários";
    return "Requer Atenção";
  }
})();
