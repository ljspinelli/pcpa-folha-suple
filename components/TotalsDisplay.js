import React from "react";
import { ESTILOS } from "../constants.js";
import { 
  calcularTotal, 
  calcularBaseCalculo, 
  formatarNumeroParaMoeda 
} from "../utils.js";

/**
 * Componente de exibição de totais e bases de cálculo
 */
export default function TotalsDisplay({ 
  valores, 
  codigosIR, 
  codigosRPPS, 
  codigosINSS 
}) {
  const total = calcularTotal(valores);
  const baseIR = calcularBaseCalculo(valores, codigosIR);
  const baseRPPS = calcularBaseCalculo(valores, codigosRPPS);
  const baseINSS = calcularBaseCalculo(valores, codigosINSS);

  return (
    <>
      {/* Total Geral */}
      <div style={ESTILOS.totalGeral}>
        Total: R$ {formatarNumeroParaMoeda(total)}
      </div>

      {/* Valor Base IR */}
      <div style={ESTILOS.baseCalculo}>
        Valor Base IR: R$ {formatarNumeroParaMoeda(baseIR)}
      </div>

      {/* Valor Base RPPS */}
      <div style={ESTILOS.baseCalculo}>
        Valor Base Previdência RPPS: R$ {formatarNumeroParaMoeda(baseRPPS)}
      </div>

      {/* Valor Base INSS */}
      <div style={ESTILOS.baseCalculo}>
        Valor Base Previdência INSS: R$ {formatarNumeroParaMoeda(baseINSS)}
      </div>
    </>
  );
}