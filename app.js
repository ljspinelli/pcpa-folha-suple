const { useState } = React;

/* ============================
   PageLayout
============================ */
function PageLayout({ children }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f8"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ color: "#0B2B4A", marginBottom: "10px" }}>
          Folha Suplementar – PCPA
        </h1>
        <p style={{ marginTop: "0" }}>
          Protótipo inicial para substituir planilhas Excel no cálculo de
          13º proporcional e férias proporcionais.
        </p>
      </div>

      {children}
    </div>
  );
}

/* ============================
   RequesterForm
============================ */
function RequesterForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    cargo: "",
    protocolo: "",
    interessado: "",
    assunto: ""
  });

  function atualizar(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      {Object.keys(form).map((campo, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <label>{campo.toUpperCase()}:</label><br />
          <input
            name={campo}
            value={form[campo]}
            onChange={atualizar}
            style={{ width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
}

/* ============================
   BasicInfoForm
============================ */
const cargos = [
  "Agente de Artes Práticas",
  "Agente de Eletricidade",
  "Agente de Mecânica",
  "Agente de Portaria",
  "Assistente Administrativo",
  "Assistente de Informática",
  "Auxiliar de Escritório",
  "Auxiliar de Necropsia",
  "Auxiliar de Serviço de Comunicação",
  "Auxiliar de Serviços Gerais",
  "Auxiliar Técnico Polícia Civil",
  "Auxiliar de Unidade Policial",
  "Carregador",
  "Datilógrafo",
  "Delegado de Polícia",
  "Enfermeiro",
  "Escrivão de Polícia",
  "Estagiário NM - 20HS",
  "Estagiário NM - 30HS",
  "Estagiário NS - 20HS",
  "Estagiário NS - 30HS",
  "Faxineiro",
  "Fisioterapeuta",
  "Fonoaudiólogo",
  "Investigador de Polícia",
  "Médico",
  "Motorista",
  "Motorista Policial",
  "Odontólogo",
  "Papiloscopista",
  "Perito Policial",
  "Psicólogo",
  "Servente",
  "Serviços Prestados",
  "Técnico de Administração e Finanças",
  "Técnico em Gestão de Informática",
  "Técnico em Gestão de Infraestrutura",
  "Técnico em Gestão Pública",
  "Técnico em Saúde",
  "Técnico em Telefonia",
  "Vigilante",
  "Zelador"
];

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

function BasicInfoForm() {
  const [form, setForm] = useState({
    cargo: "",
    dataPosse: "",
    motivoPosse: "",
    dataEncerramento: "",
    motivoEncerramento: ""
  });

  function atualizar(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      {/* Cargo */}
      <div>
        <label>Cargo:</label><br />
