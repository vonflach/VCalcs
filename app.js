// app.js
// Responsável por: ordenar/filtrar o registro, renderizar a home (cards + busca),
// carregar calculadoras e utilitários dinamicamente via fetch,
// e gerenciar a navegação inferior entre abas.
//
// Depende de registro.js e registro-utilitarios.js (carregados ANTES no index.html)

document.addEventListener("DOMContentLoaded", () => {

  // --- Elementos ---
  const campoBusca      = document.getElementById("campo-busca");
  const listaEl         = document.getElementById("lista-calculadoras");
  const areaCalculadora = document.getElementById("area-calculadora");
  const areaUtilitarios = document.getElementById("area-utilitarios");
  const listaUtilitarios = document.getElementById("lista-utilitarios");
  const homeEl          = document.getElementById("home");
  const btnVoltar       = document.getElementById("btn-voltar");
  const btnInfo         = document.getElementById("btn-info");
  const modalOverlay    = document.getElementById("modal-overlay");
  const btnFecharModal  = document.getElementById("btn-fechar-modal");
  const campoBuscaUtils = document.getElementById("campo-busca-utilitarios");


  // --- Utilitário: ordenar por nome ---
  function ordenarPorNome(lista) {
    return [...lista].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );
  }

  // --- KaTeX helper ---
  function renderizarKatex(elemento) {
    if (typeof renderMathInElement !== "undefined") {
      renderMathInElement(elemento, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "$$", right: "$$", display: true }
        ]
      });
    }
  }

  // ═══════════════════════════════════════════
  //  CALCULADORAS
  // ═══════════════════════════════════════════

  function renderizarLista(lista) {
    listaEl.innerHTML = "";

    if (lista.length === 0) {
      listaEl.innerHTML = `<p class="mensagem-vazia">Nenhuma calculadora encontrada.</p>`;
      return;
    }

    lista.forEach((calc) => {
      const card = document.createElement("div");
      card.className = "card-calculadora";
      card.innerHTML = `
        <h3>${calc.nome}</h3>
        <p>${calc.descricao}</p>
        <span class="card-area">${calc.area}</span>
      `;
      card.addEventListener("click", () => carregarCalculadora(calc));
      listaEl.appendChild(card);
    });
  }

  function filtrarCalculadoras(texto) {
    const termo = texto.trim().toLowerCase();
    if (termo === "") return ordenarPorNome(registroCalculadoras);

    const filtradas = registroCalculadoras.filter((calc) => {
      const nomeMatch = calc.nome.toLowerCase().includes(termo);
      const descMatch = calc.descricao.toLowerCase().includes(termo);
      const tagsMatch = calc.tags.some((tag) => tag.toLowerCase().includes(termo));
      return nomeMatch || descMatch || tagsMatch;
    });

    return ordenarPorNome(filtradas);
  }

  async function carregarCalculadora(calc) {
    try {
      const resposta = await fetch(calc.caminho);
      if (!resposta.ok) throw new Error(`Não foi possível carregar ${calc.caminho}`);

      const html = await resposta.text();
      areaCalculadora.innerHTML = html;

      areaCalculadora.querySelectorAll("script").forEach((scriptAntigo) => {
        const scriptNovo = document.createElement("script");
        scriptNovo.textContent = scriptAntigo.textContent;
        scriptAntigo.replaceWith(scriptNovo);
      });

      renderizarKatex(areaCalculadora);
      mostrarCalculadora();
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (erro) {
      areaCalculadora.innerHTML = `<p class="mensagem-erro">Erro ao carregar a calculadora. Tente novamente.</p>`;
      mostrarCalculadora();
      console.error(erro);
    }
  }

  function mostrarCalculadora() {
    homeEl.classList.add("escondido");
    areaUtilitarios.classList.add("escondido");
    areaCalculadora.classList.remove("escondido");
    btnVoltar.classList.remove("escondido");
  }

  // ═══════════════════════════════════════════
  //  UTILITÁRIOS
  // ═══════════════════════════════════════════

  function renderizarUtilitarios(lista = ordenarPorNome(registroUtilitarios)) {
    listaUtilitarios.innerHTML = "";

    if (registroUtilitarios.length === 0) {
      listaUtilitarios.innerHTML = `<p class="mensagem-vazia">Nenhum utilitário disponível.</p>`;
      return;
    }

    lista.forEach((util) => {
      const card = document.createElement("div");
      card.className = "card-calculadora";
      card.innerHTML = `
        <h3>${util.nome}</h3>
        <p>${util.descricao}</p>
        <span class="card-area">${util.area}</span>
      `;
      card.addEventListener("click", () => carregarUtilitario(util));
      listaUtilitarios.appendChild(card);
    });
  }

  function filtrarUtilitarios(texto) {
  const termo = texto.trim().toLowerCase();
  if (termo === "") return ordenarPorNome(registroUtilitarios);

  return ordenarPorNome(registroUtilitarios.filter(util =>
    util.nome.toLowerCase().includes(termo) ||
    util.descricao.toLowerCase().includes(termo) ||
    util.tags.some(tag => tag.toLowerCase().includes(termo))
    ));
  }

  async function carregarUtilitario(util) {
    try {
      const resposta = await fetch(util.caminho);
      if (!resposta.ok) throw new Error(`Não foi possível carregar ${util.caminho}`);

      const html = await resposta.text();
      areaCalculadora.innerHTML = html;

      areaCalculadora.querySelectorAll("script").forEach((scriptAntigo) => {
        const scriptNovo = document.createElement("script");
        scriptNovo.textContent = scriptAntigo.textContent;
        scriptAntigo.replaceWith(scriptNovo);
      });

      renderizarKatex(areaCalculadora);

      areaUtilitarios.classList.add("escondido");
      areaCalculadora.classList.remove("escondido");
      btnVoltar.classList.remove("escondido");
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (erro) {
      areaCalculadora.innerHTML = `<p class="mensagem-erro">Erro ao carregar o utilitário. Tente novamente.</p>`;
      areaUtilitarios.classList.add("escondido");
      areaCalculadora.classList.remove("escondido");
      btnVoltar.classList.remove("escondido");
      console.error(erro);
    }
  }

  // ═══════════════════════════════════════════
  //  NAVEGAÇÃO INFERIOR
  // ═══════════════════════════════════════════

  window.navegarPara = function(destino) {
    document.getElementById("nav-calcs").classList.toggle("ativo", destino === "calcs");
    document.getElementById("nav-utils").classList.toggle("ativo", destino === "utils");

    // Limpa área de calculadora ao trocar de aba
    areaCalculadora.classList.add("escondido");
    areaCalculadora.innerHTML = "";
    btnVoltar.classList.add("escondido");

    if (destino === "calcs") {
      areaUtilitarios.classList.add("escondido");
      homeEl.classList.remove("escondido");
      campoBusca.value = "";
      renderizarLista(ordenarPorNome(registroCalculadoras));

    } else {
      homeEl.classList.add("escondido");
      areaUtilitarios.classList.remove("escondido");
      campoBuscaUtils.value = "";
      renderizarUtilitarios();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ═══════════════════════════════════════════
  //  BOTÃO VOLTAR E LOGO
  // ═══════════════════════════════════════════

  function mostrarHome() {
    areaCalculadora.classList.add("escondido");
    areaCalculadora.innerHTML = "";
    btnVoltar.classList.add("escondido");

    // Volta para a aba que estava ativa
    const utilsAtivo = document.getElementById("nav-utils").classList.contains("ativo");

    if (utilsAtivo) {
      areaUtilitarios.classList.remove("escondido");
      campoBuscaUtils.value = "";
      renderizarUtilitarios();
    } else {
      homeEl.classList.remove("escondido");
      campoBusca.value = "";
      renderizarLista(ordenarPorNome(registroCalculadoras));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  btnVoltar.addEventListener("click", mostrarHome);
  document.getElementById("logo").addEventListener("click", () => navegarPara("calcs"));

  // ═══════════════════════════════════════════
  //  BUSCA
  // ═══════════════════════════════════════════

  campoBusca.addEventListener("input", (e) => {
    renderizarLista(filtrarCalculadoras(e.target.value));
  });

  campoBuscaUtils.addEventListener("input", (e) => {
  renderizarUtilitarios(filtrarUtilitarios(e.target.value));
  });

  // ═══════════════════════════════════════════
  //  MODAL
  // ═══════════════════════════════════════════

  function abrirModal() { modalOverlay.classList.remove("escondido"); }
  function fecharModal() { modalOverlay.classList.add("escondido"); }

  btnInfo.addEventListener("click", abrirModal);
  btnFecharModal.addEventListener("click", fecharModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) fecharModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });

  // ═══════════════════════════════════════════
  //  INICIALIZAÇÃO
  // ═══════════════════════════════════════════

  renderizarLista(ordenarPorNome(registroCalculadoras));

});