import React from "react";
import { ESTILOS, RUBRICAS_POR_ABA, CODIGOS_BASE_IR, CODIGOS_BASE_RPPS, CODIGOS_BASE_INSS } from "../constants.js";
import { formatarMesRef } from "../utils.js";
import RubricasTable from "./RubricasTable.js";
import TotalsDisplay from "./TotalsDisplay.js";

/**
 * Componente de conteúdo de cada aba
 */
export default function TabContent({ 
  abaId, 
  baseValue, 
  setBaseValue, 
  valoresData, 
  setValoresData 
}) {
  const rubricas = RUBRICAS_POR_ABA[abaId] || [];

  return (
    <div>
      {/* Campo: Base da Composição da Remuneração */}
      <div style={{ marginBottom: "20px" }}>
        <label style={ESTILOS.label}>Base da Composição da Remuneração:</label>
        <br />
        <input
          style={ESTILOS.input}
          value={baseValue}
          onChange={e => setBaseValue(formatarMesRef(e.target.value))}
          placeholder="Abr/2020"
        />
      </div>

      {/* Tabela de Rubricas + Campos de Valor */}
      <div style={ESTILOS.containerTabela}>
        <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

        <RubricasTable 
          rubricas={rubricas}
          valores={valoresData}
          setValores={setValoresData}
        />

        {/* Totais e Bases */}
        <TotalsDisplay 
          valores={valoresData}
          codigosIR={CODIGOS_BASE_IR}
          codigosRPPS={CODIGOS_BASE_RPPS}
          codigosINSS={CODIGOS_BASE_INSS}
        />
      </div>
    </div>
  );
}