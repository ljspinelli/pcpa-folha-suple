// Lista de rubricas
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
  "0122 - Gratificação de Motorista",
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

// Meses válidos
const mesesValidos = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Formatar moeda brasileira
function formatarMoeda(valor) {
  const num = Number(valor.replace(/\D/g, "")) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// Formatar mês de referência com validação
function formatarMesRef(texto) {
  texto = texto.replace(/\s+/g, "");

  let letras = texto.replace(/[^A-Za-z]/g, "").slice(0, 3);
  if (letras.length > 0) {
    letras = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
  }

  // Validar mês
  if (letras.length === 3 && !mesesValidos.includes(letras)) {
    return ""; // impede meses inválidos
  }

  let ano = texto.replace(/\D/g, "").slice(0, 4);

  if (letras.length === 3) {
    return ano.length > 0 ? `${letras}/${ano}` : `${letras}/`;
  }

  return letras;
}

function PayrollForm() {
  const [rubricaSelecionada, setRubricaSelecionada] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [mesRef, setMesRef] = React.useState("");
  const [vantagens, setVantagens] = React.useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = React.useState(null);

  function inserir() {
    if (!rubricaSelecionada || !valor || !mesRef) return;

    const item = {
      rubrica: rubricaSelecionada,
      mesRef,
      valor: formatarMoeda(valor)
    };

    if (linhaSelecionada !== null) {
      const nova = [...vantagens];
      nova[linhaSelecionada] = item;
      setVantagens(nova);
    } else {
      setVantagens(prev => [...prev, item]);
    }

    setRubricaSelecionada("");
    setValor("");
    setMesRef("");
    setLinhaSelecionada(null);
  }

  function editar() {
    if (linhaSelecionada === null) return;
    const item = vantagens[linhaSelecionada];
    setRubricaSelecionada(item.rubrica);
    setValor(item.valor);
    setMesRef(item.mesRef);
  }

  function excluir() {
    if (linhaSelecionada === null) return;
    setVantagens(vantagens.filter((_, i) => i !== linhaSelecionada));
    setLinhaSelecionada(null);
  }

  const total = vantagens.reduce((acc, item) => {
    const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
    return acc + v;
  }, 0);

  // Estilo padronizado para labels e campos
  const estiloLabel = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0B2B4A"
  };

  const estiloInput = {
    fontSize: "15px",
    padding: "6px",
    width: "200px"
  };

  const estiloSelect = {
    fontSize: "15px",
    padding: "6px",
    width: "300px"
  };

  return (
    <div>
      <label style={estiloLabel}>Selecionar Rubrica:</label><br />
      <select
        style={estiloSelect}
        value={rubricaSelecionada}
        onChange={e => setRubricaSelecionada(e.target.value)}
      >
        <option value="">Selecione...</option>
        {rubricas.map((r, i) => (
          <option key={i} value={r}>{r}</option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Mês de Referência:</label><br />
        <input
          style={estiloInput}
          value={mesRef}
          onChange={e => setMesRef(formatarMesRef(e.target.value))}
          placeholder="Abr/2020"
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor (R$):</label><br />
        <input
          style={estiloInput}
          value={valor}
          onChange={e => setValor(formatarMoeda(e.target.value))}
          placeholder="000.000,00"
        />
      </div>

      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button onClick={inserir}>Inserir</button>
        <button onClick={editar}>Editar</button>
        <button onClick={excluir}>Excluir</button>
      </div>

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

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Rubrica</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Mês Ref.</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
            </tr>
          </thead>

          <tbody>
            {vantagens.map((item, index) => (
              <tr
                key={index}
                onClick={() => setLinhaSelecionada(index)}
                style={{
                  background: linhaSelecionada === index ? "#e6f0ff" : "#fff",
                  cursor: "pointer"
                }}
              >
                <td style={{ padding: "8px" }}>{item.rubrica}</td>
                <td style={{ padding: "8px" }}>{item.mesRef}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{item.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            textAlign: "right",
            fontSize: "18px",
            padding: "10px",
            background: "#f7f7f7",
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}
        >
          Total: R$ {formatarMoeda(String(total))}
        </div>
      </div>
    </div>
  );
}
