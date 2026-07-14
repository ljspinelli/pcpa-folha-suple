// Máscara Nome Completo: letras com acentos + números
function mascaraNome(texto) {
  return texto.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g, "");
}

// Máscara CPF: xxx.xxx.xxx-xx
function mascaraCPF(texto) {
  let digitos = texto.replace(/\D/g, "").slice(0, 11);

  let parte1 = digitos.slice(0, 3);
  let parte2 = digitos.slice(3, 6);
  let parte3 = digitos.slice(6, 9);
  let parte4 = digitos.slice(9, 11);

  let resultado = "";
  if (parte1) resultado = parte1;
  if (parte2) resultado += "." + parte2;
  if (parte3) resultado += "." + parte3;
  if (parte4) resultado += "-" + parte4;

  return resultado;
}

// Máscara Matrícula: xxxxxxxxxxxx/xx
function mascaraMatricula(texto) {
  let digitos = texto.replace(/\D/g, "").slice(0, 14);

  let parte1 = digitos.slice(0, 12);
  let parte2 = digitos.slice(12, 14);

  let resultado = "";
  if (parte1) resultado = parte1;
  if (parte2) resultado += "/" + parte2;

  return resultado;
}

// Máscara Protocolo PAE: xxxx/xxxxxxxxxxxx
function mascaraPAE(texto) {
  let digitos = texto.replace(/\D/g, "").slice(0, 16);

  let parte1 = digitos.slice(0, 4);
  let parte2 = digitos.slice(4, 16);

  let resultado = "";
  if (parte1) resultado = parte1;
  if (parte2) resultado += "/" + parte2;

  return resultado;
}

// Máscara para Interessado e Assunto: letras com acentos + números + pontuação
function mascaraTextoLivre(texto) {
  return texto.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?()\-]/g, "");
}

function RequesterForm() {
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [matricula, setMatricula] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [pae, setPae] = React.useState("");
  const [interessado, setInteressado] = React.useState("");
  const [assunto, setAssunto] = React.useState("");

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

  const cargos = [
    "Agente de Artes Práticas", "Agente de Eletricidade", "Agente de Mecânica",
    "Agente de Portaria", "Assistente Administrativo", "Assistente de Informática",
    "Auxiliar de Escritório", "Auxiliar de Necropsia", "Auxiliar de Serviço de Comunicação",
    "Auxiliar de Serviços Gerais", "Auxiliar Técnico Polícia Civil", "Auxiliar de Unidade Policial",
    "Carregador", "Datilógrafo", "Delegado de Polícia", "Enfermeiro", "Escrivão de Polícia",
    "Estagiário NM - 20HS", "Estagiário NM - 30HS", "Estagiário NS - 20HS", "Estagiário NS - 30HS",
    "Faxineiro", "Fisioterapeuta", "Fonoaudiólogo", "Investigador de Polícia", "Médico",
    "Motorista", "Motorista Policial", "Odontólogo", "Papiloscopista", "Perito Policial",
    "Psicólogo", "Servente", "Serviços Prestados", "Técnico de Administração e Finanças",
    "Técnico em Gestão de Informática", "Técnico em Gestão de Infraestrutura",
    "Técnico em Gestão Pública", "Técnico em Saúde", "Técnico em Telefonia",
    "Vigilante", "Zelador"
  ];

  return (
    <div>

      {/* Nome Completo */}
      <label style={estiloLabel}>Nome Completo:</label><br />
      <input
        style={estiloInput}
        value={nome}
        onChange={e => setNome(mascaraNome(e.target.value))}
        placeholder="Digite o nome completo"
      />

      {/* CPF */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>CPF:</label><br />
        <input
          style={estiloInput}
          value={cpf}
          onChange={e => setCpf(mascaraCPF(e.target.value))}
          placeholder="xxx.xxx.xxx-xx"
        />
      </div>

      {/* Matrícula */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Matrícula:</label><br />
        <input
          style={estiloInput}
          value={matricula}
          onChange={e => setMatricula(mascaraMatricula(e.target.value))}
          placeholder="xxxxxxxxxxxx/xx"
        />
      </div>

      {/* Cargo */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Cargo:</label><br />
        <select
          style={estiloSelect}
          value={cargo}
          onChange={e => setCargo(e.target.value)}
        >
          <option value="">Selecione...</option>
          {cargos.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Protocolo PAE */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Protocolo PAE:</label><br />
        <input
          style={estiloInput}
          value={pae}
          onChange={e => setPae(mascaraPAE(e.target.value))}
          placeholder="xxxx/xxxxxxxxxxxx"
        />
      </div>

      {/* Interessado */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Interessado:</label><br />
        <input
          style={estiloInput}
          value={interessado}
          onChange={e => setInteressado(mascaraTextoLivre(e.target.value))}
          placeholder="Digite o interessado"
        />
      </div>

      {/* Assunto */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Assunto:</label><br />
        <input
          style={estiloInput}
          value={assunto}
          onChange={e => setAssunto(mascaraTextoLivre(e.target.value))}
          placeholder="Digite o assunto"
        />
      </div>

    </div>
  );
}
