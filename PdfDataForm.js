// ============================
// COMPONENTE: PdfDataForm
// Dados para Emissão do PDF — informações que só existem para
// compor o documento final (não entram em nenhum cálculo).
// ============================

function PdfDataForm({ onDadosChange }) {
  const [abaReferencia, setAbaReferencia] = React.useState("");
  const [numeroFolha, setNumeroFolha] = React.useState("");
  const [nomeAssinante, setNomeAssinante] = React.useState("");
  const [cargoAssinante, setCargoAssinante] = React.useState("");
  const [matriculaAssinante, setMatriculaAssinante] = React.useState("");

  // Repassa todos os dados para cima sempre que algo mudar
  React.useEffect(() => {
    if (typeof onDadosChange === "function") {
      onDadosChange({
        abaReferencia,
        numeroFolha,
        nomeAssinante,
        cargoAssinante,
        matriculaAssinante
      });
    }
  }, [abaReferencia, numeroFolha, nomeAssinante, cargoAssinante, matriculaAssinante, onDadosChange]);

  return (
    <div style={ESTILOS.containerPrincipal}>

      {/* Linha 1: Aba de Referência + Número da Folha */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label style={ESTILOS.label}>Aba de Referência da Folha Suplementar:</label><br />
          <select
            style={{ ...ESTILOS.select, width: "100%" }}
            value={abaReferencia}
            onChange={e => setAbaReferencia(e.target.value)}
          >
            <option value="">Selecione...</option>
            {ABAS_INFO.map(aba => (
              <option key={aba.id} value={aba.id}>{aba.label}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "200px" }}>
          <label style={ESTILOS.label}>Número da Folha Suplementar:</label><br />
          <input
            style={{ ...ESTILOS.input, width: "100%" }}
            value={numeroFolha}
            onChange={e => setNumeroFolha(e.target.value)}
            placeholder="059/2025"
          />
        </div>
      </div>

      {/* Linha 3: Dados de quem assina */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#0B2B4A" }}>Responsável pela Assinatura</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "220px" }}>
            <label style={ESTILOS.label}>Nome:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={nomeAssinante}
              onChange={e => setNomeAssinante(mascaraNome(e.target.value))}
              placeholder="Digite o nome completo"
            />
          </div>

          <div style={{ flex: "2", minWidth: "220px" }}>
            <label style={ESTILOS.label}>Cargo:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={cargoAssinante}
              onChange={e => setCargoAssinante(mascaraTextoLivre(e.target.value))}
              placeholder="Ex: Assistente Administrativo - DRH/DPP/PCPA"
            />
          </div>

          <div style={{ flex: "1", minWidth: "160px" }}>
            <label style={ESTILOS.label}>Matrícula:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={matriculaAssinante}
              onChange={e => setMatriculaAssinante(mascaraMatricula(e.target.value))}
              placeholder="xxxxxxxxxxxx/xx"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
