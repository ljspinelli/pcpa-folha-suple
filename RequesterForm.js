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

// Valida o CPF pelo algoritmo oficial dos dígitos verificadores
// (módulo 11). Recebe o CPF formatado ou só os dígitos.
function validarCPF(cpfTexto) {
  const digitos = cpfTexto.replace(/\D/g, "");
  if (digitos.length !== 11) return false;

  // Rejeita sequências óbvias inválidas (000.000.000-00, 111.111.111-11, etc.)
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(digitos[i]) * (10 - i);
  let resto = soma % 11;
  const dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== Number(digitos[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(digitos[i]) * (11 - i);
  resto = soma % 11;
  const dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== Number(digitos[10])) return false;

  return true;
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

function RequesterForm({ onDadosChange }) {
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [matricula, setMatricula] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [pae, setPae] = React.useState("");
  const [interessado, setInteressado] = React.useState("");
  const [assunto, setAssunto] = React.useState("");

  // Repassa os dados do requerente para cima (uso no PDF)
  React.useEffect(() => {
    if (typeof onDadosChange === "function") {
      onDadosChange({ nome, cpf, matricula, cargo, pae, interessado, assunto });
    }
  }, [nome, cpf, matricula, cargo, pae, interessado, assunto, onDadosChange]);


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
      <label style={ESTILOS.label}>Nome Completo:</label><br />
      <input
        style={ESTILOS.input}
        value={nome}
        onChange={e => setNome(mascaraNome(e.target.value))}
        placeholder="Digite o nome completo"
      />

      {/* CPF */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>CPF:</label><br />
        <input
          style={{
            ...ESTILOS.input,
            ...(cpf.length === 14 && !validarCPF(cpf)
              ? { border: "1px solid #b00020" }
              : {})
          }}
          value={cpf}
          onChange={e => setCpf(mascaraCPF(e.target.value))}
          placeholder="xxx.xxx.xxx-xx"
        />
        {cpf.length === 14 && !validarCPF(cpf) && (
          <div style={{ color: "#b00020", fontSize: "13px", marginTop: "4px" }}>
            CPF inválido — confira os números digitados.
          </div>
        )}
      </div>

      {/* Matrícula */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Matrícula:</label><br />
        <input
          style={ESTILOS.input}
          value={matricula}
          onChange={e => setMatricula(mascaraMatricula(e.target.value))}
          placeholder="xxxxxxxxxxxx/xx"
        />
      </div>

      {/* Cargo */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Cargo:</label><br />
        <select
          style={ESTILOS.select}
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
        <label style={ESTILOS.label}>Protocolo PAE:</label><br />
        <input
          style={ESTILOS.input}
          value={pae}
          onChange={e => setPae(mascaraPAE(e.target.value))}
          placeholder="xxxx/xxxxxxxxxxxx"
        />
      </div>

      {/* Interessado */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Interessado:</label><br />
        <input
          style={ESTILOS.input}
          value={interessado}
          onChange={e => setInteressado(mascaraTextoLivre(e.target.value))}
          placeholder="Digite o interessado"
        />
      </div>

      {/* Assunto */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Assunto:</label><br />
        <input
          style={ESTILOS.input}
          value={assunto}
          onChange={e => setAssunto(mascaraTextoLivre(e.target.value))}
          placeholder="Digite o assunto"
        />
      </div>

    </div>
  );
}
