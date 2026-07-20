// ============================
// COMPONENTE: TabContent
// ============================

const TabContent = ({ abaId, baseValue, setBaseValue, valoresData, setValoresData }) => {
  const rubricas = RUBRICAS_POR_ABA[abaId] || [];

  return (
    <div>
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

      <div style={ESTILOS.containerTabela}>
        <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

        <RubricasTable 
          rubricas={rubricas}
          valores={valoresData}
          setValores={setValoresData}
        />

        <TotalsDisplay 
          valores={valoresData}
          codigosIR={CODIGOS_BASE_IR}
          codigosRPPS={CODIGOS_BASE_RPPS}
          codigosINSS={CODIGOS_BASE_INSS}
        />
      </div>
    </div>
  );
};