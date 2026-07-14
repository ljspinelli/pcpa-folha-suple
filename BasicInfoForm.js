// Máscara de data DD/MM/AAAA com validação fluída
function mascaraData(texto) {
  let digitos = texto.replace(/\D/g, "").slice(0, 8);

  let dia = digitos.slice(0, 2);
  let mes = digitos.slice(2, 4);
  let ano = digitos.slice(4, 8);

  // Validação de dia
  if (dia.length === 2) {
    const d = Number(dia);
    if (d < 1 || d > 31) dia = "";
  }

  // Validação de mês
  if (mes.length === 2) {
    const m = Number(mes);
    if (m < 1 || m > 12) mes = "";
  }

  // Validação de ano (mínimo 1900, máximo 2100)
  if (ano.length === 4) {
    const a = Number(ano);
    if (a < 1900 || a > 2100) ano = "";
  }

  let resultado = "";
  if (dia) resultado = dia;
  if (mes) resultado += "/" + mes;
  if (ano) resultado += "/" + ano;

  return resultado;
}

function BasicInfoForm() {
  const [posse, setPosse] = React.useState("");
  const [motivoPosse, setMotivoPosse] = React.useState("");
  const [encerramento, setEncerramento] = React.useState("");
  const [motivoEncerramento, setMotivoEncerramento] = React.useState("");

  // Estilos padronizados conforme PayrollForm
  const estiloLabel = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0B2B4A"
  };

  const estiloInput = {
    fontSize: "15px",
    padding: "6px",
    width: "300px"
  };

  const estiloSelect = {
    fontSize: "15px",
    padding: "6px",
    width: "300px"
  };

  const motivosPosse = [
    "Nomeação por Concurso Publico",
    "Livre Nomeação",
    "Promoção",
    "Reintegração",
    "Transferência",
    "Reversão",
    "Aproveitamento",
    "Readaptação",
    "Recondução"
  ];

  const motivosEncerramento = [
    "Exoneração",
    "Demissão",
    "Promoção",
    "Aposentadoria",
    "Readaptação",
    "Falecimento",
    "Transferência",
    "Destituição"
  ];

  return (
    <div>

      {/* Data da Posse */}
      <label style={estiloLabel}>Data da Posse:</label><br />
      <input
        style={estiloInput}
        value={posse}
        onChange={e => setPosse(mascaraData(e.target.value))}
        placeholder="DD/MM/AAAA"
      />

      {/* Motivo da Posse */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Motivo da Posse:</label><br />
        <select
          style={estiloSelect}
          value={motivoPosse}
          onChange={e => setMotivoPosse(e.target.value)}
        >
          <option value="">Selecione...</option>
          {motivosPosse.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Data de Encerramento */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Data de Encerramento de Vínculo:</label><br />
        <input
          style={estiloInput}
          value={encerramento}
          onChange={e => setEncerramento(mascaraData(e.target.value))}
          placeholder="DD/MM/AAAA"
        />
      </div>

      {/* Motivo de Encerramento */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Motivo de Encerramento de Vínculo:</label><br />
        <select
          style={estiloSelect}
          value={motivoEncerramento}
          onChange={e => setMotivoEncerramento(e.target.value)}
        >
          <option value="">Selecione...</option>
          {motivosEncerramento.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
