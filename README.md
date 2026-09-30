# Folha Suplementar – PCPA

Aplicação web para cálculo e emissão da **Folha Suplementar** de pagamento de **13º salário e férias proporcionais/indenizadas** de servidores da **Polícia Civil do Estado do Pará (PCPA)**, em casos de encerramento de vínculo (exoneração, aposentadoria, falecimento etc.).

O objetivo é substituir as planilhas Excel usadas hoje pela Divisão de Pagamento de Pessoal (Diretoria de Recursos Humanos), padronizando as regras de cálculo e gerando automaticamente o PDF no modelo oficial.

---

## Sumário

- [Visão geral](#visão-geral)
- [Fluxo de uso](#fluxo-de-uso)
- [Regras de cálculo](#regras-de-cálculo)
- [Dados utilizados](#dados-utilizados)
- [Arquitetura e tecnologias](#arquitetura-e-tecnologias)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Como executar (reprodução)](#como-executar-reprodução)
- [Como verificar um cálculo](#como-verificar-um-cálculo)
- [Limitações conhecidas](#limitações-conhecidas)

---

## Visão geral

A aplicação é uma página única (SPA) que roda **inteiramente no navegador**: não há servidor, banco de dados nem envio de informações para a internet. Todos os dados digitados ficam apenas na memória da página e são descartados ao fechar ou recarregar a aba. O único produto gerado é o arquivo PDF baixado pelo usuário.

Resultado final: `Folha_Suplementar_<número>.pdf`, contendo:

1. Cabeçalho institucional (PCPA / DRH / Coordenadoria de Desenvolvimento de Pessoas / Divisão de Pagamento de Pessoal) em todas as páginas;
2. Identificação do servidor e dados do vínculo;
3. Base da composição da remuneração (rubricas preenchidas), redutor constitucional e valor base;
4. Quadro de **Vantagens** (13º, férias, 1/3 de férias, auxílios etc.);
5. Quadro de **Valores Recebidos a Maior** (adiantamentos e abatimentos);
6. **Total Bruto**, **Descontos Obrigatórios** (previdência e IR) e **Total Líquido**;
7. Valor bruto por extenso, data (Belém/PA), bloco de assinatura e rodapé com endereço.

---

## Fluxo de uso

A tela é dividida em seções, preenchidas de cima para baixo. Cada seção alimenta as seguintes:

| # | Seção | Componente | O que se informa |
|---|-------|------------|------------------|
| 1 | Identificação do Requerente | `RequesterForm.js` | Nome, CPF (validado pelos dígitos verificadores), matrícula, cargo, protocolo PAE, interessado, assunto |
| 2 | Informações Preliminares | `BasicInfoForm.js` | Data e motivo da posse; data e motivo do encerramento do vínculo (valida se o encerramento não é anterior à posse) |
| 3 | Composição da Remuneração – Vantagens | `PayrollForm.js` | Mês de referência (`Mmm/AAAA`), valor de cada rubrica do contracheque e valor limite do redutor constitucional |
| 4 | Cálculo de 13º e Férias | `ThirteenthVacationForm.js` + `PeriodosAquisitivosForm.js` | Valores base calculados automaticamente; inclusão de cada vantagem com período (data inicial/final) e competência |
| 5 | Adiantamentos e Outros Valores Recebidos | `AdiantamentosForm.js` | Valores já pagos que devem ser abatidos (adiantamento de 13º, dias não trabalhados etc.) |
| 6 | Descontos e Retenções | `DiscountForm.js` | Descontos de previdência e IR (descrição, base de cálculo, alíquota, valor) |
| 7 | Dados para Emissão do PDF | `PdfDataForm.js` + `GerarPdfButton.js` | Número da folha e dados do assinante; botão **Gerar PDF** |

---

## Regras de cálculo

Os cálculos mantêm todas as casas decimais internamente; o arredondamento (2 casas, padrão pt-BR) ocorre apenas na exibição, para evitar diferenças acumuladas.

### 1. Bases de cálculo (`PayrollForm.js` + `constants.js`)

O usuário digita uma única vez o valor de cada rubrica. Cada "Valor Base" soma apenas um subconjunto de códigos, definido em `constants.js`:

| Base | Constante | Uso |
|------|-----------|-----|
| Dias Trabalhados | `CODIGOS_BASE_DIAS` | referência |
| Férias | `CODIGOS_BASE_FERIAS` | férias e 1/3 |
| 13º Salário | `CODIGOS_BASE_DECIMO` | 13º, adiantamento, dias não trabalhados |
| Pecúnia | `CODIGOS_BASE_PECUNIA` | referência |
| Auxílio Funeral | `CODIGOS_BASE_AUXILIO_FUNERAL` | referência |
| Adicional por Tempo de Serviço | `CODIGOS_BASE_ATS` | referência |
| Auxílio Doença | `CODIGOS_BASE_AUXILIO_DOENCA` | referência |
| Imposto de Renda | `CODIGOS_BASE_IR` | sugerida em Descontos |
| Previdência RPPS | `CODIGOS_BASE_RPPS` | sugerida em Descontos |
| Previdência INSS | `CODIGOS_BASE_INSS` | sugerida em Descontos |

### 2. 13º salário (`ThirteenthVacationForm.js`)

- Valor mensal (avo) = `Base 13º ÷ 12`
- Valor diário = `Base 13º ÷ nº de dias do mês de referência` (considera anos bissextos)

### 3. Férias (`ThirteenthVacationForm.js`)

- Valor base mensal = `Base Férias ÷ 12`
- Valor mensal do 1/3 = `Valor base mensal × 0,3333`
- Valor mensal do avo de férias = `Valor base mensal + Valor mensal do 1/3`

### 4. Contagem de avos (`utils.js`)

As regras são diferentes para 13º e férias:

- **13º** (`calcularAvosPeriodo`): percorre os **meses civis** do período; cada mês com **15 dias ou mais** trabalhados conta 1 avo.
- **Férias** (`calcularAvosFerias`): conta **blocos de 30 dias corridos** a partir da data inicial do período aquisitivo; a fração final de **15 dias ou mais** conta 1 avo.
- Em ambos os casos, o máximo é 12 avos.

### 5. Vantagens com fórmula pronta (`PeriodosAquisitivosForm.js`)

| Vantagem | Fórmula |
|----------|---------|
| 13ª Salário Integral | `avo do 13º × 12` |
| 13ª Salário Proporcional | `avo do 13º × avos (regra do 13º)` |
| Férias Indenizadas Integral | `base mensal de férias × 12` |
| Férias Indenizadas Proporcional | `base mensal de férias × avos (regra de férias)` |
| 1/3 de Férias Indenizadas Integral | `1/3 mensal × 12` |
| 1/3 de Férias Indenizadas Proporcional | `1/3 mensal × avos (regra de férias)` |

Qualquer outra vantagem (auxílio alimentação, auxílio transporte, abono de permanência, previdência ou uma descrição nova digitada livremente) usa a **mini-calculadora de dias**:

- **Dias corridos**: `valor integral ÷ dias do mês × dias corridos do período`
- **Dias úteis**: `valor integral ÷ (dias úteis do mês − feriados/pontos facultativos) × dias úteis do período` (os dias úteis do período podem ser informados manualmente, de 1 a 22)

O resultado da mini-calculadora é apenas sugestivo; o valor pode ser editado manualmente.

### 6. Adiantamentos (`AdiantamentosForm.js`)

| Item | Fórmula |
|------|---------|
| Adiantamento de 13º Salário | `Base 13º ÷ 2` |
| Dias Não Trabalhados | `valor diário do 13º × dias corridos do período` |
| Demais itens | mini-calculadora de dias ou valor manual |

### 7. Totais e descontos (`DiscountForm.js`)

- **Total Bruto** = `Total das Vantagens − Total Recebido a Maior`
- **Valor do desconto** = `Alíquota × Valor Base de Cálculo` (sugerido; pode ser editado)
- **Total Líquido** = `Total Bruto − Total dos Descontos`

A seção traz links de apoio para os simuladores oficiais de IRRF e IRRF-RRA da Receita Federal e para uma calculadora de INSS, usados para obter a alíquota efetiva.

---

## Dados utilizados

**O repositório não contém dados de servidores.** Nenhuma base de dados, planilha ou arquivo com informações pessoais é lido ou armazenado. Os dados são de duas naturezas:

### a) Dados de referência (fixos no código)

Definidos em `constants.js` e nos componentes:

- **Rubricas de vantagens** (`RUBRICAS_FIXAS`): 35 códigos do sistema de folha do Estado, por exemplo `0001 – Vencimento Base`, `0040 – Gratificação de Risco de Vida`, `0070 – Gratificação de Polícia Judiciária`, `0080 – Adicional por Tempo de Serviço`, `0146 – Abono de Permanência`.
- **Composição de cada base de cálculo** (listas `CODIGOS_BASE_*`), conforme descrito acima.
- **Rubricas de desconto** (sugestões): `0636/0688 – FINANPREV`, `0638/0695 – FUNPREV`, `0656 – INSS Temporário/Comissionado`, `0657 – IR Férias`, `0658 – IRRF`, `0698 – IR RRA`, além das hipóteses de isenção do ADI SRF nº 5/2005 e nº 14/2005.
- **Motivos de posse e de encerramento de vínculo** (`BasicInfoForm.js`).
- **Descrições de vantagens e adiantamentos** usadas no autocompletar.
- **Dados institucionais do PDF** (cabeçalho, endereço, telefone e e-mail da Divisão de Pagamento), em `GerarPdfButton.js`.

> Para atualizar uma rubrica ou alterar a composição de uma base, basta editar `constants.js`.

### b) Dados de entrada (digitados pelo usuário a cada cálculo)

- Identificação do servidor (nome, CPF, matrícula, cargo, protocolo PAE);
- Datas e motivos de posse e encerramento;
- Valores das rubricas do contracheque do mês de referência e o limite do redutor constitucional;
- Períodos aquisitivos, adiantamentos, alíquotas e descontos;
- Dados do assinante e número da folha.

Esses dados existem apenas enquanto a página está aberta.

---

## Arquitetura e tecnologias

- **React 18** (UMD, carregado via CDN `unpkg.com`)
- **Babel Standalone**: compila o JSX diretamente no navegador (não há etapa de build)
- **jsPDF 2.5.1** + **jspdf-autotable 3.8.2**: geração do PDF no navegador
- JavaScript puro, sem `npm`, sem bundler, sem backend

Os arquivos `.js` são carregados em sequência pelo `index.html` como `<script type="text/babel">` e compartilham o escopo global. Por isso a **ordem de carregamento importa**: `constants.js` e `utils.js` primeiro, os componentes em seguida e `App.js` por último.

O estado de toda a aplicação fica em `App.js`, que recebe os dados de cada formulário por callbacks (`onDadosChange`, `onTotalChange`, `onListaChange`) e os repassa como props para os formulários seguintes e para o gerador de PDF.

```
RequesterForm ─────────────────────────────────────────────┐
BasicInfoForm ─────────────────────────────────────────────┤
PayrollForm ──► bases (13º, férias, IR, RPPS, INSS...) ─┬──┤
                                                        │  │
   ThirteenthVacationForm ──► PeriodosAquisitivosForm ──┤  │
   AdiantamentosForm ───────────────────────────────────┤  │
                                                        ▼  ▼
                                   DiscountForm ──► GerarPdfButton ──► PDF
PdfDataForm ───────────────────────────────────────────────┘
```

---

## Estrutura de arquivos

| Arquivo | Função |
|---------|--------|
| `index.html` | Página de entrada; carrega bibliotecas e scripts na ordem correta |
| `constants.js` | Rubricas, composição das bases de cálculo e estilos compartilhados |
| `utils.js` | Máscaras, conversão de moeda, contagem de dias/dias úteis, avos, valor por extenso |
| `App.js` | Componente raiz; guarda o estado e conecta as seções |
| `PageLayout.js` | Layout e título da página |
| `RequesterForm.js` | Identificação do requerente (com validação de CPF) |
| `BasicInfoForm.js` | Datas e motivos de posse/encerramento |
| `PayrollForm.js` | Rubricas do contracheque, bases de cálculo e redutor constitucional |
| `ThirteenthVacationForm.js` | Valores mensais e diários de 13º e férias |
| `PeriodosAquisitivosForm.js` | Lançamento das vantagens por período aquisitivo |
| `AdiantamentosForm.js` | Lançamento de valores recebidos a maior |
| `DiscountForm.js` | Descontos obrigatórios, Total Bruto e Total Líquido |
| `PdfDataForm.js` | Número da folha e dados do assinante |
| `GerarPdfButton.js` | Montagem e download do PDF |

---

## Como executar (reprodução)

### Pré-requisitos

- Navegador moderno (Chrome, Edge ou Firefox);
- Acesso à internet (as bibliotecas são carregadas de `unpkg.com`);
- Para rodar localmente: Python 3 **ou** Node.js (apenas para subir um servidor HTTP simples).

> **Importante:** abrir o `index.html` com duplo clique (`file://`) **não funciona**. O Babel Standalone precisa buscar os arquivos `.js` via HTTP, e o navegador bloqueia isso no protocolo `file://`.

### Opção 1 — Python

```bash
git clone https://github.com/ljspinelli/pcpa-folha-suple.git
cd pcpa-folha-suple
python3 -m http.server 8000
```

Acesse **http://localhost:8000** no navegador.

### Opção 2 — Node.js

```bash
git clone https://github.com/ljspinelli/pcpa-folha-suple.git
cd pcpa-folha-suple
npx serve .
```

Acesse o endereço exibido no terminal (normalmente **http://localhost:3000**).

### Opção 3 — VS Code

Abra a pasta do projeto e use a extensão **Live Server** ("Open with Live Server" no `index.html`).

### Opção 4 — GitHub Pages (sem instalar nada)

1. No repositório, vá em **Settings → Pages**;
2. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`;
3. Salve e aguarde alguns minutos; a aplicação ficará disponível em `https://ljspinelli.github.io/pcpa-folha-suple/`.

---

## Como verificar um cálculo

Roteiro rápido para conferir se a aplicação está funcionando:

1. Preencha a **Identificação do Requerente** com dados fictícios (o CPF precisa ter dígitos verificadores válidos).
2. Em **Informações Preliminares**, informe posse `01/03/2020` e encerramento `20/08/2026`.
3. Em **Composição da Remuneração**, informe mês de referência `Ago/2026` e `0001 – Vencimento Base` = `6.000,00`.
   - Esperado: Valor Base 13º = Valor Base Férias = R$ 6.000,00.
4. Em **Cálculo de 13º e Férias**, confira:
   - Valor mensal do 13º = R$ 500,00; valor diário = R$ 193,55 (6.000 ÷ 31).
   - Valor base mensal de férias = R$ 500,00; 1/3 mensal = R$ 166,65.
5. Inclua **13ª Salário Proporcional** de `01/01/2026` a `20/08/2026`.
   - Esperado: 8/12 avos (agosto tem 20 dias, ≥ 15) → R$ 4.000,00.
6. Inclua **Férias Indenizadas Proporcional** de `01/03/2026` a `20/08/2026` (173 dias = 5 blocos de 30 + 23 dias).
   - Esperado: 6/12 avos → R$ 3.000,00.
7. Em **Adiantamentos**, inclua **Adiantamento de 13º Salário** → R$ 3.000,00.
8. Em **Descontos**, confira o Total Bruto (R$ 4.000,00) e aplique um desconto qualquer.
9. Preencha os **Dados para Emissão do PDF** e clique em **Gerar PDF da Folha Suplementar**.

---

## Limitações conhecidas

- **Protótipo**: os dados não são salvos; recarregar a página apaga tudo.
- **Dependência de CDN**: sem internet (ou com `unpkg.com` bloqueado na rede), a página não carrega.
- **Compilação no navegador**: o Babel Standalone é adequado para protótipo, mas deixa o carregamento mais lento; para produção, recomenda-se uma etapa de build.
- **1/3 de férias** usa o fator `0,3333` (e não `1/3` exato), o que pode gerar diferenças de centavos em valores altos.
- **Alíquotas de IR e previdência** não são calculadas por tabela: são informadas pelo usuário, com apoio dos simuladores oficiais.
- **Sem testes automatizados**: a conferência é manual, comparando com a planilha de referência.

---

Polícia Civil do Estado do Pará — Diretoria de Recursos Humanos — Divisão de Pagamento de Pessoal
