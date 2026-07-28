// ============================
// COMPONENTE: AdiantamentosForm
// Adiantamentos e Outros Valores Recebidos que podem abater
// do valor total já apurado (registro/consulta por enquanto).
// ============================

const ITENS_ADIANTAMENTO = [
  "Auxilio Alimentação",
  "Auxilio Transporte",
  "Débito com a Administração Pública (não prescrito)",
  "Dias não Trabalhados",
  "Remuneração Liquida",
  "Outros"
];

function AdiantamentosForm({ onTotalChange }) {
  const [selecionarItem, setSelecionarItem] = React.useState("");
  const [detalhar, setDetalhar] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState("");
  const [dataFinal, setDataFinal] = React.useState("");
  const [valorTexto, setValorTexto] = React.useState("");

  const [lista, setLista] = React.useState([]);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = React.useState(null);
  const [editandoId, setEditandoId] = React.useState(null);

  const proximoIdRef = React.useRef(1);

  function limparCampos() {
    setSelecionarItem("");
    setDetalhar("");
    setDataInicial("");
    setDataFinal("");
    setValorTexto("");
    setEditandoId(null);
  }

  function handleInserir() {
    if (!selecionarItem || !detalhar || !dataInicial || !dataFinal || !valorTexto) return;

    const descricao = `${selecionarItem} - ${detalhar}`;
    const valor = converterMoedaParaNumero(valorTexto);

    if (editandoId) {
      // Atualiza a linha existente em vez de duplicar
      setLista(prev => prev.map(item =>
        item.id === editandoId
          ? { ...item, selecionarItem, detalhar, descricao, dataInicial, dataFinal, valor }
          : item
      ));
    } else {
      setLista(prev => [...prev, {
        id: proximoIdRef.current++,
        selecionarItem,
        detalhar,
        descricao,
        dataInicial,
        dataFinal,
        valor
      }]);
    }

    limparCampos();
  }

  function handleEditar() {
    const item = lista.find(i => i.id === linhaSelecionadaId);
    if (!item) return;

    setSelecionarItem(item.selecionarItem);
    setDetalhar(item.detalhar);
    setDataInicial(item.dataInicial);
    setDataFinal(item.dataFinal);
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

  return (
    <div style={ESTILOS.containerPrincipal}>
      <div style={{ ...ESTILOS.containerTabela, display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* Coluna principal: campos + tabela + total */}
        <div style={{ flex: "1", minWidth: "0" }}>

          {/* Linha de campos 1 a 5 */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
            <div style={{ flex: "2", minWidth: "200px" }}>
              <label style={ESTILOS.label}>Selecionar Item:</label><br />
              <select
                style={{ ...ESTILOS.select, width: "100%" }}
                value={selecionarItem}
                onChange={e => setSelecionarItem(e.target.value)}
              >
                <option value="">Selecione...</option>
                {ITENS_ADIANTAMENTO.map((item, i) => (
                  <option key={i} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: "3", minWidth: "220px" }}>
              <label style={ESTILOS.label}>Detalhar:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={detalhar}
                onChange={e => setDetalhar(mascaraTextoLivre(e.target.value))}
                placeholder="Descreva por extenso"
              />
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
              <label style={ESTILOS.label}>Valor:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={valorTexto}
                onChange={e => setValorTexto(mascaraMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Quadro1 */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Descrição dos Itens</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Data Inicial</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Data Final</th>
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
                  <td style={{ padding: "8px" }}>{item.descricao}</td>
                  <td style={{ padding: "8px" }}>{item.dataInicial}</td>
                  <td style={{ padding: "8px" }}>{item.dataFinal}</td>
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

        {/* Botões */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "110px" }}>
          <button onClick={handleInserir}>Inserir</button>
          <button onClick={handleEditar} disabled={!linhaSelecionadaId}>Editar</button>
          <button onClick={handleExcluir} disabled={!linhaSelecionadaId}>Excluir</button>
        </div>
      </div>
    </div>
  );
}
