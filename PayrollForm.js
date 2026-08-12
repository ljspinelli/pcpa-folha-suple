// ============================
// COMPONENTE: PayrollForm (sem abas — lista única de rubricas)
// Um valor por rubrica, usado para compor várias "Bases" diferentes
// (Dias Trabalhados, Férias, 13º, Pecúnia, Auxílio Funeral, ATS,
// Auxílio Doença, além de IR/RPPS/INSS) simultaneamente.
// ============================

function PayrollForm({ onDadosChange }) {
  const [mesRef, setMesRef] = React.useState("");
  const [valores, setValores] = React.useState({});
  const [redutorConstitucionalTexto, setRedutorConstitucionalTexto] = React.useState("");

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
