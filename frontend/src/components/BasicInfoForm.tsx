import React, { useState } from "react";

// Expressões regulares para validação
const regexCargo = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
const regexData = /^\d{2}\/\d{2}\/\d{4}$/;

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
        valido = regexCargo.test(valor);
        break;
      case "dataPosse":
        valido = regexData.test(valor);
        break;
      case "dataEncerramento":
        valido = regexData.test(valor);
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
        <input
          name="cargo"
          value={form.cargo}
          onChange={atualizarCampo}
          placeholder="Ex: Investigador"
        />
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
          {motivosPosse.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
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
          {motivosEncerramento.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
