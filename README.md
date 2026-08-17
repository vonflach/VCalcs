# VCalcs

VCalcs é um web app de calculadoras médicas, criado para uso rápido no dia a dia clínico — direto no navegador, sem necessidade de instalação, login ou conta de usuário.

O projeto é construído com **HTML, CSS e JavaScript puros** (sem frameworks ou ferramentas de build), com uma arquitetura modular pensada para facilitar a adição de novas calculadoras ao longo do tempo.

> ⚠️ **Aviso de transparência:** o código deste aplicativo foi desenvolvido com apoio de ferramentas de inteligência artificial. As fórmulas e faixas de interpretação clínica foram definidas e revisadas pelo autor.

## Sobre

- 🌐 Web app — funciona em qualquer navegador (desktop, iOS, Android)
- 🔓 Sem conta, login ou dados pessoais — cada acesso é independente
- 🧩 Arquitetura modular — cada calculadora vive isolada em sua própria pasta
- 🔍 Busca funcional na tela inicial, com listagem em ordem alfabética
- 🎨 Interpretação visual dos resultados (verde/amarelo/vermelho conforme o valor encontrado)

## Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/vonflach/VCalcs.git
   ```
2. Abra a pasta no VS Code
3. Use a extensão **Live Server** (ou similar) para servir o `index.html`
   - Não é possível simplesmente abrir o `index.html` direto no navegador (duplo clique), pois o `fetch()` usado para carregar cada calculadora exige que os arquivos sejam servidos via HTTP, não abertos como arquivo local

## Estrutura do projeto

```
vcalcs/
│
├── index.html          # Página principal (home, busca, disclaimer)
├── style.css             # Estilo global (paleta, layout, componentes)
├── app.js                 # Lógica da home: renderização, busca, navegação
├── registro.js           # Catálogo central de todas as calculadoras
│
├── assets/
│    ├── img/               # Logo e imagens
│    └── icons/             # Ícones de interface
│
└── calculadoras/
      ├── pam/
      │    └── index.html   # Calculadora de Pressão Arterial Média
      └── rac/
           └── index.html   # Calculadora de Relação Albumina-Creatinina
```

## Como adicionar uma nova calculadora

O sistema foi desenhado para que adicionar uma calculadora nova exija o mínimo de mudanças possível:

1. **Crie a pasta** da calculadora em `calculadoras/[id]/`
2. **Crie um único arquivo** `index.html` dentro dela, contendo:
   - O HTML da calculadora (inputs, botões, área de resultado)
   - Um `<style>` com o CSS específico da calc (pode reaproveitar as variáveis de cor globais, ex: `var(--cor-cyan)`)
   - Um `<script>` **inline** com toda a lógica em JavaScript

   > ⚠️ Importante: o `<script>` **precisa** ser inline (sem `src` apontando para um `.js` externo). Como cada calculadora é carregada dinamicamente via `fetch()` e injetada no DOM, scripts externos referenciados por `src` não são executados pelo navegador. O `app.js` já cuida de reativar o `<script>` inline automaticamente ao carregar a calc — você não precisa se preocupar com isso.

3. **Cadastre a calculadora** no `registro.js`, adicionando um novo objeto:
   ```javascript
   {
     id: "id-da-calc",
     nome: "Nome de Exibição",
     descricao: "Breve descrição do que a calculadora faz.",
     area: "Especialidade",
     tags: ["palavra-chave-1", "palavra-chave-2"],
     caminho: "calculadoras/id-da-calc/index.html"
   }
   ```

Pronto — a calculadora aparece automaticamente na home, em ordem alfabética, já pesquisável pela busca. Nenhum outro arquivo precisa ser alterado.

## Calculadoras adicionadas

- Sódio corrigido pela Hiperglicemia
- Osmolaridade Plasmática
- Relação Albumina-Creatinina (RAC)
- Pressão Arterial Média (PAM)

## Calculadoras futuras

- Fração de Excreção de Sódio &mdash; Em desenvolvimento...
- LDL sérico &mdash; Em desenvolvimento...
- Dose e Velocidade de Infusão &mdash; Em desenvolvimento...

## Disclaimer

As calculadoras disponibilizadas neste aplicativo são ferramentas de **APOIO** à prática clínica e **NÃO substituem o julgamento clínico**, a avaliação individualizada do paciente ou a consulta a diretrizes atualizadas. O raciocínio clínico é soberano e deve sempre prevalecer sobre qualquer resultado apresentado aqui. **O PRINCIPAL OBJETIVO DA PRESENTE APLICAÇÃO É EDUCACIONAL**

## Licença

Veja o arquivo [LICENSE](./LICENSE) para detalhes.

## Autor

Gabriel von Flach Sarmento, 2026