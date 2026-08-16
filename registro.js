// registro.js
// Catálogo central de todas as calculadoras do VCalcs.
// Para adicionar uma nova calculadora no futuro:
//   1. Crie a pasta em calculadoras/[id]/index.html
//   2. Adicione um novo objeto aqui embaixo, seguindo o mesmo padrão
//   3. Pronto — o app.js lê este arquivo e monta a tela inicial sozinho
//      (ordenação alfabética e busca já funcionam automaticamente)

const registroCalculadoras = [
  {
    id: "pam",
    nome: "Pressão Arterial Média (PAM)",
    descricao: "Calcula a pressão arterial média a partir da PAS e PAD, com interpretação de perfusão.",
    area: "Cardiologia",
    tags: ["pressão arterial", "PAM", "hemodinâmica", "perfusão", "cardiologia"],
    caminho: "calculadoras/pam/index.html"
  },
  {
    id: "rac",
    nome: "Relação Albumina-Creatinina (RAC)",
    descricao: "Calcula a RAC urinária e classifica o estágio de albuminúria conforme critérios KDIGO.",
    area: "Nefrologia",
    tags: ["albuminúria", "RAC", "KDIGO", "função renal", "nefropatia", "nefrologia"],
    caminho: "calculadoras/rac/index.html"
  },
  {
    id: "osm",
    nome: "Osmolaridade Plasmática",
    descricao: "Calcule a osmolaridade plásmatica a partir dos eletrólitos e compare com a osmolaridade sérica encontrada.",
    area: "Nefrologia",
    tags: ["osmolaridade", "plasma", "eletrólitos", "função renal", "nefrologia", "sódio", "potássio", "glicose", "ureia"],
    caminho: "calculadoras/osm/index.html"
  }
];