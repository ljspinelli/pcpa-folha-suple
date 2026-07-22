// ============================
// COMPONENTE: PayrollForm (refatorado)
// ============================

function PayrollForm({ onTotalChange, onDecimoFeriasChange }) {
  const [abaAtiva, setAbaAtiva] = React.useState("dias");
  const [bases, setBases] = React.useState({
    dias: "",
    ferias: "",
    decimo: "",
    pecunia: "",
    auxilioFuneral: "",
    ats: "",
    auxilioDoenca: ""
  });
  const [valores, setValores] = React.useState({
    dias: {},
    ferias: {},
    decimo: {},
    pecunia: {},
    auxilioFuneral: {},
    ats: {},
    auxilioDoenca: {}
  });

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

  // 🔥 CORREÇÃO CRÍTICA — soma os valores de TODAS as abas
  // (não só a aba ativa) e envia o total para o App.js
  React.useEffect(() => {
    const totalGeral = ABAS_INFO.reduce((acc, aba) => {
      return acc + calcularTotal(valores[aba.id] || {});
    }, 0);

    if (typeof onTotalChange === "function") {
      onTotalChange(totalGeral);
    }
  }, [valores, onTotalChange]);

  // Repassa para o App.js o Valor Base (soma das rubricas da aba) e o
  // mês/ano de referência do 13º e das Férias, para o quadro de cálculo
  // de avos (ThirteenthVacationForm).
  React.useEffect(() => {
    if (typeof onDecimoFeriasChange === "function") {
      onDecimoFeriasChange({
        valorBase13: calcularTotal(valores.decimo || {}),
        mesRef13: bases.decimo,
        valorBaseFerias: calcularTotal(valores.ferias || {}),
        mesRefFerias: bases.ferias
      });
    }
  }, [valores, bases, onDecimoFeriasChange]);

  return (
    <div style={ESTILOS.containerPrincipal}>
      <AbaTabs abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

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
