// Formatar moeda brasileira sempre com 2 casas decimais
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function NetValueForm({ totalVantagens, totalDescontos }) {
  // Cálculo do valor líquido
  const valorLiquido = totalVantagens - totalDescontos;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "#0B2B4A" }}>Valor Líquido</h3>

      {/* Total de Vantagens */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Total de Vantagens:</label><br />
        <input
          style={ESTILOS.inputSomenteLeitura}
          value={formatarMoeda(totalVantagens)}
          readOnly
        />
      </div>

      {/* Total de Descontos */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Total de Descontos:</label><br />
        <input
          style={ESTILOS.inputSomenteLeitura}
          value={formatarMoeda(totalDescontos)}
          readOnly
        />
      </div>

      {/* Valor Líquido */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Valor Líquido:</label><br />
        <input
          style={ESTILOS.inputDestaque}
          value={formatarMoeda(valorLiquido)}
          readOnly
        />
      </div>
    </div>
  );
}
