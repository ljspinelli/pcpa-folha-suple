import React from "react";
import { ESTILOS } from "../constants.js";
import { mascaraMoeda } from "../utils.js";

/**
 * Componente de tabela de rubricas
 */
export default function RubricasTable({ rubricas, valores, setValores }) {
  const handleChange = (codigo, novoValor) => {
    const valorFormatado = mascaraMoeda(novoValor);
    setValores(prev => ({
      ...prev,
      [codigo]: valorFormatado
    }));
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
      <thead>
        <tr style={{ background: "#f0f0f0" }}>
          <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
          <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
        </tr>
      </thead>
      <tbody>
        {rubricas.map((rub, index) => (
          <tr key={index}>
            <td style={{ padding: "8px" }}>
              {rub.codigo} - {rub.nome}
            </td>
            <td style={{ padding: "8px", textAlign: "right" }}>
              <input
                style={{
                  ...ESTILOS.inputTabela,
                  width: "180px"
                }}
                value={valores[rub.codigo] || ""}
                onChange={e => handleChange(rub.codigo, e.target.value)}
                placeholder=""
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}