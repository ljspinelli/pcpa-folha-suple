// ============================
// COMPONENTE: GerarPdfButton
// Monta o PDF de duas páginas da Folha Suplementar, seguindo o
// modelo oficial da PCPA, a partir de todos os dados já coletados
// nos outros formulários.
// ============================

// Mapeia o id da "Aba de Referência" para a lista de códigos que
// define o Quadro de rubricas e para o campo de total correspondente
// já calculados no PayrollForm.js.
const MAPA_ABA_CODIGOS = {
  dias: CODIGOS_BASE_DIAS,
  ferias: CODIGOS_BASE_FERIAS,
  decimo: CODIGOS_BASE_DECIMO,
  pecunia: CODIGOS_BASE_PECUNIA,
  auxilioFuneral: CODIGOS_BASE_AUXILIO_FUNERAL,
  ats: CODIGOS_BASE_ATS,
  auxilioDoenca: CODIGOS_BASE_AUXILIO_DOENCA
};

const MAPA_ABA_CAMPO_TOTAL = {
  dias: "valorBaseDias",
  ferias: "valorBaseFerias",
  decimo: "valorBase13",
  pecunia: "valorBasePecunia",
  auxilioFuneral: "valorBaseAuxilioFuneral",
  ats: "valorBaseATS",
  auxilioDoenca: "valorBaseAuxilioDoenca"
};

const MESES_EXTENSO = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function dataAtualPorExtenso() {
  const hoje = new Date();
  return `Belém (PA), ${hoje.getDate()} de ${MESES_EXTENSO[hoje.getMonth()]} de ${hoje.getFullYear()}`;
}

