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
  tags: ["pressao arterial", "PAM", "hemodinamica", "perfusao", "cardiologia", "pressão arterial", "pressão média", "pressão diastólica", "pressão sistólica"],
  caminho: "calculadoras/pam/index.html"
  },
  {
  id: "rac",
  nome: "Relação Albumina-Creatinina (RAC)",
  descricao: "Calcula a RAC urinária e classifica o estágio de albuminúria conforme critérios KDIGO.",
  area: "Nefrologia",
  tags: ["albuminuria", "RAC", "KDIGO", "funcao renal", "nefropatia", "nefrologia", "creatinina", "albumina", "urina", "função renal"],
  caminho: "calculadoras/rac/index.html"
  },
  {
  id: "osm",
  nome: "Osmolaridade Plasmática",
  descricao: "Calcule a osmolaridade plásmatica a partir dos eletrólitos e compare com a osmolaridade sérica encontrada.",
  area: "Nefrologia",
  tags: ["osmolaridade", "plasma", "eletrolitos", "funcao renal", "nefrologia", "sodio", "potassio", "glicose", "ureia", "função renal"],
  caminho: "calculadoras/osm/index.html"
  },
  {
  id: "sodio-glicose",
  nome: "Sódio corrigido pela Hiperglicemia",
  descricao: "Corrija os níveis séricos de sódio pela hiperglicemia.",
  area: "Nefrologia",
  tags: ["correcao", "plasma", "eletrolitos", "nefrologia", "sodio", "glicose", "hiperglicemia", "correção"],
  caminho: "calculadoras/sodio-glicose/index.html"
  },
  {
  id: "fena",
  nome: "Fração Excretada de Sódio (FENa)",
  descricao: "Calcula a fração excretada de sódio para avaliar a função renal.",
  area: "Nefrologia",
  tags: ["fracao excretada", "sodio", "funcao renal", "nefrologia", "creatinina", "função renal","fração"],
  caminho: "calculadoras/fena/index.html"
  },
  {
  id:        "tfg",
  nome:      "Taxa de Filtração Glomerular estimada (TFGe)",
  descricao: "Estimativa da TFG pelas fórmulas Cockcroft-Gault, MDRD e CKD-EPI 2021.",
  area:      "Nefrologia",
  tags:      ["tfg", "tfge", "ckd-epi", "mdrd", "cockcroft", "creatinina", "funcao renal", "função renal", "nefrologia"],
  caminho:   "calculadoras/tfg/index.html"
  },
  {
  id:        "infusao",
  nome:      "Infusão Contínua de Medicamentos",
  descricao: "Cálculo de dose ou vazão para medicações em infusão contínua.",
  area:      "Medicina Intensiva",
  tags:      ["infusao", "infusão", "bomba", "vazao", "dose", "continua", "droga", "farmaco"],
  caminho:   "calculadoras/infusao/index.html"
  },
  {
  id:        "hvhs",
  nome:      "Hidração Venosa via Holliday-Segar",
  descricao: "Calcule a infusão de manutenção de líquidos em pediatria, com base no método Holliday-Segar.",
  area:      "Pediatria",
  tags:      ["infusao", "bomba", "vazao", "dose", "continua", "eletrolito", "manutencao", "manutenção", "hidratacao", "hidratação", "holliday-segar", "pediatria"],
  caminho:   "calculadoras/hvhs/index.html"
  },
  {
  id:        "dpp",
  nome:      "Data Provável de Parto (DPP)",
  descricao: "Cálculo da DPP pela Regra de Naegele via DUM ou USG obstétrica.",
  area:      "Obstetrícia",
  tags:      ["dpp", "parto", "gestacao", "obstetricia", "naegele", "dum", "usg", "ig", "idade gestacional", "gestação", "obstetrícia"],
  caminho:   "calculadoras/dpp/index.html"
  },
  {
  id:        "ldl",
  nome:      "Estimativa para Colesterol LDL (LDL-c)",
  descricao: "Encontre o LDL-c segundo a fórmula de Friedewald e avalie a meta conforme o risco cardiovascular.",
  area:      "Cardiologia",
  tags:      ["ldl", "ldl-c", "risco cardiovascular", "coronariana", "colesterol", "cardiologia", "fórmula de friedewald", "friedewald", "colesterol ldl", "colesterol ldl-c"],
  caminho:   "calculadoras/ldl/index.html"
  },
  {
  id:        "albca",
  nome:      "Correção de Cálcio sérico pela Albumina",
  descricao: "Corrige os níveis de cálcio sérico com base na concentração de albumina para avaliar o real valor do eletrólito.",
  area:      "Nefrologia",
  tags:      ["calcio", "albumina", "correcao", "endocrinologia", "nefrologia", "cálcio", "correção", "cálcio sérico", "albumina sérica"],
  caminho:   "calculadoras/albca/index.html"
  },
  {
  id:        "ret",
  nome:      "Contagem de Reticulócitos corrigida",
  descricao: "Corrige os valores de reticulócitos conforme o grau da anemia do paciente.",
  area:      "Hematologia",
  tags:      ["reticulocitos", "anemia", "correcao", "contagem", "correção", "reticulócitos", "anemia", "hematologia", "reticulócitos corrigidos", "contagem de reticulócitos", "hemograma"],
  caminho:   "calculadoras/ret/index.html"
  }
];