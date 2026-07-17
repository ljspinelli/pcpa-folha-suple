import React from "react";

export default function PayrollForm() {

  // ============================
  // ESTADOS DAS 7 ABAS
  // ============================
  const [abaAtiva, setAbaAtiva] = React.useState("dias");

  const [baseComposicao, setBaseComposicao] = React.useState("");
  const [valoresAba1, setValoresAba1] = React.useState({});

  const [baseFerias, setBaseFerias] = React.useState("");
  const [valoresAba2, setValoresAba2] = React.useState({});

  const [baseDecimo, setBaseDecimo] = React.useState("");
  const [valoresAba3, setValoresAba3] = React.useState({});

  const [basePecunia, setBasePecunia] = React.useState("");
  const [valoresAba4, setValoresAba4] = React.useState({});

  const [baseAuxilioFuneral, setBaseAuxilioFuneral] = React.useState("");
  const [valoresAba5, setValoresAba5] = React.useState({});

  const [baseATS, setBaseATS] = React.useState("");
  const [valoresAba6, setValoresAba6] = React.useState({});

  const [baseAuxilioDoenca, setBaseAuxilioDoenca] = React.useState("");
  const [valoresAba7, setValoresAba7] = React.useState({});


  // ============================
  // MÁSCARA DE MÊS/ANO (Abr/2020)
  // ============================
  function formatarMesRef(texto) {
    texto = texto.replace(/\s+/g, "");
    let letras = texto.replace(/[^A-Za-z]/g, "").slice(0, 3);
    if (letras.length > 0) {
      letras = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
    }
    const mesesValidos = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    if (letras.length === 3 && !mesesValidos.includes(letras)) return "";
    let ano = texto.replace(/\D/g, "").slice(0, 4);
    if (letras.length === 3) {
      return ano.length > 0 ? `${letras}/${ano}` : `${letras}/`;
    }
    return letras;
  }

  // ============================
  // MÁSCARA DE MOEDA
  // ============================
  function mascaraMoeda(valor) {
    const digitos = valor.replace(/\D/g, "");
    if (!digitos) return "";
    const num = Number(digitos) / 100;
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ============================
  // ESTILO PADRÃO DO SISTEMA
  // ============================
  const estiloLabel = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#0B2B4A"
  };

  const estiloInput = {
    width: "300px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* ============================
          NAVEGAÇÃO ENTRE ABAS
      ============================ */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setAbaAtiva("dias")}>Dias Trabalhados</button>
        <button onClick={() => setAbaAtiva("ferias")}>Férias Indenizadas</button>
        <button onClick={() => setAbaAtiva("decimo")}>13º Salário</button>
        <button onClick={() => setAbaAtiva("pecunia")}>Pecúnia</button>
        <button onClick={() => setAbaAtiva("auxilioFuneral")}>Auxílio Funeral</button>
        <button onClick={() => setAbaAtiva("ats")}>Adicional Tempo Serviço</button>
        <button onClick={() => setAbaAtiva("auxilioDoenca")}>Auxílio Doença</button>
      </div>
{/* ============================
    ABA 1 — Dias Trabalhados
============================ */}
{abaAtiva === "dias" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseComposicao}
        onChange={e => setBaseComposicao(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0023", nome: "Gratificação pelo Exercício da Função" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0031", nome: "Gratificação de Titularidade" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0052", nome: "Gratificação de Localidade Especial" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0109", nome: "Salário Família Temp/Com" },
            { codigo: "0110", nome: "Salário Família Estatutário" },
            { codigo: "0119", nome: "Abono Salarial" },
            { codigo: "0122", nome: "Gratificação de Atividade de Motorista" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0186", nome: "Gratificação de Atividade Aérea" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0291", nome: "Gratificação de Representação Lei 9853/2023" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba1[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba1(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba1).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba1[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba1[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba1[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 2 — FÉRIAS INDENIZADAS
   ============================ */}
{abaAtiva === "ferias" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseFerias}
        onChange={e => setBaseFerias(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0023", nome: "Gratificação pelo Exercício da Função" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0031", nome: "Gratificação de Titularidade" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0052", nome: "Gratificação de Localidade Especial" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0109", nome: "Salário Família Temp/Com" },
            { codigo: "0110", nome: "Salário Família Estatutário" },
            { codigo: "0119", nome: "Abono Salarial" },
            { codigo: "0122", nome: "Gratificação de Atividade de Motorista" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0186", nome: "Gratificação de Atividade Aérea" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0291", nome: "Gratificação de Representação Lei 9853/2023" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba2[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba2(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba2).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba2[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba2[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba2[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 3 — 13º SALÁRIO
   ============================ */}
{abaAtiva === "decimo" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseDecimo}
        onChange={e => setBaseDecimo(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0023", nome: "Gratificação pelo Exercício da Função" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0031", nome: "Gratificação de Titularidade" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0109", nome: "Salário Família Temp/Com" },
            { codigo: "0110", nome: "Salário Família Estatutário" },
            { codigo: "0119", nome: "Abono Salarial" },
            { codigo: "0136", nome: "Gratificação de Atividade de Motorista" },
            { codigo: "0146", nome: "Abono de Permanência" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0186", nome: "Gratificação de Atividade Aérea" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0218", nome: "Gratificação por Acúmulo de Titularidade" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0279", nome: "Gratificação pela Substituição do Titular" },
            { codigo: "0291", nome: "Gratificação de Representação Lei 9853/2023" },
            { codigo: "0294", nome: "Gratificação da Substituição do Titular" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba3[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba3(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba3).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba3[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba3[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba3[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 4 — PECÚNIA
   ============================ */}
{abaAtiva === "pecunia" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={basePecunia}
        onChange={e => setBasePecunia(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba4[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba4(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba4).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba4[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba4[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba4[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 5 — AUXÍLIO FUNERAL
   ============================ */}
{abaAtiva === "auxilioFuneral" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseAuxilioFuneral}
        onChange={e => setBaseAuxilioFuneral(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba5[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba5(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba5).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba5[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba5[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba5[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 6 — ADICIONAL TEMPO DE SERVIÇO (ATS)
   ============================ */}
{abaAtiva === "ats" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseATS}
        onChange={e => setBaseATS(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0023", nome: "Gratificação pelo Exercício da Função" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0031", nome: "Gratificação de Titularidade" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0052", nome: "Gratificação de Localidade Especial" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0122", nome: "Gratificação de Atividade de Motorista" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0186", nome: "Gratificação de Atividade Aérea" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0218", nome: "Gratificação por Acúmulo de Titularidade" },
            { codigo: "0226", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0279", nome: "Gratificação pela Substituição do Titular" },
            { codigo: "0291", nome: "Gratificação de Representação Lei 9853/2023" },
            { codigo: "0294", nome: "Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba6[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba6(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba6).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba6[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba6[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba6[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
{/* ============================
      ABA 7 — AUXÍLIO DOENÇA
   ============================ */}
{abaAtiva === "auxilioDoenca" && (
  <div>

    {/* Campo: Base da Composição da Remuneração */}
    <div style={{ marginBottom: "20px" }}>
      <label style={estiloLabel}>Base da Composição da Remuneração:</label><br />
      <input
        style={estiloInput}
        value={baseAuxilioDoenca}
        onChange={e => setBaseAuxilioDoenca(formatarMesRef(e.target.value))}
        placeholder="Abr/2020"
      />
    </div>

    {/* Tabela de Rubricas + Campos de Valor */}
    <div
      style={{
        background: "#ffffff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ color: "#0B2B4A" }}>Base da Composição da Remuneração</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Rubrica</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {[
            { codigo: "0001", nome: "Vencimento Base" },
            { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
            { codigo: "0028", nome: "Gratificação Tempo Integral" },
            { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
            { codigo: "0040", nome: "Gratificação de Risco de Vida" },
            { codigo: "0047", nome: "Adicional de Insalubridade" },
            { codigo: "0054", nome: "Gratificação pela Escolaridade" },
            { codigo: "0056", nome: "Adicional de Curso de Especialização" },
            { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
            { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
            { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
            { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
            { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
            { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
            { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
            { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
            { codigo: "0209", nome: "Complementação Pecuniária" },
            { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
            { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
            { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
          ].map((rub, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{rub.codigo} - {rub.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                <input
                  style={{
                    ...estiloInput,
                    width: "180px",
                    textAlign: "right"
                  }}
                  value={valoresAba7[rub.codigo] || ""}
                  onChange={e => {
                    const valorFormatado = mascaraMoeda(e.target.value);
                    setValoresAba7(prev => ({
                      ...prev,
                      [rub.codigo]: valorFormatado
                    }));
                  }}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Geral */}
      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "18px",
          padding: "10px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}
      >
        Total: R$ {
          Object.values(valoresAba7).reduce((acc, v) => {
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base IR */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base IR: R$ {
          [
            "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
            "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
            "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
            "0218","0136","0294","0146","0114"
          ].reduce((acc, codigo) => {
            const v = valoresAba7[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base RPPS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência RPPS: R$ {
          [
            "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
            "0040","0029","0185","0295","0291","0023","0001","0099","0016","0079",
            "0080","0054","0028"
          ].reduce((acc, codigo) => {
            const v = valoresAba7[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

      {/* Valor Base INSS */}
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
        Valor Base Previdência INSS: R$ {
          [
            "0100","0191","0168","0148","0295","0291","0023","0001","0099","0016",
            "0079","0080"
          ].reduce((acc, codigo) => {
            const v = valoresAba7[codigo];
            if (!v) return acc;
            const num = Number(v.replace(/\./g, "").replace(",", "."));
            return acc + (isNaN(num) ? 0 : num);
          }, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        }
      </div>

    </div>
  </div>
)}
    </div>  {/* Fim do container principal */}
  );        {/* Fim do return */}
}           {/* Fim do componente PayrollForm */}
