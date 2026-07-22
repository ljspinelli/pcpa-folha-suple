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
  const valorMensalFerias = arredondarPadrao(valorBaseFerias / 12);
  const diasMesFerias = diasNoMes(mesRefFerias);
  const valorDiarioFerias = arredondarPadrao(valorMensalFerias / diasMesFerias);

  return (
    <div style={ESTILOS.containerPrincipal}>

      {/* 13º Salário */}
      <div style={ESTILOS.containerTabela}>
        <h3 style={{ color: "#0B2B4A" }}>Cálculo de 13º</h3>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>Valor Base 13º:</label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorBase13)}
              readOnly
            />
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>Valor Mensal (Base ÷ 12):</label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorMensal13)}
              readOnly
            />
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>
              Valor Diário Proporcional (÷ {diasMes13} dias de {mesRef13 || "—"}):
            </label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorDiario13)}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Férias */}
      <div style={{ ...ESTILOS.containerTabela, marginTop: "20px" }}>
        <h3 style={{ color: "#0B2B4A" }}>Cálculo de Férias</h3>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>Valor Base Férias:</label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorBaseFerias)}
              readOnly
            />
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>Valor Mensal (Base ÷ 12):</label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorMensalFerias)}
              readOnly
            />
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={ESTILOS.label}>
              Valor Diário Proporcional (÷ {diasMesFerias} dias de {mesRefFerias || "—"}):
            </label><br />
            <input
              style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
              value={formatarNumeroParaMoeda(valorDiarioFerias)}
              readOnly
            />
          </div>
        </div>
      </div>

    </div>
  );
}
