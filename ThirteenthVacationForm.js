// ============================
// COMPONENTE: ThirteenthVacationForm
// Cálculo por avos (÷12) do 13º Salário e das Férias, com
// valor mensal e valor diário proporcional.
// ============================

function ThirteenthVacationForm({ valorBase13, mesRef13, valorBaseFerias, mesRefFerias }) {
  // --- 13º Salário ---
  const valorMensal13 = arredondarPadrao(valorBase13 / 12);
  const diasMes13 = diasNoMes(mesRef13);
  const valorDiario13 = arredondarPadrao(valorMensal13 / diasMes13);

  // --- Férias ---
  // Regra específica: Valor Base × 0,3333 (não é avos ÷12 como o 13º)
  const valorMensalFerias = arredondarPadrao(valorBaseFerias * 0.3333);
  // Valor Mensal do 1/3 de Férias: o "1/3 de Férias" dividido por 12,
  // usado como taxa mensal (equivalente ao "Valor Mensal ÷12" do 13º)
  const valorMensalDoTerco = arredondarPadrao(valorMensalFerias / 12);

  return (
    <div style={ESTILOS.containerPrincipal}>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

        {/* 13º Salário */}
        <div style={{ ...ESTILOS.containerTabela, flex: "1", minWidth: "280px" }}>
          <h3 style={{ color: "#0B2B4A" }}>Cálculo de 13º</h3>

          <div>
            <label style={ESTILOS.label}>Valor Base 13º:</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorBase13)}
              readOnly
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Mensal (Base ÷ 12):</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorMensal13)}
              readOnly
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>
              Valor Diário Proporcional (÷ {diasMes13} dias de {mesRef13 || "—"}):
            </label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorDiario13)}
              readOnly
            />
          </div>
        </div>

        {/* Férias */}
        <div style={{ ...ESTILOS.containerTabela, flex: "1", minWidth: "280px" }}>
          <h3 style={{ color: "#0B2B4A" }}>Cálculo de Férias</h3>

          <div>
            <label style={ESTILOS.label}>Valor Base Férias:</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorBaseFerias)}
              readOnly
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>1/3 de Férias:</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorMensalFerias)}
              readOnly
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Mensal do 1/3 de Férias:</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorMensalDoTerco)}
              readOnly
            />
          </div>
        </div>

      </div>

      <PeriodosAquisitivosForm
        valorMensal13={valorMensal13}
        valorBaseFerias={valorBaseFerias}
        valorTotalTerco={valorMensalFerias}
        valorMensalDoTerco={valorMensalDoTerco}
      />
    </div>
  );
}
