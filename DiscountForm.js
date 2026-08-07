// Lista de contribuições previdenciárias
const contribuicoes = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV",
  "0695 - FUNPREV Contribuição LC112",
  "0638 - FUNPREV Limite RPPS"
];

// Lista de opções de Imposto de Renda
const opcoesImpostoRenda = [
  "0658 - Imposto de Renda - IRRF",
  "RRA 13º Salario Proporcional",
  "Isento de IR - Ato Declaratório Interpretativo SRF nº 5/2005",
  "Imposto de Renda Férias - Ato Declaratório Interpretativo SRF nº 14/2005"
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
  listaPeriodosAquisitivos,
  setTotalDescontos
}) {
  const [contrib, setContrib] = React.useState("");
  const [imposto, setImposto] = React.useState("");

  const [aliquota, setAliquota] = React.useState("");
  const [aliquotaRaw, setAliquotaRaw] = React.useState("");

  const [valorBasePrevidenciaTexto, setValorBasePrevidenciaTexto] = React.useState("");
  const [valorCalc, setValorCalc] = React.useState("");
  const [valorCalcNumerico, setValorCalcNumerico] = React.useState(0);

  const [aliquotaIR, setAliquotaIR] = React.useState("");
  const [aliquotaIRRaw, setAliquotaIRRaw] = React.useState("");

  const [valorBaseIRTexto, setValorBaseIRTexto] = React.useState("");
  const [valorIR, setValorIR] = React.useState("");
  const [valorIRNumerico, setValorIRNumerico] = React.useState(0);

  const [lista, setLista] = React.useState([]);

  // Cálculo do Valor Previdência = Alíquota × Valor Base Previdência
  // (campo local, escolhido de uma linha do Períodos Aquisitivos ou
  // digitado manualmente) — o campo permanece editável mesmo assim.
  // valorCalcNumerico guarda o valor com TODAS as casas decimais (usado
  // no cálculo real); valorCalc é só o texto formatado exibido no campo.
  React.useEffect(() => {
    if (aliquota.includes(",")) {
      const perc = Number(
        aliquota.replace("%", "").replace(",", ".")
      ) / 100;

      const base = converterMoedaParaNumero(valorBasePrevidenciaTexto);
      const calc = base * perc;

      setValorCalcNumerico(calc);
      setValorCalc(
        calc.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    } else {
      setValorCalcNumerico(0);
      setValorCalc("");
    }
  }, [aliquota, valorBasePrevidenciaTexto]);

  // Cálculo do Valor IR = Alíquota IR × Valor Base IR — o campo
  // permanece editável mesmo assim. valorIRNumerico guarda o valor com
  // TODAS as casas decimais (usado no cálculo real).
  React.useEffect(() => {
    if (aliquotaIR.includes(",")) {
      const perc = Number(
        aliquotaIR.replace("%", "").replace(",", ".")
      ) / 100;

      const base = converterMoedaParaNumero(valorBaseIRTexto);
      const calc = base * perc;

      setValorIRNumerico(calc);
      setValorIR(
        calc.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    } else {
      setValorIRNumerico(0);
      setValorIR("");
    }
  }, [aliquotaIR, valorBaseIRTexto]);

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

  // Valor IR — máscara fluída sem NaN. Ao digitar manualmente, guarda
  // também o valor numérico correspondente (mesma precisão do texto,
  // já que aqui é o próprio usuário digitando 2 casas decimais).
  function onValorIRChange(e) {
    const texto = e.target.value;
    const formatado = formatarMoedaDigitacao(texto);
    setValorIR(formatado);
    setValorIRNumerico(converterMoedaParaNumero(formatado));
  }

  function aplicarDescontos() {
    if (!contrib || !aliquota || !valorCalc || !aliquotaIR || !valorIR) return;

    const linha1 = {
      rubrica: contrib,
      aliquota,
      valor: valorCalcNumerico
    };

    const linha2 = {
      rubrica: imposto,
      aliquota: aliquotaIR,
      valor: valorIRNumerico
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

  // Total dos descontos (valores já numéricos, com precisão total)
  const total = lista.reduce((acc, item) => acc + item.valor, 0);

  // 🔥 CORREÇÃO CRÍTICA — envia o total para o App.js
  React.useEffect(() => {
    if (typeof setTotalDescontos === "function") {
      setTotalDescontos(total);
    }
  }, [total, setTotalDescontos]);

  // Total Bruto = Total do PeriodosAquisitivosForm.js - Total do AdiantamentosForm.js
  // (mantido sem arredondar aqui — só na exibição)
  const totalBruto = totalPeriodosAquisitivos - totalAdiantamentos;

  // Total Líquido = Total Bruto - Total dos descontos aplicados (Quadro1 deste formulário)
  const totalLiquido = totalBruto - total;

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

      {/* Duas colunas: Previdência (esquerda) e Imposto de Renda (direita) */}
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>

        {/* Coluna esquerda: Contribuição Previdenciária */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label style={ESTILOS.label}>Contribuição Previdenciária:</label><br />
          <input
            list="opcoes-contribuicao"
            style={{ ...ESTILOS.input, width: "100%" }}
            value={contrib}
            onChange={e => setContrib(e.target.value)}
            placeholder="Digite ou selecione..."
          />
          <datalist id="opcoes-contribuicao">
            {contribuicoes.map((c, i) => (
              <option key={i} value={c} />
            ))}
          </datalist>

          {/* Alíquota */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Alíquota:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={aliquota}
              onChange={onAliquotaChange}
              onBlur={onAliquotaBlur}
              placeholder="00,00%"
            />
          </div>

          {/* Valor Base Previdência */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Base Previdência:</label><br />
            <input
              list="opcoes-valor-base-previdencia"
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorBasePrevidenciaTexto}
              onChange={e => setValorBasePrevidenciaTexto(mascaraMoeda(e.target.value))}
              placeholder="0,00"
            />
            <datalist id="opcoes-valor-base-previdencia">
              {listaPeriodosAquisitivos && listaPeriodosAquisitivos.map((item, i) => (
                <option key={i} value={formatarNumeroParaMoeda(item.valor)}>
                  {item.selecionarVantagem} — {formatarNumeroParaMoeda(item.valor)}
                </option>
              ))}
            </datalist>
          </div>

          {/* Valor Previdência */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Previdência:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorCalc}
              onChange={e => {
                const formatado = formatarMoedaDigitacao(e.target.value);
                setValorCalc(formatado);
                setValorCalcNumerico(converterMoedaParaNumero(formatado));
              }}
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Coluna direita: Imposto de Renda */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label style={ESTILOS.label}><a href="https://www27.receita.fazenda.gov.br/simulador-irpf/" target="_blank" rel="noreferrer">Imposto de Renda:</a></label><br />
          <input
            list="opcoes-imposto-renda"
            style={{ ...ESTILOS.input, width: "100%" }}
            value={imposto}
            onChange={e => setImposto(e.target.value)}
            placeholder="Digite ou selecione..."
          />
          <datalist id="opcoes-imposto-renda">
            {opcoesImpostoRenda.map((op, i) => (
              <option key={i} value={op} />
            ))}
          </datalist>

          {/* Alíquota IR */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Alíquota IR:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={aliquotaIR}
              onChange={onAliquotaIRChange}
              onBlur={onAliquotaIRBlur}
              placeholder="00,00%"
            />
          </div>

          {/* Valor Base IR */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Base IR:</label><br />
            <input
              list="opcoes-valor-base-ir"
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorBaseIRTexto}
              onChange={e => setValorBaseIRTexto(mascaraMoeda(e.target.value))}
              placeholder="0,00"
            />
            <datalist id="opcoes-valor-base-ir">
              {listaPeriodosAquisitivos && listaPeriodosAquisitivos.map((item, i) => (
                <option key={i} value={formatarNumeroParaMoeda(item.valor)}>
                  {item.selecionarVantagem} — {formatarNumeroParaMoeda(item.valor)}
                </option>
              ))}
            </datalist>
          </div>

          {/* Valor IR */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor IR:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorIR}
              onChange={onValorIRChange}
              placeholder="000.000,00"
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "15px", textAlign: "right" }}>
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
                <td style={{ padding: "8px", textAlign: "right" }}>{formatarNumeroParaMoeda(item.valor)}</td>
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
          Total: R$ {formatarNumeroParaMoeda(total)}
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
