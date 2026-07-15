// Rubricas permitidas
const rubricasDescontos = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV",
  "0658 - Imposto de Renda - IRRF"
];

// Máscara de percentual
function formatarPercentualFinal(digitos) {
  let nums = digitos.replace(/\D/g, "").slice(0, 4);

  if (!nums) return "";

  if (nums.length === 1) return `0${nums},00%`;
  if (nums.length === 2) return `${nums},00%`;
  if (nums.length === 3) return `${nums.slice(0, 2)},${nums.slice(2)}0%`;
  if (nums.length === 4) return `${nums.slice(0, 2)},${nums.slice(2)}%`;

  return "";
}

function DiscountForm({ totalVantagens, setTotalDescontos }) {
  const [rubrica, setRubrica] = React.useState("");
  const [aliquota, setAliquota] = React.useState("");
  const [aliquotaRaw, setAliquotaRaw] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [descontos, setDescontos] = React.useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = React.useState(null);

  // Máscara corrigida para valor
  function handleValorChange(e) {
    const texto = e.target.value.replace(/\D/g, "");
    setValor(texto);
  }

  function handleValorBlur() {
    if (!valor) return;
    const num = Number(valor) / 100;
    setValor(
      num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  // Máscara corrigida para alíquota
  function handleAliquotaChange(e) {
    const texto = e.target.value.replace(/[^0-9]/g, "");
    setAliquotaRaw(texto);
    setAliquota(texto);
  }

  function handleAliquotaBlur() {
    setAliquota(formatarPercentualFinal(aliquotaRaw));
  }

  // Inserir linha
  function inserir() {
    if (!rubrica || !aliquota || !valor) return;

    const valorNumerico = Number(valor.replace(/\./g, "").replace(",", "."));
    const item = {
      rubrica,
      aliquota,
      valor: valorNumerico.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    };

    if (linhaSelecionada !== null) {
      const nova = [...descontos];
      nova[linhaSelecionada] = item;
      setDescontos(nova);
    } else {
      setDescontos(prev => [...prev, item]);
    }

    setRubrica("");
    setAliquota("");
    setAliquotaRaw("");
    setValor("");
    setLinhaSelecionada(null);
  }

  // Editar linha
  function editar() {
    if (linhaSelecionada === null) return;
    const item = descontos[linhaSelecionada];
    setRubrica(item.rubrica);
    setAliquota(item.aliquota);
    setValor(item.valor);
  }

  // Excluir linha
  function excluir() {
    if (linhaSelecionada === null) return;
    setDescontos(descontos.filter((_, i) => i !== linhaSelecionada));
    setLinhaSelecionada(null);
  }

  // Total de descontos
  const total = descontos.reduce((acc, item) => {
    const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
    return acc + v;
  }, 0);

  // Enviar total para App.js
  React.useEffect(() => {
    setTotalDescontos(total);
  }, [total]);

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

  return (
    <div>
      <label style={estiloLabel}>Rubrica:</label><br />
      <select
        style={estiloSelect}
        value={rubrica}
        onChange={e => setRubrica(e.target.value)}
      >
        <option value="">Selecione...</option>
        {rubricasDescontos.map((r, i) => (
          <option key={i} value={r}>{r}</option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Alíquota (%):</label><br />
        <input
          style={estiloInput}
          value={aliquota}
          onChange={handleAliquotaChange}
          onBlur={handleAliquotaBlur}
          placeholder="00,00%"
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor (R$):</label><br />
        <input
          style={estiloInput}
          value={valor}
          onChange={handleValorChange}
          onBlur={handleValorBlur}
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
        <h3>Descontos Lançados</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Rubrica</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Alíquota</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
            </tr>
          </thead>

          <tbody>
            {descontos.map((item, index) => (
              <tr
                key={index}
                onClick={() => setLinhaSelecionada(index)}
                style={{
                  background: linhaSelecionada === index ? "#e6f0ff" : "#fff",
                  cursor: "pointer"
                }}
              >
                <td style={{ padding: "8px" }}>{item.rubrica}</td>
                <td style={{ padding: "8px" }}>{item.aliquota}</td>
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
          Total: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
