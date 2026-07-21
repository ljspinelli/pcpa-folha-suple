// ============================
// COMPONENTE: AbaTabs
// ============================

const AbaTabs = ({ abaAtiva, setAbaAtiva }) => {
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
};
