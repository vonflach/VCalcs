// ══ FEEDBACK ══
const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScgjZ9Xr1WSdK-P_TGji7AVjuDQVzEd8m6bWI4zzhED85HqzA/formResponse";
const ENTRY_TIPO = "entry.413170715";
const ENTRY_CALC = "entry.911018413";
const ENTRY_MENSAGEM = "entry.1693095466";

function abrirFeedback() {
  document.getElementById("fb-tipo").value = "Sugestão";
  document.getElementById("fb-calc").value = "";
  document.getElementById("fb-mensagem").value = "";
  document.getElementById("fb-status").textContent = "";
  document.getElementById("modal-feedback").classList.remove("escondido");
}

function fecharFeedback() {
  document.getElementById("modal-feedback").classList.add("escondido");
}

function fecharFeedbackOverlay(e) {
  if (e.target.id === "modal-feedback") fecharFeedback();
}

async function enviarFeedback() {
  const tipo = document.getElementById("fb-tipo").value;
  const calc = document.getElementById("fb-calc").value.trim();
  const msg = document.getElementById("fb-mensagem").value.trim();
  const status = document.getElementById("fb-status");

  if (!calc) {
    status.textContent = "Informe a calculadora relacionada.";
    status.className = "fb-status fb-erro";
    return;
  }

  if (!msg) {
    status.textContent = "Escreva uma mensagem antes de enviar.";
    status.className = "fb-status fb-erro";
    return;
  }

  const body = new FormData();
  body.append(ENTRY_TIPO, tipo);
  body.append(ENTRY_CALC, calc);
  body.append(ENTRY_MENSAGEM, msg);

  try {
    await fetch(FEEDBACK_URL, { method: "POST", mode: "no-cors", body });
    status.textContent = "Feedback enviado! Obrigado.";
    status.className = "fb-status fb-ok";
    document.getElementById("fb-calc").value = "";
    document.getElementById("fb-mensagem").value = "";
    setTimeout(fecharFeedback, 2000);
  } catch {
    status.textContent = "Erro ao enviar. Tente novamente.";
    status.className = "fb-status fb-erro";
  }
}
