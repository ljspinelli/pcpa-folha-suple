// ============================
// COMPONENTE: TotalsDisplay
// ============================

const TotalsDisplay = ({ valores, codigosIR, codigosRPPS, codigosINSS }) => {
  const total = calcularTotal(valores);
  const baseIR = calcularBaseCalculo(valores, codigosIR);
  const baseRPPS = calcularBaseCalculo(valores, codigosRPPS);
  const baseINSS = calcularBaseCalculo(valores, codigosINSS);

  return (
    <>
      <div style={ESTILOS.totalGeral}>
        Total: R$ {formatarNumeroParaMoeda(total)}
      </div>

      <div style={ESTILOS.baseCalculo}>
        Valor Base IR: R$ {formatarNumeroParaMoeda(baseIR)}
      </div>

      <div style={ESTILOS.baseCalculo}>
        Valor Base Previdência RPPS: R$ {formatarNumeroParaMoeda(baseRPPS)}
      </div>

      <div style={ESTILOS.baseCalculo}>
        Valor Base Previdência INSS: R$ {formatarNumeroParaMoeda(baseINSS)}
      </div>
    </>
  );
};