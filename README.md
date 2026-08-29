# VCalcs

VCalcs é um web app de calculadoras médicas, criado para uso rápido no dia a dia clínico — direto no navegador, sem necessidade de instalação, login ou conta de usuário.

🔗 **Acesse o app:** [vonflach.github.io/VCalcs](https://vonflach.github.io/VCalcs)

O projeto é construído com **HTML, CSS e JavaScript puros** (sem frameworks ou ferramentas de build), com uma arquitetura modular pensada para facilitar a adição de novas calculadoras e utilitários ao longo do tempo.

> ⚠️ **Aviso de transparência:** o código deste aplicativo foi desenvolvido com apoio de ferramentas de inteligência artificial. As fórmulas e faixas de interpretação clínica foram definidas e revisadas pelo autor.

---

## Sobre

- 🌐 **Web app** — Funciona em qualquer navegador (Desktop, iOS, Android)
- 🔓 **Sem conta ou login** — Cada acesso é independente, sem dados pessoais
- 🧩 **Arquitetura modular** — Calculadoras e utilitários vivem isolados em suas próprias pastas
- 🔍 **Busca integrada** — Filtra por nome, área ou palavra-chave em tempo real
- 📚 **Aba de Utilitários** — Tabelas e guias de consulta rápida à beira do leito
- 🎨 **Interpretação visual** — Resultados com código de cores conforme faixas clínicas, conforme necessário

---

## Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/vonflach/VCalcs.git
   ```
2. Abra a pasta no VS Code
3. Use a extensão **Live Server** (ou similar) para servir o `index.html`

> ⚠️ Não é possível abrir o `index.html` diretamente pelo Explorer (duplo clique), pois o `fetch()` usado para carregar cada calculadora exige que os arquivos sejam servidos via HTTP.

---

## PWA — Instalação Offline

O VCalcs é uma Progressive Web App (PWA) e pode ser instalado diretamente no celular, funcionando offline após a primeira visita.

### Como instalar

**Android (Chrome):**

1. Acesse [vonflach.github.io/VCalcs](https://vonflach.github.io/VCalcs/)
2. Toque nos 3 pontinhos (⋮) → "Instalar e Criar Atalho" → "Instalar"

**iPhone (Safari):**

1. Acesse o link acima no Safari
2. Toque em Compartilhar (□↑) → "Adicionar à Tela de Início"

### Atualizações

Quando uma nova versão for publicada, o app exibe automaticamente um banner "Nova versão disponível" para os usuários que já o instalaram.

### Ao adicionar novas calculadoras

1. Adicione o caminho do novo arquivo em `ARQUIVOS` no `service-worker.js`
2. Incremente a versão no `version.js`

---

## Estrutura do projeto

```
vcalcs/
│
├── index.html                  # Página principal (home, busca, nav, disclaimer)
├── style.css                   # Estilo global (paleta, layout, componentes)
├── app.js                      # Lógica central: renderização, busca, navegação
├── registro.js                 # Catálogo de calculadoras
├── registro-utilitarios.js     # Catálogo de utilitários
├── accordion.js                # Componente global do bloco de Referências / Fórmula / Cuidados
├── feedback.js                 # Sistema de Feedback
├── service-worker.js           # Cache offline e atualização automática (PWA)
├── version.js                  # Versão do app — atualizar a cada release
├── manifest.json               # Metadados do PWA (nome, ícone, cor, modo standalone)
│
├── assets/
│   ├── img/                    # Logo e imagens
│   └── icons/                  # Ícones da interface (nav inferior)
│
├── calculadoras/
│   ├── pam/
│   │   └── index.html
│   └── [outras]/
│       └── index.html
│
└── utilitarios/
    ├── meq/
    │   └── index.html
    └── [outras]/
        └── index.html
```

---

## Como adicionar uma nova calculadora

1. **Crie a subpasta** em `calculadoras/[id]/`
2. **Crie o arquivo** `index.html` dentro dela, contendo:
   - HTML com inputs, botões e área de resultado
   - `<style>` com CSS específico (use as variáveis globais, ex: `var(--cor-vermelho)`)
   - `<script>` **inline** com toda a lógica em JavaScript

   > ⚠️ O `<script>` precisa ser **inline** (sem `src` externo). Como cada calculadora é carregada via `fetch()` e injetada no DOM, scripts externos não são executados automaticamente. O `app.js` já trata isso.

3. **Cadastre no `registro.js`:**
   ```javascript
   {
     id:        "id-da-calc",
     nome:      "Nome de Exibição",
     descricao: "Breve descrição do que a calculadora faz.",
     area:      "Especialidade",
     tags:      ["palavra-chave-1", "palavra-chave-2"],
     caminho:   "calculadoras/id-da-calc/index.html"
   }
   ```

A calculadora aparece automaticamente na home, em ordem alfabética, já pesquisável. Nenhum outro arquivo precisa ser alterado.

---

## Como adicionar um novo utilitário

1. **Crie a subpasta** em `utilitarios/[categoria]/`
2. **Crie o arquivo** `index.html` dentro dela — mesmas regras das calculadoras (HTML + `<style>` + `<script>` inline)
3. **Cadastre no `registro-utilitarios.js`:**
   ```javascript
   {
     id:        "id-do-utilitario",
     nome:      "Nome de Exibição",
     descricao: "Breve descrição do que o utilitário oferece.",
     area:      "Categoria",
     tags:      ["palavra-chave-1", "palavra-chave-2"],
     caminho:   "utilitarios/categoria/index.html"
   }
   ```

O utilitário aparece automaticamente na aba **Utilitários**. Nenhum outro arquivo precisa ser alterado.

---

## Calculadoras disponíveis

- Critérios de Wells para Trombose Venosa Profunda (TVP)
- Índice de Fibrose Hepática (FIB-4)
- Contagem de Reticulócitos Corrigida
- Correção de Cálcio sérico pela Albumina
- Estimativa para Colesterol LDL (LDL-c)
- Data Provável de Parto (DPP)
- Hidratação Venosa via Holliday-Segar e eletrólitos
- Vazão e Dose de Medicamentos em Infusão Contínua
- Taxa de Filtração Glomerular estimada (TFGe) &mdash; Cockcroft-Gault, MDRD e CKD-EPI 2021
- Fração de Excreção de Sódio (FENa)
- Sódio corrigido pela Hiperglicemia
- Osmolaridade Plasmática
- Relação Albumina-Creatinina (RAC)
- Pressão Arterial Média (PAM)

## Utilitários disponíveis

- Faixas Terapêuticas de Sedativos e Hipnóticos
- Referências de Eletrólitos — Apresentações comerciais e equivalências em mEq/mL e mEq/ampola

---

## Em desenvolvimento...

**Calculadoras:**

- Critérios de Wells para Tromboembolismo Pulmonar (TEP)
- Dosagem de Fluidoterapia Intraoperatória
- Escore de Pádua para Predição de Tromboembolismo Venoso (TEV)

**Utilitários:**

- Correção de Posologia Antimicrobiana pela Função Renal

---

## Disclaimer

As calculadoras e utilitários disponibilizados neste aplicativo são ferramentas de **APOIO** à prática clínica e **NÃO substituem o julgamento clínico**, a avaliação individualizada do paciente ou a consulta a diretrizes atualizadas. O raciocínio clínico é soberano e deve **SEMPRE** prevalecer. **O PRINCIPAL OBJETIVO DA PRESENTE APLICAÇÃO É EDUCACIONAL.**

---

## Feedback e Sugestões

O presente projeto está em aprimoramento contínuo! Na presença de uma sugestão, erro, elogio ou demais comentários, entre em contato com uma das seguintes maneiras:

- Na aplicação, vá em "Sobre o App" e clique em "Enviar Feedback", preenchendo os campos necessários;
- Abra uma [Issue aqui](https://github.com/vonflach/VCalcs/issues/new), descrevendo o conteúdo da mensagem.

Toda contribuição é bem-vinda!

---

## Licença

Veja o arquivo [LICENSE](./LICENSE) para detalhes.

## Autor

Gabriel von Flach Sarmento (@vonflach)
