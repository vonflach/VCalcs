// app.js — VCalcs v2
// Navegação sidebar, filtro por área, carregamento de calcs e utilitários via fetch.
// Depende de registro.js e registro-utilitarios.js (carregados antes no index.html)

document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos ---
  const campoBusca = document.getElementById("campo-busca-sidebar");
  const campoBuscaTopbar = document.getElementById("campo-busca-topbar");
  const listaEl = document.getElementById("lista-calculadoras");
  const listaUtils = document.getElementById("lista-utilitarios");
  const areaCalculadora = document.getElementById("area-calculadora");
  const areaUtilitarios = document.getElementById("area-utilitarios");
  const areaInfo = document.getElementById("area-info");
  const homeEl = document.getElementById("home");
  const filtroTabs = document.getElementById("filtro-tabs");
  const secaoTitulo = document.getElementById("secao-titulo");
  const secaoSub = document.getElementById("secao-sub");
  const secaoSubUtils = document.getElementById("secao-sub-utils");
  const filtroTabsUtils = document.getElementById("filtro-tabs-utils");

  // Estado atual
  let secaoAtiva = "calcs"; // "calcs" | "utils" | "info"
  let filtroArea = "todas"; // área selecionada nas tabs
  let filtroAreaUtils = "todas"; // área selecionada nas tabs de utilitários
  let termoBusca = ""; // texto do campo de busca

  function renderizarFiltros(registro, container, callbackFiltro) {
    container.innerHTML = "";
    const areas = [
      ...new Set(registro.map((c) => c.area).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));

    // Só renderiza se houver mais de uma área
    if (areas.length <= 1) {
      container.style.display = "none";
      return;
    }

    const btnTodas = document.createElement("button");
    btnTodas.className = "filtro-tab ativo";
    btnTodas.textContent = "Todas";
    btnTodas.onclick = () => callbackFiltro(btnTodas, "todas");
    container.appendChild(btnTodas);

    areas.forEach((area) => {
      const btn = document.createElement("button");
      btn.className = "filtro-tab";
      btn.textContent = area;
      btn.onclick = () => callbackFiltro(btn, area);
      container.appendChild(btn);
    });
  }

  // --- Ordenação ---
  function ordenarPorNome(lista) {
    return [...lista].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
    );
  }

  // --- KaTeX ---
  function renderizarKatex(elemento) {
    if (typeof renderMathInElement !== "undefined") {
      renderMathInElement(elemento, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "$$", right: "$$", display: true },
        ],
      });
    }
  }

  // ═══════════════════════════════════════════
  //  CALCULADORAS
  // ═══════════════════════════════════════════

  function calcsFiltradas() {
    let lista = registroCalculadoras;

    // Filtro por busca
    if (termoBusca) {
      const t = termoBusca.toLowerCase();
      lista = lista.filter(
        (c) =>
          c.nome.toLowerCase().includes(t) ||
          c.descricao.toLowerCase().includes(t) ||
          c.tags.some((tag) => tag.toLowerCase().includes(t)),
      );
    }

    // Filtro por área (ignora se busca ativa ou "todas")
    if (filtroArea !== "todas" && !termoBusca) {
      lista = lista.filter((c) => c.area === filtroArea);
    }

    return ordenarPorNome(lista);
  }

  function renderizarCalcs() {
    const lista = calcsFiltradas();
    listaEl.innerHTML = "";

    secaoSub.textContent = `${lista.length} calculadora${lista.length !== 1 ? "s" : ""}`;

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

  async function carregarCalculadora(calc) {
    try {
      const resposta = await fetch(calc.caminho);
      if (!resposta.ok)
        throw new Error(`Não foi possível carregar ${calc.caminho}`);

      const html = await resposta.text();
      areaCalculadora.innerHTML = html;

      areaCalculadora.querySelectorAll("script").forEach((scriptAntigo) => {
        const scriptNovo = document.createElement("script");
        scriptNovo.textContent = scriptAntigo.textContent;
        scriptAntigo.replaceWith(scriptNovo);
      });

      renderizarKatex(areaCalculadora);

      // Atualiza header da seção
      secaoTitulo.textContent = calc.nome;
      secaoSub.textContent = calc.area;

      // Esconde home, mostra calc
      homeEl.classList.add("escondido");
      areaUtilitarios.classList.add("escondido");
      areaInfo.classList.add("escondido");
      areaCalculadora.classList.remove("escondido");

      // Listener para Enter
      areaCalculadora.querySelectorAll("input").forEach((input) => {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const btn = areaCalculadora.querySelector(".calc-btn");
            if (btn) {
              input.blur();
              btn.click();
            }
          }
        });
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      areaCalculadora.innerHTML = `<p class="mensagem-erro">Erro ao carregar a calculadora. Tente novamente.</p>`;
      homeEl.classList.add("escondido");
      areaCalculadora.classList.remove("escondido");
      console.error(erro);
    }
  }

  // ═══════════════════════════════════════════
  //  UTILITÁRIOS
  // ═══════════════════════════════════════════

  function renderizarUtilitarios() {
    let lista = registroUtilitarios;

    if (termoBusca) {
      const t = termoBusca.toLowerCase();
      lista = lista.filter(
        (u) =>
          u.nome.toLowerCase().includes(t) ||
          u.descricao.toLowerCase().includes(t) ||
          (u.tags || []).some((tag) => tag.toLowerCase().includes(t)),
      );
    } else if (filtroAreaUtils !== "todas") {
      lista = lista.filter((u) => u.area === filtroAreaUtils);
    }

    lista = ordenarPorNome(lista);
    listaUtils.innerHTML = "";

    secaoSubUtils.textContent = `${lista.length} utilitário${lista.length !== 1 ? "s" : ""}`;

    if (lista.length === 0) {
      listaUtils.innerHTML = `<p class="mensagem-vazia">Nenhum utilitário disponível.</p>`;
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
      listaUtils.appendChild(card);
    });
  }

  async function carregarUtilitario(util) {
    try {
      const resposta = await fetch(util.caminho);
      if (!resposta.ok)
        throw new Error(`Não foi possível carregar ${util.caminho}`);

      const html = await resposta.text();
      areaCalculadora.innerHTML = html;

      areaCalculadora.querySelectorAll("script").forEach((scriptAntigo) => {
        const scriptNovo = document.createElement("script");
        scriptNovo.textContent = scriptAntigo.textContent;
        scriptAntigo.replaceWith(scriptNovo);
      });

      renderizarKatex(areaCalculadora);

      secaoTitulo.textContent = util.nome;
      secaoSub.textContent = util.area;

      homeEl.classList.add("escondido");
      areaUtilitarios.classList.add("escondido");
      areaInfo.classList.add("escondido");
      areaCalculadora.classList.remove("escondido");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      areaCalculadora.innerHTML = `<p class="mensagem-erro">Erro ao carregar o utilitário. Tente novamente.</p>`;
      areaCalculadora.classList.remove("escondido");
      console.error(erro);
    }
  }

  // ═══════════════════════════════════════════
  //  NAVEGAÇÃO SIDEBAR
  // ═══════════════════════════════════════════

  window.navegarPara = function (destino) {
    secaoAtiva = destino;

    // Atualiza estado visual dos nav-items
    document
      .getElementById("nav-calcs")
      .classList.toggle("ativo", destino === "calcs");
    document
      .getElementById("nav-utils")
      .classList.toggle("ativo", destino === "utils");
    document
      .getElementById("nav-info")
      .classList.toggle("ativo", destino === "info");

    // Limpa calc carregada
    areaCalculadora.classList.add("escondido");
    areaCalculadora.innerHTML = "";

    // Esconde tudo
    homeEl.classList.add("escondido");
    areaUtilitarios.classList.add("escondido");
    areaInfo.classList.add("escondido");
    filtroTabs.style.display = "none";

    if (destino === "calcs") {
      homeEl.classList.remove("escondido");
      filtroTabs.style.display = "flex";
      secaoTitulo.textContent = "Calculadoras";
      // Reseta filtro de área ao mudar de seção
      filtroArea = "todas";
      renderizarFiltros(registroCalculadoras, filtroTabs, filtrarArea);
      renderizarCalcs();
    } else if (destino === "utils") {
      filtroAreaUtils = "todas"; // ← adiciona
      areaUtilitarios.classList.remove("escondido");
      renderizarFiltros(registroUtilitarios, filtroTabsUtils, filtrarAreaUtils);
      renderizarUtilitarios();
    } else if (destino === "info") {
      areaInfo.classList.remove("escondido");
      secaoTitulo.textContent = "Sobre o VCalcs";
      secaoSub.textContent = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ═══════════════════════════════════════════
  //  FILTRO POR ÁREA (tabs)
  // ═══════════════════════════════════════════

  window.filtrarArea = function (el, area) {
    filtroArea = area;
    aplicarBusca("");
    document
      .querySelectorAll(".filtro-tab")
      .forEach((t) => t.classList.remove("ativo"));
    el.classList.add("ativo");
    renderizarCalcs();
  };

  window.filtrarAreaUtils = function (el, area) {
    filtroAreaUtils = area;
    aplicarBusca("");
    document
      .querySelectorAll("#filtro-tabs-utils .filtro-tab")
      .forEach((t) => t.classList.remove("ativo"));
    el.classList.add("ativo");
    renderizarUtilitarios();
  };

  // ═══════════════════════════════════════════
  //  BUSCA (sidebar — afeta seção ativa)
  // ═══════════════════════════════════════════

  function aplicarBusca(valor) {
    termoBusca = valor;
    campoBusca.value = valor;
    campoBuscaTopbar.value = valor;

    // Reseta visual das tabs de filtro
    if (valor) {
      document
        .querySelectorAll("#filtro-tabs .filtro-tab")
        .forEach((t) => t.classList.remove("ativo"));
      document
        .querySelector("#filtro-tabs .filtro-tab")
        ?.classList.add("ativo"); // marca "Todas"
      document
        .querySelectorAll("#filtro-tabs-utils .filtro-tab")
        .forEach((t) => t.classList.remove("ativo"));
      document
        .querySelector("#filtro-tabs-utils .filtro-tab")
        ?.classList.add("ativo"); // marca "Todas"
    }

    if (secaoAtiva === "calcs") {
      renderizarCalcs();
    } else if (secaoAtiva === "utils") {
      renderizarUtilitarios();
    }
  }

  campoBusca.addEventListener("input", (e) =>
    aplicarBusca(e.target.value.trim()),
  );
  campoBuscaTopbar.addEventListener("input", (e) =>
    aplicarBusca(e.target.value.trim()),
  );

  // ═══════════════════════════════════════════
  //  LOGO → volta para home de calcs
  // ═══════════════════════════════════════════

  document.getElementById("logo").addEventListener("click", () => {
    aplicarBusca("");
    navegarPara("calcs");
  });

  document.getElementById("logo-topbar").addEventListener("click", () => {
    aplicarBusca("");
    navegarPara("calcs");
  });

  // ═══════════════════════════════════════════
  //  Impedir scroll em campos number (evita scroll acidental)
  // ═══════════════════════════════════════════

  document.addEventListener(
    "wheel",
    (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    },
    { passive: true },
  );

  // ═══════════════════════════════════════════
  //  INICIALIZAÇÃO
  // ═══════════════════════════════════════════

  filtroTabs.style.display = "flex";
  renderizarFiltros(registroCalculadoras, filtroTabs, filtrarArea);
  renderizarCalcs();
});
