// app.js
// Responsável por: ordenar/filtrar o registro, renderizar a home (cards + busca)
// e carregar cada calculadora dinamicamente via fetch.
//
// Depende de registro.js (deve ser carregado ANTES deste arquivo no index.html)
// e dos seguintes elementos existirem no index.html (raiz):
//   #campo-busca        -> <input> de busca
//   #lista-calculadoras  -> <div> onde os cards são renderizados
//   #area-calculadora    -> <div> onde o HTML da calc carregada é injetado
//   #home                -> <div> que envolve busca + lista (escondida ao abrir uma calc)
//   #btn-voltar          -> botão "< Voltar" (escondido na home)

document.addEventListener("DOMContentLoaded", () => {
  const campoBusca = document.getElementById("campo-busca");
  const listaEl = document.getElementById("lista-calculadoras");
  const areaCalculadora = document.getElementById("area-calculadora");
  const homeEl = document.getElementById("home");
  const btnVoltar = document.getElementById("btn-voltar");
  const btnInfo = document.getElementById("btn-info");
  const modalOverlay = document.getElementById("modal-overlay");
  const btnFecharModal = document.getElementById("btn-fechar-modal");

  // Ordena o registro por nome (A-Z), sem alterar o array original
  function ordenarPorNome(lista) {
    return [...lista].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );
  }

  // Renderiza os cards na tela a partir de uma lista (já ordenada/filtrada)
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

  // Filtra o registro pelo texto digitado (nome, descrição e tags)
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

  // Carrega o HTML da calculadora selecionada dentro de #area-calculadora
  async function carregarCalculadora(calc) {
    try {
      const resposta = await fetch(calc.caminho);
      if (!resposta.ok) throw new Error(`Não foi possível carregar ${calc.caminho}`);

      const html = await resposta.text();
      areaCalculadora.innerHTML = html;

      // Os <script> injetados via innerHTML não executam automaticamente,
      // então precisamos recriá-los manualmente para que a lógica da calc rode.
      areaCalculadora.querySelectorAll("script").forEach((scriptAntigo) => {
        const scriptNovo = document.createElement("script");
        scriptNovo.textContent = scriptAntigo.textContent;
        scriptAntigo.replaceWith(scriptNovo);
      });
      // Renderiza fórmulas KaTeX injetadas via fetch
      if (typeof renderMathInElement !== "undefined") {
       renderMathInElement(areaCalculadora, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "$$", right: "$$", display: true }
         ]
      });
    }

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
    areaCalculadora.classList.remove("escondido");
    btnVoltar.classList.remove("escondido");
  }

  function mostrarHome() {
    areaCalculadora.classList.add("escondido");
    areaCalculadora.innerHTML = "";
    btnVoltar.classList.add("escondido");
    homeEl.classList.remove("escondido");
    campoBusca.value = "";
    renderizarLista(ordenarPorNome(registroCalculadoras));
  }

  // Eventos
  campoBusca.addEventListener("input", (e) => {
    renderizarLista(filtrarCalculadoras(e.target.value));
  });

  btnVoltar.addEventListener("click", mostrarHome);

  // Logo clicável volta para home
  document.getElementById("logo").addEventListener("click", mostrarHome);

  // Modal de disclaimer/informações
  function abrirModal() {
    modalOverlay.classList.remove("escondido");
  }

  function fecharModal() {
    modalOverlay.classList.add("escondido");
  }

  btnInfo.addEventListener("click", abrirModal);
  btnFecharModal.addEventListener("click", fecharModal);

  // Fecha ao clicar fora do conteúdo (no overlay escuro)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  // Fecha com a tecla Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
  });

  // Inicialização: mostra a lista completa, ordenada, ao carregar a página
  renderizarLista(ordenarPorNome(registroCalculadoras));
});