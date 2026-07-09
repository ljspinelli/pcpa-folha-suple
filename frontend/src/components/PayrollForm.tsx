import React, { useState } from "react";

// Lista exaustiva de Rubricas
const rubricas = [
  "0100 - Vencimento Cargo Comissionado",
  "0191 - Vencimento Decisao Judicial SISPEMB",
  "0168 - Abono Complementar Salario Minimo",
  "0274 - Grat Magistério_Vantagem Pessoal Nominalmente Identificada",
  "0109 - Salário Familia Temp/Com",
  "0119 - Abono Salarial",
  "0148 - Salário Maternidade",
  "0056 - Adicional de Curso de Especialização",
  "0209 - Complementação Pecuniária",
  "0219 - Grat. Exerc. de Atividade de Direção de Polícia Judiciária",
  "0186 - Gratificação de Atividade Aerea",
  "0122 - Gratificação de Atividade de Motorista",
  "0052 - Gratificação de Localidade Especial",
  "0070 - Gratificação de Polícia Judiciária",
  "0040 - Gratificação de Risco de Vida",
  "0031 - Gratificação de Titularidade",
  "0029 - Gratificação Dedicação Exclusiva",
  "0185 - Gratificacao pela Escolaridade DJ",
  "0295 - ATS da Gratificacao da Substituicao do Titular",
  "0291 - Gratificação de Representação Lei 9853/2023",
  "0023 - Gratificação pelo Exercício da Função",
  "0001 - Vencimento Base",
  "0099 - Vencimento Decisão Judicial (Delegado)",
  "0047 - Adicional de Insalubridade",
  "0016 - Adicional pelo Exercício de Cargo em Comissão",
  "0079 - Adicional pelo Exercício de Função Gratificada",
  "0080 - Adicional por Tempo de Serviço",
  "0054 - Gratificação pela Escolaridade",
  "0028 - Gratificação Tempo Integral",
  "0110 - Salário Familia Estatutário",
  "0217 - Auxílio Bolsa de Formação",
  "0124 - Gratificação de Plantão",
  "0210 - Premiação Pecuniária Civil",
  "0101 - Grat Participação Órgão Colegiado",
  "0279 - Gratificação pela Substituição do Titular",
  "0218 - Gratificação por Acúmulo de Titularidade",
  "0136 - Abono Extraordinario",
  "0294 - Gratificacao da Substituicao do Titular",
  "0146 - Abono de Permanência",
  "0114 - Adicional de Férias-Estatutários",
  "1010 - Ajuda de Custo Lei Estadual 10.498/24",
  "0165 - Auxílio Alimentação",
  "0132 - Auxilio Natalidade",
  "0127 - Auxílio Transporte"
];

// Regex para valor monetário
const regexValor = /^(\d{1,3}(\.\d{3})*|\d+),\d{2}$/;

export default function PayrollForm() {
  const [rubricaSelecionada, setRubricaSelecionada] = useState("");
  const [valor, setValor] = useState("");
  const [vantagens, setVantagens] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState<number | null>(null);
  const [erroValor, setErroValor] = useState("");

  function validarValor(v: string) {
    if (!regexValor.test(v)) {
      setErroValor("Formato inválido. Use R$000.000,00");
      return false;
    }
    setErroValor("");
    return true;
  }

  function limparCampos() {
    setRubricaSelecionada("");
    setValor("");
    setLinhaSelecionada(null);
  }

  function inserir() {
    if (!rubricaSelecionada || !validarValor(valor)) return;

    // Se estiver editando, salva a edição
    if (linhaSelecionada !== null) {
      const novaLista = [...vantagens];
      novaLista[linhaSelecionada] = { rubrica: rubricaSelecionada, valor };
      setVantagens(novaLista);
      limparCampos();
      return;
    }

    // Inserção normal
    setVantagens(prev => [...prev, { rubrica: rubricaSelecionada, valor }]);
    limparCampos();
  }

  function editar() {
    if (linhaSelecionada === null) return;
    const item = vantagens[linhaSelecionada];

    setRubricaSelecionada(item.rubrica);
    setValor(item.valor);
  }

  function excluir() {
    if (linhaSelecionada === null) return;

    const novaLista = vantagens.filter((_, i) => i !== linhaSelecionada);
    setVantagens(novaLista);
    limparCampos();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Composição da Remuneração – Vantagens</h2>

      {/* Seleção de Rubrica */}
      <div>
        <label>Selecionar Rubrica:</label><br />
        <select
          value={rubricaSelecionada}
          onChange={e => setRubricaSelecionada(e.target.value}
        >
          <option value="">Selecione...</option>
          {rubricas.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Valor */}
      <div style={{ marginTop: "10px" }}>
        <label>Valor (R$):</label><br />
        <input
          value={valor}
          onChange={e => setValor(e.target.value)}
          placeholder="000.000,00"
        />
        <div style={{ color: "red" }}>{erroValor}</div>
      </div>

      {/* Botões */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button onClick={inserir}>Inserir</button>
        <button onClick={editar}>Editar</button>
        <button onClick={excluir}>Excluir</button>
      </div>

      {/* Quadro inferior */}
      <div
        style={{
          marginTop: "20px",
          background: "#ffffff",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
        }}
      >
        <h3>Vantagens Lançadas</h3>

        {vantagens.length === 0 && (
          <p style={{ color: "#666" }}>Nenhuma vantagem lançada.</p>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {vantagens.map((item, index) => (
            <li
              key={index}
              onClick={() => setLinhaSelecionada(index)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                marginBottom: "5px",
                background: linhaSelecionada === index ? "#e6f0ff" : "#f9f9f9",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              <span>{item.rubrica}</span>
              <span>{item.valor}</span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Total: R$
          {vantagens
            .reduce((acc, item) => {
              const v = Number(item.valor.replace(".", "").replace(",", "."));
              return acc + v;
            }, 0)
            .toFixed(2)
            .replace(".", ",")}
        </div>
      </div>
    </div>
  );
}
