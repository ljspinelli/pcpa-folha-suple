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

  // Quando a data está completa, valida a combinação real do
  // calendário (evita datas como 31/02/2023 ou 31/04/2023, que
  // passariam pelas validações de intervalo acima mas não existem).
  if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
    const diaNum = Number(dia);
    const mesNum = Number(mes);
    const anoNum = Number(ano);
    const dataTeste = new Date(anoNum, mesNum - 1, diaNum);
    const dataValida =
      dataTeste.getFullYear() === anoNum &&
      dataTeste.getMonth() === mesNum - 1 &&
      dataTeste.getDate() === diaNum;

    if (!dataValida) {
      dia = "";
      mes = "";
      ano = "";
    }
  }

  let resultado = "";
  if (dia) resultado = dia;
  if (mes) resultado += "/" + mes;
  if (ano) resultado += "/" + ano;

  return resultado;
}

function BasicInfoForm({ onDadosChange }) {
  const [posse, setPosse] = React.useState("");
  const [motivoPosse, setMotivoPosse] = React.useState("");
  const [encerramento, setEncerramento] = React.useState("");
  const [motivoEncerramento, setMotivoEncerramento] = React.useState("");

  // Repassa os dados de vínculo para cima (uso no PDF)
  React.useEffect(() => {
    if (typeof onDadosChange === "function") {
      onDadosChange({ posse, motivoPosse, encerramento, motivoEncerramento });
    }
  }, [posse, motivoPosse, encerramento, motivoEncerramento, onDadosChange]);

  const motivosPosse = [
    "Nomeação por Concurso Publico",
    "Contrato Temporário",
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
    "Distrato",
  ];

  // Validação cruzada: Data de Encerramento não pode ser anterior à
  // Data da Posse. Só avalia quando as duas datas estão completas.
  let encerramentoAnteriorAPosse = false;
  if (posse.length === 10 && encerramento.length === 10) {
    const dataPosse = parseDataBR(posse);
    const dataEncerramento = parseDataBR(encerramento);
    if (dataPosse && dataEncerramento && dataEncerramento < dataPosse) {
      encerramentoAnteriorAPosse = true;
    }
  }

  return (
    <div>

      {/* Data da Posse */}
      <label style={ESTILOS.label}>Data da Posse:</label><br />
      <input
        style={ESTILOS.input}
        value={posse}
        onChange={e => setPosse(mascaraData(e.target.value))}
        placeholder="DD/MM/AAAA"
      />

      {/* Motivo da Posse */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Motivo da Posse:</label><br />
        <select
          style={ESTILOS.select}
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
        <label style={ESTILOS.label}>Data de Encerramento de Vínculo:</label><br />
        <input
          style={{
            ...ESTILOS.input,
            ...(encerramentoAnteriorAPosse ? { border: "1px solid #b00020" } : {})
          }}
          value={encerramento}
          onChange={e => setEncerramento(mascaraData(e.target.value))}
          placeholder="DD/MM/AAAA"
        />
        {encerramentoAnteriorAPosse && (
          <div style={{ color: "#b00020", fontSize: "13px", marginTop: "4px" }}>
            A Data de Encerramento não pode ser anterior à Data da Posse.
          </div>
        )}
      </div>

      {/* Motivo de Encerramento */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Motivo de Encerramento de Vínculo:</label><br />
        <select
          style={ESTILOS.select}
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
