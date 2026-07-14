// Lista de contribuições previdenciárias
const contribuicoes = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV"
];

// Meses válidos
const mesesValidos = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

// Formatar moeda brasileira
function formatarMoeda(valor) {
  const num = Number(valor.replace(/\D/g, "")) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// Formatar porcentagem "00,00%"
function formatarPercentual(texto) {
  let digitos = texto.replace(/\D/g, "").slice(0, 4);

  if (digitos.length <= 2) {
    return digitos;
  }

  return digitos.slice(0, 2) + "," + digitos.slice(2) + "%";
}

// Formatar mês de referência
function formatarMesRef(texto) {
  texto = texto.replace(/\s+/g, "");

  let letras = texto.replace(/[^A-Za-z]/g, "").slice(0, 3);
  if (letras.length > 0) {
    letras = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
  }

  if (letras.length === 3 && !mesesValidos.includes(letras)) {
    return "";
  }

  let ano = texto.replace(/\D/g, "").slice(0, 4);

  if (letras.length === 3) {
    return ano.length > 0 ? `${letras}/${ano}` : `${letras}/`;
  }

  return letras;
}

function DiscountForm({ totalVantagens }) {
  const [contrib, setContrib] = React.useState("");
  const [aliquota, setAliquota] = React.useState("");
  const [valorCalc, setValorCalc] = React.useState("");

  const [aliquotaIR, setAliquotaIR] = React.useState("");
  const [valorIR, setValorIR] = React.useState("");

  const [lista, setLista] = React.useState([]);

  // Calcular valor da contribuição previdenciária
  React.useEffect(() => {
    if (aliquota.includes(",")) {
      const perc = Number(aliquota.replace("%", "").replace(",", ".")) / 100;
      const calc = totalVantagens * perc;
      setValorCalc(calc.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    }
  }, [aliquota]);

  // Calcular valor do IR
  React.useEffect(() => {
    if (aliquotaIR.includes(",")) {
      const perc = Number(aliquotaIR.replace("%", "").replace(",", ".")) / 100;
      const calc = totalVantagens * perc;
      setValorIR(calc.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    }
  }, [aliquotaIR]);

  function inserir() {
    if (!contrib || !aliquota || !valorCalc || !aliquotaIR || !valorIR) return;

    const novaLinha1 = {
      rubrica: contrib,
      aliquota,
      valor: valorCalc
    };

    const novaLinha2 = {
      rubrica: "0658 - Imposto de Renda - IRRF",
      aliquota: aliquotaIR,
      valor: valorIR
    };

    setLista([novaLinha1, novaLinha2]);
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
    width: "200px"
  };

  const estiloSelect = {
    fontSize: "15px",
    padding: "6px",
    width: "300px"
  };

  return (
    <div>

      {/* Linha 1 - Contribuição Previdenciária */}
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

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Alíquota:</label><br />
        <input
          style={estiloInput}
          value={aliquota}
          onChange={e => setAliquota(formatarPercentual(e.target.value))}
          placeholder="00,00%"
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor:</label><br />
        <input
          style={estiloInput}
          value={valorCalc}
          readOnly
        />
      </div>

      {/* Linha 2 - Imposto de Renda */}
      <div style={{ marginTop: "20px" }}>
        <label style={estiloLabel}>
          <a href="https://www27.receita.fazenda.gov.br/simulador-irpf/" target="_blank">
            Imposto de Renda:
          </a>
        </label><br />

        <input
          style={estiloInput}
          value="0658 - Imposto de Renda - IRRF"
          readOnly
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Alíquota IR:</label><br />
        <input
          style={estiloInput}
          value={aliquotaIR}
          onChange={e => setAliquotaIR(formatarPercentual(e.target.value))}
          placeholder="00,00%"
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label style={estiloLabel}>Valor IR:</label><br />
        <input
          style={estiloInput}
          value={valorIR}
          readOnly
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={inserir}>Aplicar Descontos</button>
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
          Total: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}

