// ============================
// COMPONENTE: PeriodosAquisitivosForm
// Composição do Cálculo de Férias e 13º Proporcional a partir
// dos períodos aquisitivos informados (avos por período).
// ============================

// Lista de sugestões do Campo1 (autocomplete estilo Google — digitação
// livre, mas com sugestões da lista quando o texto bate).
const OPCOES_VANTAGEM_PERIODO = [
  "13ª Salário Integral",
  "13ª Salário Proporcional",
  "1/3 de Férias Indenizadas Integral",
  "1/3 de Férias Indenizadas Proporcional",
  "Férias Indenizadas Integral",
  "Férias Indenizadas Proporcional",
  "Previdência FUNPREV Limite RPPS",
  "Previdência FINANPREV Limite RPPS",
  "Auxílio Alimentação - Proporcional",
  "Auxílio Alimentação - Integral",
  "Auxílio Transporte - Proporcional",
  "Auxílio Transporte - Integral",
  "Abono de Permanência - Proporcional",
  "Abono de Permanência - Integral"
];

function PeriodosAquisitivosForm({
  valorMensal13,
  valorBaseFerias,
  valorTotalTerco,
  valorMensalDoTerco
}) {
  const [selecionarVantagem, setSelecionarVantagem] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState("");
  const [dataFinal, setDataFinal] = React.useState("");
  const [competencia, setCompetencia] = React.useState("");
  const [valorTexto, setValorTexto] = React.useState("");

  const [lista, setLista] = React.useState([]);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = React.useState(null);
  const [editandoId, setEditandoId] = React.useState(null);

  const proximoIdRef = React.useRef(1);

  const avos = calcularAvosPeriodo(dataInicial, dataFinal);
  const dias = diasEntreDatas(dataInicial, dataFinal);

  // Determina se o Campo5 (Valor) é calculado automaticamente com base
  // na vantagem selecionada, ou se fica livre para digitação manual.
  function calcularValorAutomatico() {
    switch (selecionarVantagem) {
      case "13ª Salário Integral":
        return arredondarPadrao(valorMensal13 * 12);
      case "13ª Salário Proporcional":
        return arredondarPadrao(valorMensal13 * avos);
      case "1/3 de Férias Indenizadas Integral":
        return valorTotalTerco;
      case "1/3 de Férias Indenizadas Proporcional":
        return arredondarPadrao(valorMensalDoTerco * avos);
     case "Férias Indenizadas Integral":
        return valorTotalTerco;
      case "Férias Indenizadas Proporcional":
        return arredondarPadrao(valorMensalDoTerco * avos);
      default:
        return null; // sem regra: campo livre para digitação manual
    }
  }

  const valorAutomatico = calcularValorAutomatico();
  const ehValorCalculado = valorAutomatico !== null;

  // Atualiza o Campo5 automaticamente enquanto o usuário preenche os
  // campos anteriores, quando a vantagem selecionada tem regra de cálculo.
  React.useEffect(() => {
    if (ehValorCalculado) {
      setValorTexto(formatarNumeroParaMoeda(valorAutomatico));
    }
  }, [ehValorCalculado, valorAutomatico]);

  function limparCampos() {
    setSelecionarVantagem("");
    setDataInicial("");
    setDataFinal("");
    setCompetencia("");
    setValorTexto("");
    setEditandoId(null);
  }

  // Regras de ativação do botão Inserir:
  // Campo1 obrigatório; Campo2/Campo3 opcionais mas interdependentes
  // (se um for preenchido, o outro também deve ser); Campo4 opcional;
  // Campo5 obrigatório.
  const datasConsistentes =
    (dataInicial === "" && dataFinal === "") ||
    (dataInicial.length === 10 && dataFinal.length === 10);

  const podeInserir =
    selecionarVantagem.trim() !== "" &&
    valorTexto !== "" &&
    datasConsistentes;

  function handleInserir() {
    if (!podeInserir) return;

    const valor = converterMoedaParaNumero(valorTexto);

    const registro = {
      selecionarVantagem,
      dataInicial,
      dataFinal,
      dias,
      avos,
      competencia,
      valor
    };

    if (editandoId) {
      // Atualiza a linha existente em vez de duplicar
      setLista(prev => prev.map(item =>
        item.id === editandoId ? { ...item, ...registro } : item
      ));
    } else {
      setLista(prev => [...prev, { id: proximoIdRef.current++, ...registro }]);
    }

    limparCampos();
  }

  function handleEditar() {
    const item = lista.find(i => i.id === linhaSelecionadaId);
    if (!item) return;

    setSelecionarVantagem(item.selecionarVantagem);
    setDataInicial(item.dataInicial);
    setDataFinal(item.dataFinal);
    setCompetencia(item.competencia);
    setValorTexto(formatarNumeroParaMoeda(item.valor));
    setEditandoId(item.id);
  }

  function handleExcluir() {
    if (!linhaSelecionadaId) return;
    setLista(prev => prev.filter(i => i.id !== linhaSelecionadaId));
    if (editandoId === linhaSelecionadaId) limparCampos();
    setLinhaSelecionadaId(null);
  }

  const total = lista.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div style={{ ...ESTILOS.containerTabela, marginTop: "20px" }}>
      <h3 style={{ color: "#0B2B4A" }}>Períodos Aquisitivos</h3>

      {/* Linha de campos 1 a 5 */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "10px" }}>
        <div style={{ flex: "2", minWidth: "220px" }}>
          <label style={ESTILOS.label}>Selecionar Vantagem:</label><br />
          <input
            list="opcoes-vantagem-periodo"
            style={{ ...ESTILOS.input, width: "100%" }}
            value={selecionarVantagem}
            onChange={e => setSelecionarVantagem(e.target.value)}
            placeholder="Digite ou selecione..."
          />
          <datalist id="opcoes-vantagem-periodo">
            {OPCOES_VANTAGEM_PERIODO.map((opcao, i) => (
              <option key={i} value={opcao} />
            ))}
          </datalist>
        </div>

        <div style={{ flex: "1", minWidth: "140px" }}>
          <label style={ESTILOS.label}>Data Inicial:</label><br />
          <input
            style={{ ...ESTILOS.input, width: "100%" }}
            value={dataInicial}
            onChange={e => setDataInicial(mascaraData(e.target.value))}
            placeholder="DD/MM/AAAA"
          />
        </div>

        <div style={{ flex: "1", minWidth: "140px" }}>
          <label style={ESTILOS.label}>Data Final:</label><br />
          <input
            style={{ ...ESTILOS.input, width: "100%" }}
            value={dataFinal}
            onChange={e => setDataFinal(mascaraData(e.target.value))}
            placeholder="DD/MM/AAAA"
          />
        </div>

        <div style={{ flex: "1", minWidth: "140px" }}>
          <label style={ESTILOS.label}>Competência:</label><br />
          <input
            style={{ ...ESTILOS.input, width: "100%" }}
            value={competencia}
            onChange={e => setCompetencia(formatarMesRef(e.target.value))}
            placeholder="Abr/2023"
          />
        </div>

        <div style={{ flex: "1", minWidth: "140px" }}>
          <label style={ESTILOS.label}>Valor:</label><br />
          <input
            style={{
              ...(ehValorCalculado ? ESTILOS.inputSomenteLeitura : ESTILOS.input),
              width: "100%"
            }}
            value={valorTexto}
            readOnly={ehValorCalculado}
            onChange={e => {
              if (!ehValorCalculado) setValorTexto(mascaraMoeda(e.target.value));
            }}
            placeholder="0,00"
          />
        </div>
      </div>

      {/* Linha de botões (Excluir, Editar, Inserir), alinhados à direita */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginBottom: "15px" }}>
        <button onClick={handleExcluir} disabled={!linhaSelecionadaId}>Excluir</button>
        <button onClick={handleEditar} disabled={!linhaSelecionadaId}>Editar</button>
        <button onClick={handleInserir} disabled={!podeInserir}>Inserir</button>
      </div>

      {/* Quadro1 */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Vantagem</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Data Inicial</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Data Final</th>
            <th style={{ padding: "8px", textAlign: "center" }}>Dias</th>
            <th style={{ padding: "8px", textAlign: "center" }}>Avos</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Competência</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(item => (
            <tr
              key={item.id}
              onClick={() => setLinhaSelecionadaId(item.id)}
              style={{
                cursor: "pointer",
                background: linhaSelecionadaId === item.id ? "#dce8f5" : "transparent"
              }}
            >
              <td style={{ padding: "8px" }}>{item.selecionarVantagem}</td>
              <td style={{ padding: "8px" }}>{item.dataInicial || "—"}</td>
              <td style={{ padding: "8px" }}>{item.dataFinal || "—"}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{item.dias ?? "—"}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{item.dataInicial ? item.avos : "—"}</td>
              <td style={{ padding: "8px" }}>{item.competencia || "—"}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                {formatarNumeroParaMoeda(item.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: "10px",
        textAlign: "right",
        fontWeight: "bold",
        fontSize: "18px",
        background: "#f0f0f0",
        padding: "8px"
      }}>
        Total&nbsp;&nbsp;R$ {formatarNumeroParaMoeda(total)}
      </div>
    </div>
  );
}
