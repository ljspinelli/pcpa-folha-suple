// ============================
// COMPONENTE: TabContent
// ============================

const TabContent = ({ abaId, baseValue, setBaseValue, valoresData, setValoresData }) => {
  const rubricas = RUBRICAS_POR_ABA[abaId] || [];

  // Certifica que valoresData é um objeto válido
  const valores = valoresData || {};

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <label style={ESTILOS.label}>Base da Composição da Remuneração:</label>
        <br />
        <input
          style={ESTILOS.input}\n          value={baseValue}\n          onChange={e => setBaseValue(formatarMesRef(e.target.value))}\n          placeholder=\"Abr/2020\"\n        />\n      </div>\n\n      <div style={ESTILOS.containerTabela}>\n        <h3 style={{ color: \"#0B2B4A\" }}>Base da Composição da Remuneração</h3>\n\n        <RubricasTable \n          rubricas={rubricas}\n          valores={valores}\n          setValores={setValoresData}\n        />\n\n        <TotalsDisplay \n          valores={valores}\n          codigosIR={CODIGOS_BASE_IR}\n          codigosRPPS={CODIGOS_BASE_RPPS}\n          codigosINSS={CODIGOS_BASE_INSS}\n        />\n      </div>\n    </div>\n  );\n};
