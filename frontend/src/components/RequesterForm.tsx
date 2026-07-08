import React, { useState } from "react";

// Expressões regulares para validação dos campos
const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/;
const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const regexMatricula = /^\d{1,12}\/\d{2}$/;
const regexCargo = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/;
const regexProtocolo = /^\d{1,4}\/\d{1,12}$/;
const regexInteressado = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?()-]+$/;
const regexAssunto = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?()-]+$/;

export default function RequesterForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    cargo: "",
    protocolo: "",
    interessado: "",
    assunto: ""
  });

  const [errors, setErrors] = useState({});

  function validarCampo(nomeCampo: string, valor: string) {
    let valido = true;

    switch (nomeCampo) {
      case "nome":
        valido = regexNome.test(valor);
        break;
      case "cpf":
        valido = regexCPF.test(valor);
        break;
      case "matricula":
        valido = regexMatricula.test(valor);
        break;
      case "cargo":
        valido = regexCargo.test(valor);
        break;
      case "protocolo":
        valido = regexProtocolo.test(valor);
        break;
      case "interessado":
        valido = regexInteressado.test(valor);
        break;
      case "assunto":
        valido = regexAssunto.test(valor);
        break;
      default:
        valido = true;
    }

    setErrors(prev => ({
      ...prev,
      [nomeCampo]: valido ? "" : "Formato inválido"
    }));
  }

  function atualizarCampo(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    validarCampo(name, value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Identificação do Requerente</h2>

      <div>
        <label>Nome Completo:</label><br />
        <input
          name="nome"
          value={form.nome}
          onChange={atualizarCampo}
          placeholder="Ex: João da Silva 123"
        />
        <div style={{ color: "red" }}>{errors["nome"]}</div>
      </div>

      <div>
        <label>CPF:</label><br />
        <input
          name="cpf"
          value={form.cpf}
          onChange={atualizarCampo}
          placeholder="xxx.xxx.xxx-xx"
        />
        <div style={{ color: "red" }}>{errors["cpf"]}</div>
      </div>

      <div>
        <label>Matrícula:</label><br />
        <input
          name="matricula"
          value={form.matricula}
          onChange={atualizarCampo}
          placeholder="xxxxxxxxxxxx/xx"
        />
        <div style={{ color: "red" }}>{errors["matricula"]}</div>
      </div>

      <div>
        <label>Cargo:</label><br />
        <input
          name="cargo"
          value={form.cargo}
          onChange={atualizarCampo}
          placeholder="Ex: Investigador de Polícia"
        />
        <div style={{ color: "red" }}>{errors["cargo"]}</div>
      </div>

      <div>
        <label>Protocolo PAE:</label><br />
        <input
          name="protocolo"
          value={form.protocolo}
          onChange={atualizarCampo}
          placeholder="xxxx/xxxxxxxxxxxx"
        />
        <div style={{ color: "red" }}>{errors["protocolo"]}</div>
      </div>

      <div>
        <label>Interessado:</label><br />
        <input
          name="interessado"
          value={form.interessado}
          onChange={atualizarCampo}
          placeholder="Nome ou órgão interessado"
        />
        <div style={{ color: "red" }}>{errors["interessado"]}</div>
      </div>

      <div>
        <label>Assunto:</label><br />
        <input
          name="assunto"
          value={form.assunto}
          onChange={atualizarCampo}
          placeholder="Ex: Verbas Rescisórias"
        />
        <div style={{ color: "red" }}>{errors["assunto"]}</div>
      </div>
    </div>
  );
}
