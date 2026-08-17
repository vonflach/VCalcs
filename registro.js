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
    tags: ["pressao arterial", "PAM", "hemodinamica", "perfusao", "cardiologia"],
    caminho: "calculadoras/pam/index.html"
  },
  {
    id: "rac",
    nome: "Relação Albumina-Creatinina (RAC)",
    descricao: "Calcula a RAC urinária e classifica o estágio de albuminúria conforme critérios KDIGO.",
    area: "Nefrologia",
    tags: ["albuminuria", "RAC", "KDIGO", "funcao renal", "nefropatia", "nefrologia"],
    caminho: "calculadoras/rac/index.html"
  },
  {
    id: "osm",
    nome: "Osmolaridade Plasmática",
    descricao: "Calcule a osmolaridade plásmatica a partir dos eletrólitos e compare com a osmolaridade sérica encontrada.",
    area: "Nefrologia",
    tags: ["osmolaridade", "plasma", "eletrolitos", "funcao renal", "nefrologia", "sodio", "potassio", "glicose", "ureia"],
    caminho: "calculadoras/osm/index.html"
  },
  {
    id: "sodio-glicose",
    nome: "Sódio corrigido pela Hiperglicemia",
    descricao: "Corrija os níveis séricos de sódio pela hiperglicemia.",
    area: "Nefrologia",
    tags: ["correcao", "plasma", "eletrolitos", "nefrologia", "sodio", "glicose", "hiperglicemia"],
    caminho: "calculadoras/sodio-glicose/index.html"
  },
  {
    id: "fena",
    nome: "Fração Excretada de Sódio (FENa)",
    descricao: "Calcula a fração excretada de sódio para avaliar a função renal.",
    area: "Nefrologia",
    tags: ["fracao excretada", "sodio", "funcao renal", "nefrologia", "creatinina"],
    caminho: "calculadoras/fena/index.html"
  },
  {
  id:        "tfg",
  nome:      "Taxa de Filtração Glomerular estimada (TFGe)",
  descricao: "Estimativa da TFG pelas fórmulas Cockcroft-Gault, MDRD e CKD-EPI 2021",
  area:      "Nefrologia",
  tags:      ["tfg", "tfge", "ckd-epi", "mdrd", "cockcroft", "creatinina", "funcao renal"],
  caminho:   "calculadoras/tfg/index.html"
  },
  {
  id:        "infusao",
  nome:      "Infusão Contínua",
  descricao: "Cálculo de dose ou vazão para medicações em infusão contínua",
  area:      "Medicina Intensiva",
  tags:      ["infusao", "bomba", "vazao", "dose", "continua", "droga", "farmaco"],
  caminho:   "calculadoras/infusao/index.html"
  },
  {
  id:        "hvhs",
  nome:      "Hidração Venosa via Holliday-Segar",
  descricao: "Calcule a infusão de manutenção de líquidos em pediatria, com base no método Holliday-Segar",
  area:      "Pediatria",
  tags:      ["infusao", "bomba", "vazao", "dose", "continua", "eletrolito", "manutencao", "hidratacao", "holliday-segar", "pediatria"],
  caminho:   "calculadoras/infusao/index.html"
  }
];