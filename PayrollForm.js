// ============================
// COMPONENTE: PayrollForm (sem abas — lista única de rubricas)
// Um valor por rubrica, usado para compor várias "Bases" diferentes
// (Dias Trabalhados, Férias, 13º, Pecúnia, Auxílio Funeral, ATS,
// Auxílio Doença, além de IR/RPPS/INSS) simultaneamente.
// ============================

// Lista de sugestões do campo "Rúbrica" do quadro de Descontos e
// Retenções deste formulário (autocomplete estilo Google — digitação
// livre, mas com sugestões da lista quando o texto bate).
const OPCOES_RUBRICA_DESCONTO_PAYROLL = [
  "0636 - FINANPREV Contribuição Limite",
  "0638 - FUNPREV Limite RPPS",
  "0656 - INSS Temp/Comiss",
  "0657 - Imposto de Renda Férias",
  "0658 - Imposto de Renda",
  "0688 - FINANPREV Contribuição",
  "0695 - FUNPREV Contribuição LC112",
  "0698 - Imposto de Renda RRA"
];

function PayrollForm({ onDadosChange }) {
  const [mesRef, setMesRef] = React.useState("");
  const [valores, setValores] = React.useState({});
  const [redutorConstitucionalTexto, setRedutorConstitucionalTexto] = React.useState("");

  // Quadro "Descontos e Retenções" deste formulário
  const [rubricaDesconto, setRubricaDesconto] = React.useState("");
  const [aliquotaDesconto, setAliquotaDesconto] = React.useState("");
  const [aliquotaDescontoRaw, setAliquotaDescontoRaw] = React.useState("");
  const [valorDescontoTexto, setValorDescontoTexto] = React.useState("");
  const [listaDescontosAplicados, setListaDescontosAplicados] = React.useState([]);

  function handleChangeValor(codigo, novoValor) {
    const valorFormatado = mascaraMoeda(novoValor);
    setValores(prev => ({
      ...prev,
      [codigo]: valorFormatado
    }));
  }

  const total = calcularTotal(valores);

  const valorBaseDias = calcularBaseCalculo(valores, CODIGOS_BASE_DIAS);
  const valorBaseFerias = calcularBaseCalculo(valores, CODIGOS_BASE_FERIAS);
  const valorBase13 = calcularBaseCalculo(valores, CODIGOS_BASE_DECIMO);
  const valorBasePecunia = calcularBaseCalculo(valores, CODIGOS_BASE_PECUNIA);
  const valorBaseAuxilioFuneral = calcularBaseCalculo(valores, CODIGOS_BASE_AUXILIO_FUNERAL);
  const valorBaseATS = calcularBaseCalculo(valores, CODIGOS_BASE_ATS);
  const valorBaseAuxilioDoenca = calcularBaseCalculo(valores, CODIGOS_BASE_AUXILIO_DOENCA);

  const valorBaseIR = calcularBaseCalculo(valores, CODIGOS_BASE_IR);
  const valorBaseRPPS = calcularBaseCalculo(valores, CODIGOS_BASE_RPPS);
  const valorBaseINSS = calcularBaseCalculo(valores, CODIGOS_BASE_INSS);

  const redutorConstitucional = converterMoedaParaNumero(redutorConstitucionalTexto);

  // Repassa tudo para cima: valores brutos + mês de referência (para
  // uso no PDF) e todas as bases calculadas (para uso no Cálculo de
  // 13º/Férias, Adiantamentos, etc.)
  React.useEffect(() => {
    if (typeof onDadosChange === "function") {
      onDadosChange({
        mesRef,
        valores,
        valorBaseDias,
        valorBaseFerias,
        valorBase13,
        valorBasePecunia,
        valorBaseAuxilioFuneral,
        valorBaseATS,
        valorBaseAuxilioDoenca,
        valorBaseIR,
        valorBaseRPPS,
        valorBaseINSS,
        redutorConstitucional
      });
    }
  }, [mesRef, valores, redutorConstitucionalTexto, onDadosChange]);

  // Digitação fluída da alíquota do quadro de Descontos e Retenções
  // (mesmo padrão do campo Alíquota do DiscountForm.js)
  function onAliquotaDescontoChange(e) {
    const texto = e.target.value.replace(/[^0-9,]/g, "");
    setAliquotaDescontoRaw(texto);
    setAliquotaDesconto(texto);
  }

  function onAliquotaDescontoBlur() {
    if (aliquotaDescontoRaw) {
      setAliquotaDesconto(formatarPercentualFinal(aliquotaDescontoRaw));
    }
  }

  function aplicarDescontoPayroll() {
    if (!rubricaDesconto || !valorDescontoTexto) return;

    const linha = {
      rubrica: rubricaDesconto,
      aliquota: aliquotaDesconto,
      valor: converterMoedaParaNumero(valorDescontoTexto)
    };

    // Atualiza a linha se a rúbrica já existir na lista, senão adiciona
    setListaDescontosAplicados(prev => {
      const semDuplicata = prev.filter(item => item.rubrica !== linha.rubrica);
      return [...semDuplicata, linha];
    });

    setRubricaDesconto("");
    setAliquotaDesconto("");
    setAliquotaDescontoRaw("");
    setValorDescontoTexto("");
  }

  function removerDescontoPayroll(rubrica) {
    setListaDescontosAplicados(prev => prev.filter(item => item.rubrica !== rubrica));
  }

  const totalDescontosAplicados = listaDescontosAplicados.reduce((acc, item) => acc + item.valor, 0);
  const totalLiquidoPayroll = total - totalDescontosAplicados;

  return (
    <div style={ESTILOS.containerPrincipal}>

      {/* Base da Composição da Remuneração */}
      <div style={{ marginBottom: "20px" }}>
        <label style={ESTILOS.label}>Base da Composição da Remuneração:</label>
        <br />
        <input
          style={ESTILOS.input}
          value={mesRef}
          onChange={e => setMesRef(formatarMesRef(e.target.value))}
          placeholder="Abr/2020"
        />
      </div>

      <div style={ESTILOS.containerTabela}>
        {/* Lista única de rubricas */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {RUBRICAS_FIXAS.map(rub => (
              <tr key={rub.codigo}>
                <td style={{ padding: "8px" }}>
                  {rub.codigo} - {rub.nome}
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  <input
                    style={{ ...ESTILOS.inputTabela, width: "180px" }}
                    value={valores[rub.codigo] || ""}
                    onChange={e => handleChangeValor(rub.codigo, e.target.value)}
                    placeholder=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total geral */}
        <div style={ESTILOS.totalGeral}>
          Total: R$ {formatarNumeroParaMoeda(total)}
        </div>

        {/* Descontos e Retenções (deste formulário) */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#0B2B4A" }}>Descontos e Retenções</h3>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "2", minWidth: "220px" }}>
              <label style={ESTILOS.label}>Rúbrica:</label><br />
              <input
                list="opcoes-rubrica-desconto-payroll"
                style={{ ...ESTILOS.input, width: "100%" }}
                value={rubricaDesconto}
                onChange={e => setRubricaDesconto(e.target.value)}
                placeholder="Digite ou selecione..."
              />
              <datalist id="opcoes-rubrica-desconto-payroll">
                {OPCOES_RUBRICA_DESCONTO_PAYROLL.map((op, i) => (
                  <option key={i} value={op} />
                ))}
              </datalist>
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Alíquota:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={aliquotaDesconto}
                onChange={onAliquotaDescontoChange}
                onBlur={onAliquotaDescontoBlur}
                placeholder="00,00%"
              />
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={valorDescontoTexto}
                onChange={e => setValorDescontoTexto(mascaraMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <button onClick={aplicarDescontoPayroll}>Aplicar Descontos</button>
          </div>

          {/* Quadro Descontos Aplicados */}
          <div style={{ marginTop: "15px" }}>
            <h3 style={{ color: "#0B2B4A" }}>Descontos Aplicados</h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Rúbrica</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Alíquota</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
                  <th style={{ padding: "8px", textAlign: "center" }}></th>
                </tr>
              </thead>
              <tbody>
                {listaDescontosAplicados.map(item => (
                  <tr key={item.rubrica}>
                    <td style={{ padding: "8px" }}>{item.rubrica}</td>
                    <td style={{ padding: "8px" }}>{item.aliquota}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      {formatarNumeroParaMoeda(item.valor)}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        onClick={() => removerDescontoPayroll(item.rubrica)}
                        style={{ color: "#b00020", border: "none", background: "none", cursor: "pointer" }}
                        title="Remover"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{
              marginTop: "10px",
              textAlign: "right",
              fontWeight: "bold",
              fontSize: "18px",
              background: "#f0f0f0",
              padding: "8px"
            }}>
              Total: R$ {formatarNumeroParaMoeda(totalDescontosAplicados)}
            </div>
          </div>

          {/* Total Líquido = Total das Vantagens - Total dos Descontos Aplicados */}
          <div style={{
            marginTop: "15px",
            textAlign: "right",
            fontWeight: "bold",
            fontSize: "18px",
            background: "#f0f0f0",
            padding: "8px"
          }}>
            Total Líquido&nbsp;&nbsp;R$ {formatarNumeroParaMoeda(totalLiquidoPayroll)}
          </div>
        </div>

        {/* Bases calculadas — duas colunas, rótulo à esquerda e valor à direita */}
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", marginTop: "15px" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Dias Trabalhados:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseDias)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Férias Indenizadas:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseFerias)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base 13° Salário:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBase13)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Pecúnia:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBasePecunia)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Auxilio Funeral:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseAuxilioFuneral)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base ATS:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseATS)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Auxílio Doença:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseAuxilioDoenca)}</span>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base IR:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseIR)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Previdência RPPS:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseRPPS)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", textAlign: "left" }}>
              <span>Valor Base Previdência INSS:</span>
              <span>R$ {formatarNumeroParaMoeda(valorBaseINSS)}</span>
            </div>
            <div style={{ ...ESTILOS.baseCalculo, display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
              <span style={{ fontWeight: "bold" }}>Valor do Redutor Constitucional</span>
              <input
                style={{ ...ESTILOS.inputTabela, width: "160px" }}
                value={redutorConstitucionalTexto}
                onChange={e => setRedutorConstitucionalTexto(mascaraMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
