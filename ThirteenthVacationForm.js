// ============================
// COMPONENTE: ThirteenthVacationForm
// Cálculo por avos (÷12) do 13º Salário e das Férias, com
// valor mensal e valor diário proporcional.
// ============================

function ThirteenthVacationForm({ valorBase13, mesRef13, valorBaseFerias, mesRefFerias }) {
  // --- 13º Salário ---
  const valorMensal13 = arredondarPadrao(valorBase13 / 12);
  const diasMes13 = diasNoMes(mesRef13);
  const valorDiario13 = arredondarPadrao(valorBase13 / diasMes13);

  // --- Férias ---
  const valorBaseMensal = arredondarPadrao(valorBaseFerias / 12);
  const valorBaseMensalDoTerco = arredondarPadrao(valorBaseMensal / 3);
  const valorMensalDoAvo = arredondarPadrao(valorBaseMensal + valorBaseMensalDoTerco);
  const valorTercoFerias = arredondarPadrao(valorMensalDoAvo * 12);

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

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor Base Férias:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={formatarNumeroParaMoeda(valorBaseFerias)}
                readOnly
              />
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor Base Mensal:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={formatarNumeroParaMoeda(valorBaseMensal)}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor Base Mensal do 1/3:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={formatarNumeroParaMoeda(valorBaseMensalDoTerco)}
                readOnly
              />
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor Mensal do Avo de Férias:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={formatarNumeroParaMoeda(valorMensalDoAvo)}
                readOnly
              />
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor 1/3 de Férias:</label><br />
            <input
              style={ESTILOS.inputSomenteLeitura}
              value={formatarNumeroParaMoeda(valorTercoFerias)}
              readOnly
            />
          </div>
        </div>

      </div>

      <PeriodosAquisitivosForm
        valorMensal13={valorMensal13}
        valorBaseFerias={valorBaseFerias}
        valorTotalTerco={valorTercoFerias}
        valorMensalDoTerco={valorMensalDoAvo}
        onTotalChange={onTotalPeriodosChange}
      />
    </div>
  );
}
