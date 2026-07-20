import React from "react";
import { ABAS_INFO, ESTILOS } from "../constants.js";

/**
 * Componente de navegação entre abas
 */
export default function AbaTabs({ abaAtiva, setAbaAtiva }) {
  return (
    <div style={ESTILOS.navAbas}>
      {ABAS_INFO.map((aba) => (
        <button
          key={aba.id}
          onClick={() => setAbaAtiva(aba.id)}
          style={abaAtiva === aba.id ? ESTILOS.botaoAbaAtivo : ESTILOS.botaoAba}
        >
          {aba.label}
        </button>
      ))}
    </div>
  );
}