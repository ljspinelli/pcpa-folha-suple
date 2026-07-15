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

  const estiloLabel = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0B2B4A"
  };

  const estiloInput = {
    fontSize: "15px",
    padding: "6px",
    width: "300px",
    backgroundColor: "#f7f7f7",
    border: "1px solid #ccc",
    borderRadius: "4px"
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "#0B2B4A" }}>Valor Líquido</h3>

      {/* Total de Vantagens */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Total de Vantagens:</label><br />
        <input
          style={estiloInput}
          value={formatarMoeda(totalVantagens)}
          readOnly
        />
      </div>

      {/* Total de Descontos */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Total de Descontos:</label><br />
        <input
          style={estiloInput}
          value={formatarMoeda(totalDescontos)}
          readOnly
        />
      </div>

      {/* Valor Líquido */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor Líquido:</label><br />
        <input
          style={{
            ...estiloInput,
            fontWeight: "bold",
            color: "#0B2B4A",
            backgroundColor: "#e8f5e9"
          }}
          value={formatarMoeda(valorLiquido)}
          readOnly
        />
      </div>
    </div>
  );
}
