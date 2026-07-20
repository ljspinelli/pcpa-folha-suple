import React from "react";
import { ABAS_INFO, ESTILOS } from "./constants.js";
import AbaTabs from "./components/AbaTabs.js";
import TabContent from "./components/TabContent.js";

/**
 * Componente principal do Formulário de Folha de Pagamento
 * Gerencia 7 abas com diferentes tipos de remuneração
 */
export default function PayrollForm() {
  // ============================
  // ESTADO DA ABA ATIVA
  // ============================
  const [abaAtiva, setAbaAtiva] = React.useState("dias");

  // ============================
  // ESTADO CONSOLIDADO DE BASES
  // ============================
  const [bases, setBases] = React.useState({
    dias: "",
    ferias: "",
    decimo: "",
    pecunia: "",
    auxilioFuneral: "",
    ats: "",
    auxilioDoenca: ""
  });

  // ============================
  // ESTADO CONSOLIDADO DE VALORES
  // ============================
  const [valores, setValores] = React.useState({
    dias: {},
    ferias: {},
    decimo: {},
    pecunia: {},
    auxilioFuneral: {},
    ats: {},
    auxilioDoenca: {}
  });

  // ============================
  // HANDLERS
  // ============================
  const handleSetBase = (abaId, novoValor) => {
    setBases(prev => ({
      ...prev,
      [abaId]: novoValor
    }));
  };

  const handleSetValores = (abaId, novoValores) => {
    setValores(prev => ({
      ...prev,
      [abaId]: novoValores
    }));
  };

  return (
    <div style={ESTILOS.containerPrincipal}>
      {/* ============================
          NAVEGAÇÃO ENTRE ABAS
      ============================ */}
      <AbaTabs abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

      {/* ============================
          CONTEÚDO DAS ABAS
      ============================ */}
      {ABAS_INFO.map(aba => (
        abaAtiva === aba.id && (
          <TabContent
            key={aba.id}
            abaId={aba.id}
            baseValue={bases[aba.id]}
            setBaseValue={(v) => handleSetBase(aba.id, v)}
            valoresData={valores[aba.id]}
            setValoresData={(v) => handleSetValores(aba.id, v)}
          />
        )
      ))}
    </div>
  );
}