// Lista de contribuições previdenciárias
const contribuicoes = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV"
];

// Formata percentual final (00,00%)
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
  const [contrib, setContrib] = React.useState("");

  // Alíquota previdenciária
  const [aliquota, setAliquota] = React.useState("");
  const [aliquotaRaw, setAliquotaRaw] = React.useState("");

  // Valor previdenciário calculado
  const [valorCalc, setValorCalc] = React.useState("");

  // Alíquota IR
  const [aliquotaIR, setAliquotaIR] = React.useState("");
  const [aliquotaIRRaw, setAliquotaIRRaw] = React.useState("");

  // Valor IR (com máscara corrigida)
  const [valorIR, setValorIR] = React.useState("");

  const [lista, setLista] = React.useState([]);

  // Cálculo automático do valor previdenciário
  React.useEffect(() => {
    if (aliquota.includes(",")) {
      const perc = Number(aliquota.replace("%", "").replace(",", ".")) / 100;
      const calc = totalVantagens * perc;

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

  // Digitação fluída da alíquota previdenciária
  function onAliquotaChange(e) {
    const texto = e.target.value.replace(/[^0-9,]/g, "");
    setAliquotaRaw(texto);
    setAliquota(texto);
  }

  function onAliquotaBlur() {
    setAliquota(formatarPercentualFinal(aliquotaRaw));
  }

  // Digitação fluída da alíquota IR
  function onAliquotaIRChange(e) {
    const texto = e.target.value.replace(/[^0-9,]/g, "");
    setAliquotaIRRaw(texto);
    setAliquotaIR(texto);
  }

  function onAliquotaIRBlur() {
    setAliquotaIR(formatarPercentualFinal(aliquotaIRRaw));
  }

  // Máscara corrigida para Valor IR
  function onValorIRChange(e) {
    const texto = e.target.value.replace(/\D/g, "");
    setValorIR(texto);
  }

  function onValorIRBlur() {
    if (!valorIR) return;

    const num = Number(valorIR) / 100;

    setValorIR(
      num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
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

    const novaLista = [linha1, linha2];
    setLista(novaLista);

    // Calcula total de descontos
    const total = novaLista.reduce((acc, item) => {
      const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
      return acc + v;
    }, 0);

    setTotalDescontos(total);
  }

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

      {/* Valor Previdenciário */}
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
          onBlur={onValorIRBlur}
          placeholder="000.000,00"
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={aplicarDescontos}>Aplicar Descontos</button>
      </div>

    </div>
  );
}
