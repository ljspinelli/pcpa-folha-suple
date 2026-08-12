// ============================
// COMPONENTE: AdiantamentosForm
// Adiantamentos e Outros Valores Recebidos que podem abater
// do valor total já apurado (registro/consulta por enquanto).
// ============================

// Lista de sugestões do Campo1 (autocomplete estilo Google — digitação
// livre, mas com sugestões da lista quando o texto bate).
const OPCOES_VANTAGEM_ADIANTAMENTO = [
  "Débito com a Administração Pública - Não Prescrito",
  "Dias Não Trabalhados",
  "Adiantamento de 13º Salário",
  "Remuneração Liquida Proporcional",
  "Remuneração Liquida Integral",
  "Auxilio Alimentação Integral",
  "Auxilio Alimentação Proporcional",
  "Auxilio Transporte Integral",
  "Auxilio Transporte Proporcional"
];

function AdiantamentosForm({ valorBase13, valorDiario13, onTotalChange, onListaChange }) {
  const [selecionarVantagem, setSelecionarVantagem] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState("");
  const [dataFinal, setDataFinal] = React.useState("");
  const [competencia, setCompetencia] = React.useState("");
  const [valorTexto, setValorTexto] = React.useState("");

  const [lista, setLista] = React.useState([]);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = React.useState(null);
  const [editandoId, setEditandoId] = React.useState(null);

  const proximoIdRef = React.useRef(1);
  const inputVantagemRef = React.useRef(null);

  const avos = calcularAvosPeriodo(dataInicial, dataFinal);
  const dias = diasEntreDatas(dataInicial, dataFinal);

  // Determina se o Campo5 (Valor) é calculado automaticamente com base
  // na vantagem selecionada, ou se fica livre para digitação manual.
  function calcularValorAutomatico() {
    switch (selecionarVantagem) {
      case "Adiantamento de 13º Salário":
        return valorBase13 / 2;
      case "Dias Não Trabalhados":
        return valorDiario13 * (dias || 0);
      default:
        return null;
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

    // Quando o valor vem de fórmula, usa o número com precisão total
    // (valorAutomatico) em vez de reconverter do texto já arredondado
    // que aparece na tela — evita perder casas decimais no registro.
    const valor = ehValorCalculado ? valorAutomatico : converterMoedaParaNumero(valorTexto);

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

    // Reseleciona o Campo1 pra agilizar o próximo lançamento
    if (inputVantagemRef.current) inputVantagemRef.current.focus();
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

  // Repassa o total para cima, caso o componente pai queira usar
  // (ex.: abater do Valor Líquido no futuro)
  React.useEffect(() => {
    if (typeof onTotalChange === "function") {
      onTotalChange(total);
    }
  }, [total, onTotalChange]);

  // Repassa a lista completa para cima (uso no PDF)
  React.useEffect(() => {
    if (typeof onListaChange === "function") {
      onListaChange(lista);
    }
  }, [lista, onListaChange]);

  return (
    <div style={ESTILOS.containerPrincipal}>

      {/* Linha de campos 1 a 5 */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "10px" }}>
        <div style={{ flex: "2", minWidth: "220px" }}>
          <label style={ESTILOS.label}>Selecionar Vantagem:</label><br />
          <input
            ref={inputVantagemRef}
            list="opcoes-vantagem-adiantamento"
            style={{ ...ESTILOS.input, width: "100%" }}
            value={selecionarVantagem}
            onChange={e => setSelecionarVantagem(e.target.value)}
            placeholder="Digite ou selecione..."
          />
          <datalist id="opcoes-vantagem-adiantamento">
            {OPCOES_VANTAGEM_ADIANTAMENTO.map((opcao, i) => (
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
