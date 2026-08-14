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
    let y = 15;

    function cabecalho() {
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("POLICIA CIVIL DO ESTADO", margemEsq, y);
      y += 5;
      doc.text("DIRETORIA DE RECURSOS HUMANOS", margemEsq, y);
      y += 5;
      doc.text("COORDENADORIA DE DESENVOLVIMENTO DE PESSOAS", margemEsq, y);
      y += 5;
      doc.text("DIVISÃO DE PAGAMENTO DE PESSOAL", margemEsq, y);
      y += 8;
      doc.setFont(undefined, "normal");
    }

    function rodapeEndereco() {
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        "Av. Gov Magalhães Barata, 209 - Nazaré, Belém - PA, 66040-170",
        margemEsq,
        290
      );
    }

    // Barra de total, largura cheia, mesmo tom de cinza e mesma fonte
    // em TODO o documento (cabeçalhos de tabela usam 230/230/230; esta
    // barra usa 200/200/200 — os dois únicos tons usados no PDF inteiro).
    function faixaCinza(rotulo, valor) {
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

    // Dados do requerente (RequesterForm.js) + vínculo (BasicInfoForm.js),
    // logo após o cabeçalho
    doc.setFontSize(9);
    const linhasInfo = [
      `SERVIDOR(A): ${dadosRequerente.nome || "—"}`,
      `MATRÍCULA: ${dadosRequerente.matricula || "—"}`,
      `CPF: ${dadosRequerente.cpf || "—"}`,
      `PROTOCOLO: ${dadosRequerente.pae || "—"}`,
      `ASSUNTO: ${dadosRequerente.assunto || "—"}`,
      `INTERESSADO(A): ${dadosRequerente.interessado || "—"}`,
      `DATA DA POSSE: ${dadosVinculo.posse || "—"}`,
      `MOTIVO DA POSSE: ${dadosVinculo.motivoPosse || "—"}`,
      `MOTIVO DE ENCERRAMENTO DE VÍNCULO: ${dadosVinculo.motivoEncerramento || "—"}`,
      `DATA DE ENCERRAMENTO DE VÍNCULO: ${dadosVinculo.encerramento || "—"}`

      `FOLHA SUPLEMENTAR Nº ${pdfData.numeroFolha || "—"}`,
    ];
    linhasInfo.forEach(linha => {
      doc.text(linha, margemEsq, y);
      y += 5;
    });

    y += 4;

    // Quadro do PayrollForm.js: rubricas da aba de referência, com
    // TOTAL dentro da própria tabela, seguido das faixas de Redutor
    // Constitucional e Valor Base da Composição da Remuneração.
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
    const linhasAdiantamentos = listaAdiantamentos.map(item => [
      item.selecionarVantagem,
      formatarNumeroParaMoeda(item.valor)
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: margemEsq, right: margemEsq },
      head: [["VALORES RECEBIDOS A MAIOR", "VALOR"]],
      body: linhasAdiantamentos.length ? linhasAdiantamentos : [["—", "R$ 0,00"]],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      styles: { fontSize: 9 },
      columnStyles: { 1: { halign: "right", cellWidth: 35 } }
    });
    y = doc.lastAutoTable.finalY + 4;
    faixaCinza("TOTAL RECEBIDO A MAIOR", totalAdiantamentos);

    y += 4;

    rodapeEndereco();

    // ==================== PÁGINA 2 ====================
    doc.addPage();
    y = 15;
    cabecalho();

    faixaCinza("TOTAL BRUTO", dadosDescontos.totalBruto);
    y += 2;

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

    y += 15;

    // Bloco de assinatura
    doc.setFontSize(10);
    doc.text(dataAtualPorExtenso(), margemEsq + larguraUtil / 2, y, { align: "center" });
    y += 15;
    doc.setFont(undefined, "bold");
    doc.text((pdfData.nomeAssinante || "—").toUpperCase(), margemEsq + larguraUtil / 2, y, { align: "center" });
    y += 5;
    doc.setFont(undefined, "normal");
    doc.text(pdfData.cargoAssinante || "—", margemEsq + larguraUtil / 2, y, { align: "center" });
    y += 5;
    doc.text(`Matrícula: ${pdfData.matriculaAssinante || "—"}`, margemEsq + larguraUtil / 2, y, { align: "center" });

    // Frase final com valor por extenso
    doc.setFontSize(9);
    const valorExtenso = numeroPorExtenso(dadosDescontos.totalBruto);
    doc.text(
      `Esta Folha Suplementar implica no valor bruto de R$ ${formatarNumeroParaMoeda(dadosDescontos.totalBruto)} (${valorExtenso}).`,
      margemEsq + larguraUtil / 2,
      270,
      { align: "center", maxWidth: larguraUtil }
    );

    doc.setFontSize(8);
    doc.text("POLÍCIA CIVIL DO ESTADO DO PARÁ", margemEsq + larguraUtil / 2, 280, { align: "center" });
    doc.text("Tel: (91) 99968-6520", margemEsq + larguraUtil / 2, 284, { align: "center" });
    doc.text("e-mail: folhapagamento.drh@policiacivil.pa.gov.br", margemEsq + larguraUtil / 2, 288, { align: "center" });
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
