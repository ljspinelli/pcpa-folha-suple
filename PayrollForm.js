// ============================
// COMPONENTE: PayrollForm (sem abas — lista única de rubricas)
// Um valor por rubrica, usado para compor várias "Bases" diferentes
// (Dias Trabalhados, Férias, 13º, Pecúnia, Auxílio Funeral, ATS,
// Auxílio Doença, além de IR/RPPS/INSS) simultaneamente.
// ============================

function PayrollForm({ onDadosChange }) {
  const [mesRef, setMesRef] = React.useState("");
  const [valores, setValores] = React.useState({});

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
        valorBaseINSS
      });
    }
  }, [mesRef, valores, onDadosChange]);

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

        {/* Bases calculadas — duas colunas */}
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", marginTop: "15px" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Dias Trabalhados: R$ {formatarNumeroParaMoeda(valorBaseDias)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Férias Indenizadas: R$ {formatarNumeroParaMoeda(valorBaseFerias)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base 13° Salário: R$ {formatarNumeroParaMoeda(valorBase13)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Pecúnia: R$ {formatarNumeroParaMoeda(valorBasePecunia)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Auxilio Funeral: R$ {formatarNumeroParaMoeda(valorBaseAuxilioFuneral)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Adicional de Tempo de Serviço: R$ {formatarNumeroParaMoeda(valorBaseATS)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Auxílio Doença: R$ {formatarNumeroParaMoeda(valorBaseAuxilioDoenca)}
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={ESTILOS.baseCalculo}>
              Valor Base IR: R$ {formatarNumeroParaMoeda(valorBaseIR)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Previdência RPPS: R$ {formatarNumeroParaMoeda(valorBaseRPPS)}
            </div>
            <div style={ESTILOS.baseCalculo}>
              Valor Base Previdência INSS: R$ {formatarNumeroParaMoeda(valorBaseINSS)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
