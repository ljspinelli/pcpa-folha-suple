// ============================
// Lista única de sugestões pro campo "Descrição do Desconto"
// (autocomplete estilo Google — digitação livre, mas com sugestões
// da lista quando o texto bate). Junta as antigas listas de
// Contribuição Previdenciária e Imposto de Renda num só rol.
// ============================
const opcoesDescricaoDesconto = [
  "0656 - INSS - Temporário/Comissionado",
  "0688 - FINANPREV",
  "0695 - FUNPREV Contribuição LC112",
  "0638 - FUNPREV Limite RPPS",
  "0636 - FINANPREV Contribuição Limite",
  "0658 - Imposto de Renda - IRRF",
  "RRA 13º Salario Proporcional",
  "Isento de IR - Ato Declaratório Interpretativo SRF nº 5/2005",
  "Imposto de Renda Férias - Ato Declaratório Interpretativo SRF nº 14/2005",
  "0657 - Imposto de Renda Férias",
  "0698 - Imposto de Renda RRA"
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
  totalPeriodosAquisitivos,
  totalAdiantamentos,
  dadosFolha,
  onDadosChange
}) {
  const [descricaoDesconto, setDescricaoDesconto] = React.useState("");

  const [aliquotaDesconto, setAliquotaDesconto] = React.useState("");
  const [aliquotaDescontoRaw, setAliquotaDescontoRaw] = React.useState("");

  const [valorBaseCalculoTexto, setValorBaseCalculoTexto] = React.useState("");

  const [valorDescontoTexto, setValorDescontoTexto] = React.useState("");
  const [valorDescontoNumerico, setValorDescontoNumerico] = React.useState(0);

  const [lista, setLista] = React.useState([]);

  // Cálculo do Valor do Desconto = Alíquota × Valor Base de Cálculo.
  // Só define um valor inicial — o campo continua livre pra edição
  // manual em qualquer momento (não é readOnly).
  React.useEffect(() => {
    if (aliquotaDesconto.includes(",")) {
      const perc = Number(
        aliquotaDesconto.replace("%", "").replace(",", ".")
      ) / 100;

      const base = converterMoedaParaNumero(valorBaseCalculoTexto);
      const calc = base * perc;

      setValorDescontoNumerico(calc);
      setValorDescontoTexto(
        calc.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    }
  }, [aliquotaDesconto, valorBaseCalculoTexto]);

  // Digitação fluída da alíquota
  function onAliquotaDescontoChange(e) {
    const texto = e.target.value.replace(/[^0-9,]/g, "");
    setAliquotaDescontoRaw(texto);
    setAliquotaDesconto(texto);
  }

  function onAliquotaDescontoBlur() {
    setAliquotaDesconto(formatarPercentualFinal(aliquotaDescontoRaw));
  }

  // Valor do Desconto — digitação manual, sempre disponível
  function onValorDescontoChange(e) {
    const formatado = formatarMoedaDigitacao(e.target.value);
    setValorDescontoTexto(formatado);
    setValorDescontoNumerico(converterMoedaParaNumero(formatado));
  }

  function aplicarDescontos() {
    if (!descricaoDesconto || !valorDescontoTexto) return;

    const novaLinha = {
      rubrica: descricaoDesconto,
      aliquota: aliquotaDesconto,
      valor: valorDescontoNumerico
    };

    // Atualiza a linha se a rúbrica já existir na lista, senão adiciona.
    // Isso evita perder descontos já aplicados ao clicar novamente.
    setLista(prev => {
      const semDuplicata = prev.filter(item => item.rubrica !== novaLinha.rubrica);
      return [...semDuplicata, novaLinha];
    });

    setDescricaoDesconto("");
    setAliquotaDesconto("");
    setAliquotaDescontoRaw("");
    setValorBaseCalculoTexto("");
    setValorDescontoTexto("");
    setValorDescontoNumerico(0);
  }

  function removerDesconto(rubrica) {
    setLista(prev => prev.filter(item => item.rubrica !== rubrica));
  }

  // Total dos descontos (valores já numéricos, com precisão total)
  const total = lista.reduce((acc, item) => acc + item.valor, 0);

  // Total Bruto = Total do PeriodosAquisitivosForm.js - Total do AdiantamentosForm.js
  // (mantido sem arredondar aqui — só na exibição)
  const totalBruto = totalPeriodosAquisitivos - totalAdiantamentos;

  // Total Líquido = Total Bruto - Total dos descontos aplicados (Quadro1 deste formulário)
  const totalLiquido = totalBruto - total;

  // Repassa lista de descontos aplicados e os totais para cima (uso no PDF)
  React.useEffect(() => {
    if (typeof onDadosChange === "function") {
      onDadosChange({ lista, total, totalBruto, totalLiquido });
    }
  }, [lista, total, totalBruto, totalLiquido, onDadosChange]);

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

      {/* Links de apoio ao cálculo */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
        <a href="https://www.calcule.net/trabalhista/calculo-de-inss/" target="_blank" rel="noreferrer">
          Cálculo INSS
        </a>
        <a href="https://www27.receita.fazenda.gov.br/simulador-irpf/" target="_blank" rel="noreferrer">
          Alíquota Efetiva IRRF
        </a>
        <a href="https://www27.receita.fazenda.gov.br/simulador-irpf-rra/#/" target="_blank" rel="noreferrer">
          Alíquota Efetiva RRA
        </a>
      </div>

      {/* Campos 1 a 4, em duas colunas */}
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>

        {/* Coluna esquerda: Descrição do Desconto + Valor Base de Cálculo */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label style={ESTILOS.label}>Descrição do Desconto:</label><br />
          <input
            list="opcoes-descricao-desconto"
            style={{ ...ESTILOS.input, width: "100%" }}
            value={descricaoDesconto}
            onChange={e => setDescricaoDesconto(e.target.value)}
            placeholder="Digite ou selecione..."
          />
          <datalist id="opcoes-descricao-desconto">
            {opcoesDescricaoDesconto.map((op, i) => (
              <option key={i} value={op} />
            ))}
          </datalist>

          {/* Valor Base de Cálculo */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor Base de Cálculo:</label><br />
            <input
              list="opcoes-valor-base-calculo"
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorBaseCalculoTexto}
              onChange={e => setValorBaseCalculoTexto(mascaraMoeda(e.target.value))}
              placeholder="0,00"
            />
            <datalist id="opcoes-valor-base-calculo">
              <option value={formatarNumeroParaMoeda(dadosFolha.valorBaseIR)}>
                Valor Base IR — {formatarNumeroParaMoeda(dadosFolha.valorBaseIR)}
              </option>
              <option value={formatarNumeroParaMoeda(dadosFolha.valorBaseRPPS)}>
                Valor Base Previdência RPPS — {formatarNumeroParaMoeda(dadosFolha.valorBaseRPPS)}
              </option>
              <option value={formatarNumeroParaMoeda(dadosFolha.valorBaseINSS)}>
                Valor Base Previdência INSS — {formatarNumeroParaMoeda(dadosFolha.valorBaseINSS)}
              </option>
            </datalist>
          </div>
        </div>

        {/* Coluna direita: Alíquota + Valor do Desconto */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label style={ESTILOS.label}>Alíquota:</label><br />
          <input
            style={{ ...ESTILOS.input, width: "100%" }}
            value={aliquotaDesconto}
            onChange={onAliquotaDescontoChange}
            onBlur={onAliquotaDescontoBlur}
            placeholder="00,00%"
          />

          {/* Valor do Desconto */}
          <div style={{ marginTop: "10px" }}>
            <label style={ESTILOS.label}>Valor do Desconto:</label><br />
            <input
              style={{ ...ESTILOS.input, width: "100%" }}
              value={valorDescontoTexto}
              onChange={onValorDescontoChange}
              placeholder="0,00"
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
