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
  const [form, setForm] = React.useState({
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
      <div>
        <label>Cargo:</label><br />
        <select name="cargo" value={form.cargo} onChange={atualizar}>
          <option value="">Selecione...</option>
          {cargos.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Data da Posse:</label><br />
        <input
          name="dataPosse"
          value={form.dataPosse}
          onChange={atualizar}
          placeholder="DD/MM/AAAA"
        />
      </div>

      <div>
        <label>Motivo da Posse:</label><br />
        <select name="motivoPosse" value={form.motivoPosse} onChange={atualizar}>
          <option value="">Selecione...</option>
          {motivosPosse.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Data de Encerramento:</label><br />
        <input
          name="dataEncerramento"
          value={form.dataEncerramento}
          onChange={atualizar}
          placeholder="DD/MM/AAAA"
        />
      </div>

      <div>
        <label>Motivo de Encerramento:</label><br />
        <select
          name="motivoEncerramento"
          value={form.motivoEncerramento}
          onChange={atualizar}
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
