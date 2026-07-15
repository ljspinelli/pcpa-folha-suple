// Lista de contribuições previdenciárias
const contribuicoes = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV"
];

// Formatar moeda brasileira a partir de dígitos (sempre 2 casas decimais)
function formatarMoeda(valor) {
  const num = Number(valor.replace(/\D/g, "")) / 100;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Formata string numérica em "00,00%"
function formatarPercentualFinal(digitos) {
  let nums = digitos.replace(/\D/g, "").slice(0, 4);

  if (!nums) return "";

  if (nums.length === 1) return `0${nums},00%`;
  if (nums.length === 2) return `${nums},00%`;
  if (nums.length === 3) return `${nums.slice(0, 2)},${nums.slice(2)}0%`;
  if (nums.length === 4) return `${nums.slice(0, 2)},${nums.slice(2)}%`;

  return "";
}

function DiscountForm({ totalVantagens }) {
  const [contrib, setContrib] = React.useState("");

  const [aliquota, setAliquota] = React.useState("");
  const [aliquotaRaw, setAliquotaRaw] = React.useState("");

  const [valorCalc, setValorCalc] = React.useState("");

  const [aliquotaIR, setAliquotaIR] = React.useState("");
  const [aliquotaIRRaw, setAliquotaIRRaw] = React.useState("");

  const [valorIR, setValorIR] = React.useState("");

  const [lista, setLista] = React.useState([]);

  // Cálculo do valor previdenciário após final da digitação da alíquota
  React.useEffect(() => {
    if (aliquota.includes(",")) {
      const perc = Number(aliquota.replace("%", "").replace(",", ".")) / 100;
      const calc = totalVantagens * perc;

      // Sempre 2 casas decimais, com arredondamento correto
      setValorCalc(
        calc.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    } else {
      setValorCalc("");
    }
  }, [aliquota, totalVantagens]);

  // Digitação fluída da alíquota
  function onAliquotaChange(e) {
    const texto = e.target.value;
    const filtrado = texto.replace(/[^0-9,]/g, "");
    setAliquotaRaw(filtrado);
    setAliquota(filtrado);
  }

  function onAliquotaBlur() {
    const formatado = formatarPercentualFinal(aliquotaRaw);
    setAliquota(formatado);
  }

  // Digitação fluída da alíquota IR
  function onAliquotaIRChange(e) {
    const texto = e.target.value;
    const filtrado = texto.replace(/[^0-9,]/g, "");
    setAliquotaIRRaw(filtrado);
    setAliquotaIR(filtrado);
  }

  function onAliquotaIRBlur() {
    const formatado = formatarPercentualFinal(aliquotaIRRaw);
    setAliquotaIR(formatado);
  }

  // Valor IR com máscara de moeda durante digitação (sempre 2 casas)
  function onValorIRChange(e) {
    setValorIR(formatarMoeda(e.target.value));
  }

  function aplicarDescontos() {
    if (!contrib || !aliquota || !valorCalc || !aliquotaIR || !valorIR) return;

    const linha1 = {
      rubrica: contrib,
      aliquota,
      valor: valorCalc
    };

    const linha2 = {
      rubrica: "0658 - Imposto de Renda - IRRF",
      aliquota: aliquotaIR,
      valor: valorIR
    };

    setLista([linha1, linha2]);
  }

  const total = lista.reduce((acc, item) => {
    const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
    return acc + v;
  }, 0);

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

      {/* Contribuição Previdenciária */}
      <label style={estiloLabel}>Contribuição Previdenciária:</label><br />
      <select
        style={estiloSelect}
        value={contrib}
        onChange={e => setContrib(e.target.value)}
      >
        <option value="">Selecione...</option>
        {contribuicoes.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      {/* Alíquota */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Alíquota:</label><br />
        <input
          style={estiloInput}
          value={aliquota}
          onChange={onAliquotaChange}
          onBlur={onAliquotaBlur}
          placeholder="00,00%"
        />
      </div>

      {/* Valor */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor:</label><br />
        <input
          style={estiloInput}
          value={valorCalc}
          readOnly
          placeholder="0,00"
        />
      </div>

      {/* Imposto de Renda */}
      <div style={{ marginTop: "20px" }}>
        <label style={estiloLabel}>
          <a
            href="https://www27.receita.fazenda.gov.br/simulador-irpf/"
            target="_blank"
            rel="noreferrer"
          >
            Imposto de Renda:
          </a>
        </label><br />
        <input
          style={estiloInput}
          value="0658 - Imposto de Renda - IRRF"
          readOnly
        />
      </div>

      {/* Alíquota IR */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Alíquota IR:</label><br />
        <input
          style={estiloInput}
          value={aliquotaIR}
          onChange={onAliquotaIRChange}
          onBlur={onAliquotaIRBlur}
          placeholder="00,00%"
        />
      </div>

      {/* Valor IR */}
      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor IR:</label><br />
        <input
          style={estiloInput}
          value={valorIR}
          onChange={onValorIRChange}
          placeholder="000.000,00"
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={aplicarDescontos}>Aplicar Descontos</button>
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
        <h3>Descontos Aplicados</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Rúbrica</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Alíquota</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Valor (R$)</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((item, index) => (
              <tr key={index}>
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
          Total: R$ {total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </div>
    </div>
  );
}
