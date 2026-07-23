// ============================
// COMPONENTE: PeriodosAquisitivosForm
// Composição do Cálculo de Férias e 13º Proporcional a partir
// dos períodos aquisitivos informados (avos por período).
// ============================

function PeriodosAquisitivosForm({ valorMensal13, valorMensalFerias }) {
  const [vantagem, setVantagem] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState("");
  const [dataFinal, setDataFinal] = React.useState("");
  const [lista, setLista] = React.useState([]);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = React.useState(null);
  const [editandoId, setEditandoId] = React.useState(null);

  const proximoIdRef = React.useRef(1);

  const avos = calcularAvosPeriodo(dataInicial, dataFinal);

  function limparCampos() {
    setVantagem("");
    setDataInicial("");
    setDataFinal("");
    setEditandoId(null);
  }

  function montarDescricao(vantagemSelecionada, avosCalculados) {
    if (vantagemSelecionada === "13° Salário") {
      return avosCalculados === 12 ? "13° Salário Integral" : "13° Salário Proporcional";
    }
    if (vantagemSelecionada === "1/3 de Férias") {
      return avosCalculados === 12 ? "1/3 de Férias Integral" : "1/3 de Férias Proporcional";
    }
    return "";
  }

  function handleInserir() {
    if (!vantagem || !dataInicial || !dataFinal || avos <= 0) return;

    const valorUnitario = vantagem === "13° Salário" ? valorMensal13 : valorMensalFerias;
    const valor = arredondarPadrao(valorUnitario * avos);
    const descricao = montarDescricao(vantagem, avos);

    if (editandoId) {
      // Atualiza a linha existente em vez de duplicar
      setLista(prev => prev.map(item =>
        item.id === editandoId
          ? { ...item, vantagem, descricao, dataInicial, dataFinal, avos, valor }
          : item
      ));
    } else {
      setLista(prev => [...prev, {
        id: proximoIdRef.current++,
        vantagem,
        descricao,
        dataInicial,
        dataFinal,
        avos,
        valor
      }]);
    }

    limparCampos();
  }

  function handleEditar() {
    const item = lista.find(i => i.id === linhaSelecionadaId);
    if (!item) return;

    setVantagem(item.vantagem);
    setDataInicial(item.dataInicial);
    setDataFinal(item.dataFinal);
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

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* Coluna principal: campos + tabela + total */}
        <div style={{ flex: "1", minWidth: "0" }}>

          {/* Linha de campos 1 a 4 */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
            <div style={{ flex: "2", minWidth: "180px" }}>
              <label style={ESTILOS.label}>Selecionar Vantagem:</label><br />
              <select
                style={{ ...ESTILOS.select, width: "100%" }}
                value={vantagem}
                onChange={e => setVantagem(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="13° Salário">13° Salário</option>
                <option value="1/3 de Férias">1/3 de Férias</option>
              </select>
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

            <div style={{ flex: "1", minWidth: "80px" }}>
              <label style={ESTILOS.label}>Avos:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={avos}
                readOnly
              />
            </div>
          </div>

          {/* Quadro1 */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Descrição da Vantagem</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Data Inicial</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Data Final</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Avos</th>
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
                  <td style={{ padding: "8px", textAlign: "center" }}>{item.avos}</td>
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
