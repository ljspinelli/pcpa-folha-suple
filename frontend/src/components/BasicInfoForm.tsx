import React, { useState } from "react";

// Expressões regulares
const regexData = /^\d{2}\/\d{2}\/\d{4}$/;

// Lista exaustiva de Cargos
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

// Listas exaustivas de motivos
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

export default function BasicInfoForm() {
  const [form, setForm] = useState({
    cargo: "",
    dataPosse: "",
    motivoPosse: "",
    dataEncerramento: "",
    motivoEncerramento: ""
  });

  const [errors, setErrors] = useState({});

  function validarCampo(nomeCampo: string, valor: string) {
    let valido = true;

    switch (nomeCampo) {
      case "cargo":
        valido = cargos.includes(valor);
        break;
      case "dataPosse":
      case "dataEncerramento":
        valido = regexData.test(valor);
        break;
      case "motivoPosse":
        valido = motivosPosse.includes(valor);
        break;
      case "motivoEncerramento":
        valido = motivosEncerramento.includes(valor);
        break;
      default:
        valido = true;
    }

    setErrors(prev => ({
      ...prev,
      [nomeCampo]: valido ? "" : "Formato inválido"
    }));
  }

  function atualizarCampo(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    validarCampo(name, value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Informações Preliminares</h2>

      {/* Cargo */}
      <div>
        <label>Cargo:</label><br />
        <select
          name="cargo"
          value={form.cargo}
          onChange={atualizarCampo}
        >
          <option value="">Selecione...</option>
          {cargos.map((cargo, index) => (
            <option key={index} value={cargo}>{cargo}</option>
          ))}
        </select>
        <div style={{ color: "red" }}>{errors["cargo"]}</div>
      </div>

      {/* Data da Posse */}
      <div>
        <label>Data da Posse:</label><br />
        <input
          name="dataPosse"
          value={form.dataPosse}
          onChange={atualizarCampo}
          placeholder="DD/MM/AAAA"
        />
        <div style={{ color: "red" }}>{errors["dataPosse"]}</div>
      </div>

      {/* Motivo da Posse */}
      <div>
        <label>Motivo da Posse:</label><br />
        <select
          name="motivoPosse"
          value={form.motivoPosse}
          onChange={atualizarCampo}
        >
          <option value="">Selecione...</option>
          {motivosPosse.map((motivo, index) => (
            <option key={index} value={motivo}>{motivo}</option>
          ))}
        </select>
        <div style={{ color: "red" }}>{errors["motivoPosse"]}</div>
      </div>

      {/* Data de Encerramento */}
      <div>
        <label>Data de Encerramento de Vínculo:</label><br />
        <input
          name="dataEncerramento"
          value={form.dataEncerramento}
          onChange={atualizarCampo}
          placeholder="DD/MM/AAAA"
        />
        <div style={{ color: "red" }}>{errors["dataEncerramento"]}</div>
      </div>

      {/* Motivo de Encerramento */}
      <div>
        <label>Motivo de Encerramento de Vínculo:</label><br />
        <select
          name="motivoEncerramento"
          value={form.motivoEncerramento}
          onChange={atualizarCampo}
        >
          <option value="">Selecione...</option>
          {motivosEncerramento.map((motivo, index) => (
            <option key={index} value={motivo}>{motivo}</option>
          ))}
        </select>
        <div style={{ color: "red" }}>{errors["motivoEncerramento"]}</div>
      </div>
    </div>
  );
}
