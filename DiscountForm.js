// Lista de contribuições previdenciárias
const contribuicoes = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV",
  "0695 - FUNPREV Contribuição LC112",
  "0638 - FUNPREV Limite RPPS"
];

// Máscara fluída de moeda (sem NaN)
function formatarMoedaDigitacao(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return "";

  const num = Number(digitos) / 100;

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

function DiscountForm({
  totalVantagens,
  totalBasePrevidencia,
  totalPeriodosAquisitivos,
  totalAdiantamentos,
  setTotalDescontos
}) {
  const [contrib, setContrib] = React.useState("");

  const [aliquota, setAliquota] = React.useState("");
  const [aliquotaRaw, setAliquotaRaw] = React.useState("");

  const [valorCalc, setValorCalc] = React.useState("");

  const [aliquotaIR, setAliquotaIR] = React.useState("");
  const [aliquotaIRRaw, setAliquotaIRRaw] = React.useState("");

  const [valorIR, setValorIR] = React.useState("");

  const [lista, setLista] = React.useState([]);

  // Cálculo do valor previdenciário
  // Usa totalBasePrevidencia (exclui a rubrica 0291, que não sofre
  // incidência de desconto previdenciário), não o totalVantagens geral.
  React.useEffect(() => {
    if (aliquota.includes(",")) {
      const perc = Number(
        aliquota.replace("%", "").replace(",", ".")
      ) / 100;

      const calc = totalBasePrevidencia * perc;

      setValorCalc(
        calc.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    } else {
      setValorCalc("");
    }
  }, [aliquota, totalBasePrevidencia]);

  // Digitação fluída da alíquota
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

  // Valor IR — máscara fluída sem NaN
  function onValorIRChange(e) {
    const texto = e.target.value;
    setValorIR(formatarMoedaDigitacao(texto));
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

    // Atualiza a linha se a rubrica já existir na lista, senão adiciona.
    // Isso evita perder descontos já aplicados ao clicar novamente.
    setLista(prev => {
      const semDuplicatas = prev.filter(
        item => item.rubrica !== linha1.rubrica && item.rubrica !== linha2.rubrica
      );
      return [...semDuplicatas, linha1, linha2];
    });
  }

  function removerDesconto(rubrica) {
    setLista(prev => prev.filter(item => item.rubrica !== rubrica));
  }

  // Total dos descontos
  const total = lista.reduce((acc, item) => {
    const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  // 🔥 CORREÇÃO CRÍTICA — envia o total para o App.js
  React.useEffect(() => {
    if (typeof setTotalDescontos === "function") {
      setTotalDescontos(total);
    }
  }, [total, setTotalDescontos]);

  // Total Bruto = Total do PeriodosAquisitivosForm.js - Total do AdiantamentosForm.js
  const totalBruto = arredondarPadrao(totalPeriodosAquisitivos - totalAdiantamentos);

  // Total Líquido = Total Bruto - Total dos descontos aplicados (Quadro1 deste formulário)
  const totalLiquido = arredondarPadrao(totalBruto - total);

  return (
    <div>

      {/* Total Bruto */}
      <div style={{
        marginBottom: "20px",
        textAlign: "right",
        fontWeight: "bold",
        fontSize: "18px",
        background: "#f0f0f0",
        padding: "8px"
      }}>
        Total Bruto&nbsp;&nbsp;R$ {formatarNumeroParaMoeda(totalBruto)}
      </div>

      {/* Contribuição Previdenciária */}
      <label style={ESTILOS.label}>Contribuição Previdenciária:</label><br />
      <select
        style={ESTILOS.select}
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
        <label style={ESTILOS.label}>Alíquota:</label><br />
        <input
          style={ESTILOS.input}
          value={aliquota}
          onChange={onAliquotaChange}
          onBlur={onAliquotaBlur}
          placeholder="00,00%"
        />
      </div>

      {/* Valor Previdenciário */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Valor:</label><br />
        <input
          style={ESTILOS.inputSomenteLeitura}
          value={valorCalc}
          readOnly
          placeholder="0,00"
        />
      </div>

      {/* Imposto de Renda */}
      <div style={{ marginTop: "20px" }}>
        <label style={ESTILOS.label}><a href="https://www27.receita.fazenda.gov.br/simulador-irpf/" target="_blank" rel="noreferrer">Imposto de Renda:</a></label><br />
        <input
          style={ESTILOS.inputSomenteLeitura}
          value="0658 - Imposto de Renda - IRRF"
          readOnly
        />
      </div>

      {/* Alíquota IR */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Alíquota IR:</label><br />
        <input
          style={ESTILOS.input}
          value={aliquotaIR}
          onChange={onAliquotaIRChange}
          onBlur={onAliquotaIRBlur}
          placeholder="00,00%"
        />
      </div>

      {/* Valor IR */}
      <div style={{ marginTop: "10px" }}>
        <label style={ESTILOS.label}>Valor IR:</label><br />
        <input
          style={ESTILOS.input}
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
              <th style={{ padding: "8px", textAlign: "center" }}></th>
            </tr>
          </thead>

          <tbody>
            {lista.map((item) => (
              <tr key={item.rubrica}>
                <td style={{ padding: "8px" }}>{item.rubrica}</td>
                <td style={{ padding: "8px" }}>{item.aliquota}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{item.valor}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    onClick={() => removerDesconto(item.rubrica)}
                    style={{ color: "#b00020", border: "none", background: "none", cursor: "pointer" }}
                    title="Remover"
                  >
                    ✕
                  </button>
                </td>
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

      {/* Total Líquido */}
      <div style={{
        marginTop: "20px",
        textAlign: "right",
        fontWeight: "bold",
        fontSize: "18px",
        background: "#f0f0f0",
        padding: "8px"
      }}>
        Total Líquido&nbsp;&nbsp;R$ {formatarNumeroParaMoeda(totalLiquido)}
      </div>
    </div>
  );
}
