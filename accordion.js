// accordion.js — componente global de Referências / Fórmula / Cuidados

function montarAccordion(refs, formula, cuidados) {
  return `
    <div class="info-accordion">
      <div class="info-tabs">
        <button class="info-tab" data-target="acc-refs">Referências</button>
        <button class="info-tab" data-target="acc-formula">Fórmula</button>
        <button class="info-tab" data-target="acc-cuidados">Cuidados</button>
      </div>
      <div id="acc-refs"     class="info-body">${refs}</div>
      <div id="acc-formula"  class="info-body">${formula}</div>
      <div id="acc-cuidados" class="info-body">${cuidados}</div>
    </div>`;
}

function iniciarAccordion() {
  document.querySelectorAll(".info-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var alvo = this.dataset.target;
      var corpo = document.getElementById(alvo);
      var jaAtivo = this.classList.contains("ativo");

      document.querySelectorAll(".info-tab").forEach(function (t) {
        t.classList.remove("ativo");
      });
      document.querySelectorAll(".info-body").forEach(function (b) {
        b.classList.remove("visivel");
      });

      if (!jaAtivo) {
        this.classList.add("ativo");
        corpo.classList.add("visivel");
      }
    });
  });
}