function GerarPdfButton({
  dadosRequerente,
  dadosVinculo,
  dadosFolha,
  listaPeriodosAquisitivos,
  totalPeriodosAquisitivos,
  listaAdiantamentos,
  totalAdiantamentos,
  dadosDescontos,
  pdfData
}) {

  function gerarPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margemEsq = 14;
    const larguraUtil = 182;
    const centro = margemEsq + larguraUtil / 2;
    const alturaPagina = doc.internal.pageSize.getHeight();
    let y = 15;

    // Evita que um quadro comece perto demais do fim da página e
    // acabe cortado — se não sobrar espaço mínimo razoável, pula
    // para a próxima página antes de começar o bloco.
    function novaPaginaSeNecessario(alturaMinima) {
      if (y + alturaMinima > alturaPagina - 20) {
        doc.addPage();
        y = 15;
      }
    }

    function cabecalho() {
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("POLICIA CIVIL DO ESTADO", centro, y, { align: "center" });
      y += 5;
      doc.text("DIRETORIA DE RECURSOS HUMANOS", centro, y, { align: "center" });
      y += 5;
      doc.text("COORDENADORIA DE DESENVOLVIMENTO DE PESSOAS", centro, y, { align: "center" });
      y += 5;
      doc.text("DIVISÃO DE PAGAMENTO DE PESSOAL", centro, y, { align: "center" });
      y += 8;
      doc.setFont(undefined, "normal");
    }

    function rodapeEndereco() {
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        "Av. Gov Magalhães Barata, 209 - Nazaré, Belém - PA, 66040-170",
        centro,
        290,
        { align: "center" }
      );
    }

    // Barra de total, largura cheia, mesmo tom de cinza e mesma fonte
    // em TODO o documento (cabeçalhos de tabela usam 230/230/230; esta
    // barra usa 200/200/200 — os dois únicos tons usados no PDF inteiro).
    // O valor sempre alinhado à direita.
    function faixaCinza(rotulo, valor) {
      novaPaginaSeNecessario(10);
      const altura = 7;
      doc.setFillColor(200, 200, 200);
      doc.rect(margemEsq, y - 5, larguraUtil, altura, "F");
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(rotulo, margemEsq + 2, y);
      doc.text(`R$ ${formatarNumeroParaMoeda(valor)}`, margemEsq + larguraUtil - 2, y, { align: "right" });
      y += altura + 3;
      doc.setFont(undefined, "normal");
    }

    // ==================== PÁGINA 1 ====================
    cabecalho();

    // "FOLHA SUPLEMENTAR Nº" — negrito, fonte maior, centralizada,
    // com duas linhas de espaço após o cabeçalho.
    y += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`FOLHA SUPLEMENTAR Nº ${pdfData.numeroFolha || "—"}`, centro, y, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);

    // Dados Preliminares — duas linhas abaixo do título acima
    y += 10;
    doc.setFontSize(9);

    const blocoRequerente = [
      `SERVIDOR(A): ${dadosRequerente.nome || "—"}`,
      `MATRÍCULA: ${dadosRequerente.matricula || "—"}`,
      `CPF: ${dadosRequerente.cpf || "—"}`,
      `PROTOCOLO: ${dadosRequerente.pae || "—"}`,
      `ASSUNTO: ${dadosRequerente.assunto || "—"}`,
      `INTERESSADO(A): ${dadosRequerente.interessado || "—"}`
    ];
    blocoRequerente.forEach(linha => {
      doc.text(linha, margemEsq, y);
      y += 5;
    });

    y += 5; // uma linha de espaço entre os dois blocos

    const blocoVinculo = [
      `DATA DA POSSE: ${dadosVinculo.posse || "—"}`,
      `MOTIVO DA POSSE: ${dadosVinculo.motivoPosse || "—"}`,
      `DATA DE ENCERRAMENTO DE VÍNCULO: ${dadosVinculo.encerramento || "—"}`,
      `MOTIVO DE ENCERRAMENTO DE VÍNCULO: ${dadosVinculo.motivoEncerramento || "—"}`
    ];
    blocoVinculo.forEach(linha => {
      doc.text(linha, margemEsq, y);
      y += 5;
    });

    y += 6;

    // Quadro do PayrollForm.js: rubricas da aba de referência, com
    // TOTAL dentro da própria tabela, seguido das faixas de Redutor
    // Constitucional e Valor Base da Composição da Remuneração.
    novaPaginaSeNecessario(40);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`BASE DA COMPOSIÇÃO DA REMUNERAÇÃO: ${dadosFolha.mesRef || "—"}`, margemEsq, y);
    y += 4;
    doc.setFont(undefined, "normal");

    const codigosAba = MAPA_ABA_CODIGOS[pdfData.abaReferencia] || [];
    const rubricasPreenchidas = RUBRICAS_FIXAS
      .filter(r => codigosAba.includes(r.codigo) && dadosFolha.valores[r.codigo])
      .map(r => [
        `${r.codigo} - ${r.nome}`,
        formatarNumeroParaMoeda(converterMoedaParaNumero(dadosFolha.valores[r.codigo]))
      ]);

    const valorBaseAba = dadosFolha[MAPA_ABA_CAMPO_TOTAL[pdfData.abaReferencia]] || 0;

    doc.autoTable({
      startY: y,
      margin: { left: margemEsq, right: margemEsq },
      pageBreak: "avoid",
      head: [["DESCRIÇÃO DA RUBRICA", "VALOR"]],
      body: rubricasPreenchidas.length ? rubricasPreenchidas : [["—", "R$ 0,00"]],
      foot: [["TOTAL", formatarNumeroParaMoeda(valorBaseAba)]],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      footStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: "bold", fontSize: 10 },
      styles: { fontSize: 9 },
      columnStyles: { 1: { halign: "right", cellWidth: 35 } }
    });
    y = doc.lastAutoTable.finalY + 6;

    faixaCinza("VALOR LIMITE DO REDUTOR CONSTITUCIONAL", dadosFolha.redutorConstitucional);
    faixaCinza("VALOR BASE DA COMPOSIÇÃO DA REMUNERAÇÃO", valorBaseAba);

    y += 2;

    // VANTAGENS = Quadro1 do PeriodosAquisitivosForm.js
    novaPaginaSeNecessario(40);
    doc.setFont(undefined, "bold");
    doc.text("VANTAGENS", margemEsq, y);
    y += 4;
    doc.setFont(undefined, "normal");

    const linhasVantagens = listaPeriodosAquisitivos.map(item => [
      item.selecionarVantagem,
      formatarNumeroParaMoeda(item.valor)
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: margemEsq, right: margemEsq },
      pageBreak: "avoid",
      head: [["VANTAGENS", "VALOR"]],
      body: linhasVantagens.length ? linhasVantagens : [["—", "R$ 0,00"]],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      styles: { fontSize: 9 },
      columnStyles: { 1: { halign: "right", cellWidth: 35 } }
    });
    y = doc.lastAutoTable.finalY + 4;
    faixaCinza("TOTAL DAS VANTAGENS", totalPeriodosAquisitivos);

    y += 2;

    // VALORES RECEBIDOS A MAIOR = Quadro1 do AdiantamentosForm.js
    novaPaginaSeNecessario(40);
    const linhasAdiantamentos = listaAdiantamentos.map(item => [
      item.selecionarVantagem,
      formatarNumeroParaMoeda(item.valor)
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: margemEsq, right: margemEsq },
      pageBreak: "avoid",
      head: [["VALORES RECEBIDOS A MAIOR", "VALOR"]],
      body: linhasAdiantamentos.length ? linhasAdiantamentos : [["—", "R$ 0,00"]],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      styles: { fontSize: 9 },
      columnStyles: { 1: { halign: "right", cellWidth: 35 } }
    });
    y = doc.lastAutoTable.finalY + 4;
    faixaCinza("TOTAL RECEBIDO A MAIOR", totalAdiantamentos);

    rodapeEndereco();

    // ==================== PÁGINA 2 ====================
    doc.addPage();
    y = 15;
    cabecalho();

    faixaCinza("TOTAL BRUTO", dadosDescontos.totalBruto);
    y += 2;

    novaPaginaSeNecessario(40);
    doc.setFont(undefined, "bold");
    doc.text("DESCONTOS OBRIGATÓRIOS", margemEsq, y);
    y += 4;
    doc.setFont(undefined, "normal");

    const linhasDescontos = dadosDescontos.lista.map(item => [
      item.rubrica,
      item.aliquota,
      formatarNumeroParaMoeda(item.valor)
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: margemEsq, right: margemEsq },
      pageBreak: "avoid",
      head: [["RÚBRICA", "ALÍQUOTA", "VALOR"]],
      body: linhasDescontos.length ? linhasDescontos : [["—", "—", "R$ 0,00"]],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      styles: { fontSize: 9 },
      columnStyles: { 2: { halign: "right", cellWidth: 35 } }
    });
    y = doc.lastAutoTable.finalY + 4;

    faixaCinza("TOTAL DESCONTOS OBRIGATÓRIOS", dadosDescontos.total);
    faixaCinza("TOTAL LÍQUIDO", dadosDescontos.totalLiquido);

    // Linha separadora + frase do valor bruto por extenso, logo
    // abaixo da barra de Total Líquido
    y += 3;
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.2);
    doc.line(margemEsq, y, margemEsq + larguraUtil, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    const valorExtenso = numeroPorExtenso(dadosDescontos.totalBruto);
    const fraseExtenso = `Esta Folha Suplementar implica no valor bruto de R$ ${formatarNumeroParaMoeda(dadosDescontos.totalBruto)} (${valorExtenso}).`;
    const linhasExtenso = doc.splitTextToSize(fraseExtenso, larguraUtil);
    linhasExtenso.forEach(linha => {
      doc.text(linha, centro, y, { align: "center" });
      y += 5;
    });

    y += 10;

    // Bloco de assinatura — data, Nome, Cargo, Matrícula e dados
    // institucionais fixos, tudo centralizado.
    novaPaginaSeNecessario(45);
    doc.setFontSize(10);
    doc.text(dataAtualPorExtenso(), centro, y, { align: "center" });
    y += 12;

    doc.setFont(undefined, "bold");
    doc.text(`Nome: ${pdfData.nomeAssinante || "—"}`, centro, y, { align: "center" });
    y += 5;
    doc.setFont(undefined, "normal");
    doc.text(`Cargo: ${pdfData.cargoAssinante || "—"}`, centro, y, { align: "center" });
    y += 5;
    doc.text(`Matrícula: ${pdfData.matriculaAssinante || "—"}`, centro, y, { align: "center" });
    y += 7;

    doc.setFontSize(9);
    doc.text("POLÍCIA CIVIL DO ESTADO DO PARÁ", centro, y, { align: "center" });
    y += 5;
    doc.text("Telefone: (91) 99968-6520", centro, y, { align: "center" });
    y += 5;
    doc.text("E-mail: folhapagamento.drh@policiacivil.pa.gov.br", centro, y, { align: "center" });

    rodapeEndereco();

    doc.save(`Folha_Suplementar_${pdfData.numeroFolha || "sem-numero"}.pdf`);
  }

  return (
    <div style={{ marginTop: "10px", textAlign: "right" }}>
      <button onClick={gerarPdf} style={{ padding: "10px 20px", fontWeight: "bold" }}>
        Gerar PDF da Folha Suplementar
      </button>
    </div>
  );
}
