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

  // Mini-calculadora de Dias Corridos/Úteis, usada quando a vantagem
  // digitada não tem fórmula pronta (ex: Auxílio Alimentação/Transporte,
  // ou qualquer rubrica nova digitada livremente no futuro)
  const [tipoCalculoDias, setTipoCalculoDias] = React.useState("corridos");
  const [mesReferenciaCalculo, setMesReferenciaCalculo] = React.useState("");
  const [feriadosPontosFacultativos, setFeriadosPontosFacultativos] = React.useState("");
  const [valorIntegralTexto, setValorIntegralTexto] = React.useState("");

  const [lista, setLista] = React.useState([]);
  const [linhaSelecionadaId, setLinhaSelecionadaId] = React.useState(null);
  const [editandoId, setEditandoId] = React.useState(null);

  const proximoIdRef = React.useRef(1);
  const inputVantagemRef = React.useRef(null);

  const avos = calcularAvosPeriodo(dataInicial, dataFinal);

  // Determina se a vantagem digitada é uma das que já têm fórmula
  // pronta. Qualquer outra (Auxílio Alimentação/Transporte, ou rubrica
  // nova digitada livremente) cai na mini-calculadora abaixo.
  function calcularValorFormulaConhecida() {
    switch (selecionarVantagem) {
      case "Adiantamento de 13º Salário":
        return valorBase13 / 2;
      case "Dias Não Trabalhados":
        return valorDiario13 * (diasEntreDatas(dataInicial, dataFinal) || 0);
      default:
        return null;
    }
  }

  const valorFormulaConhecida = calcularValorFormulaConhecida();
  const ehFormulaConhecida = valorFormulaConhecida !== null;

  // Mostra a mini-calculadora só quando algo foi digitado e não bate
  // com nenhuma fórmula pronta.
  const mostrarMiniCalculadora = selecionarVantagem.trim() !== "" && !ehFormulaConhecida;

  // --- Mini-calculadora de Dias Corridos/Úteis ---
  const diasUteisMes = diasUteisNoMes(mesReferenciaCalculo);
  const diasCorridosMes = diasNoMes(mesReferenciaCalculo);
  const diasUteisMesAjustado = Math.max(
    0,
    diasUteisMes - (Number(feriadosPontosFacultativos) || 0)
  );
  const valorIntegral = converterMoedaParaNumero(valorIntegralTexto);
  const diasBaseDoMes = tipoCalculoDias === "uteis" ? diasUteisMesAjustado : diasCorridosMes;
  const valorDiarioMiniCalc = diasBaseDoMes > 0 ? valorIntegral / diasBaseDoMes : 0;

  // Dias do período (Data Inicial/Final): corridos ou úteis, conforme
  // o Tipo de Cálculo escolhido na mini-calculadora
  const diasPeriodoUteis = diasUteisEntreDatas(dataInicial, dataFinal);
  const diasPeriodoCorridos = diasEntreDatas(dataInicial, dataFinal);
  const dias = mostrarMiniCalculadora && tipoCalculoDias === "uteis"
    ? diasPeriodoUteis
    : diasPeriodoCorridos;

  const valorMiniCalc = valorIntegral > 0 ? valorDiarioMiniCalc * (dias || 0) : null;

  // Determina se o Campo5 (Valor) é calculado automaticamente — por
  // fórmula pronta OU pela mini-calculadora — ou se fica livre para
  // digitação manual.
  const valorAutomatico = ehFormulaConhecida ? valorFormulaConhecida : valorMiniCalc;
  const ehValorCalculado = valorAutomatico !== null;

  // Atualiza o Campo5 automaticamente enquanto o usuário preenche os
  // campos anteriores, quando há regra de cálculo aplicável.
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
    setTipoCalculoDias("corridos");
    setMesReferenciaCalculo("");
    setFeriadosPontosFacultativos("");
    setValorIntegralTexto("");
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
      valor,
      // Guardados só pra reconstituir a mini-calculadora ao Editar
      tipoCalculoDias,
      mesReferenciaCalculo,
      feriadosPontosFacultativos,
      valorIntegralTexto
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
    setTipoCalculoDias(item.tipoCalculoDias || "corridos");
    setMesReferenciaCalculo(item.mesReferenciaCalculo || "");
    setFeriadosPontosFacultativos(item.feriadosPontosFacultativos || "");
    setValorIntegralTexto(item.valorIntegralTexto || "");
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

      {/* Linha de campos 1 a 4 */}
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
      </div>

      {/* Mini-calculadora de Dias Corridos/Úteis — só aparece quando a
          vantagem digitada não bate com nenhuma fórmula pronta */}
      {mostrarMiniCalculadora && (
        <div style={{
          background: "#f7f9fb",
          border: "1px solid #dbe4ea",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "15px"
        }}>
          <div style={{ fontWeight: "bold", color: "#0B2B4A", marginBottom: "8px" }}>
            Cálculo do Valor Diário ({selecionarVantagem})
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "160px" }}>
              <label style={ESTILOS.label}>Tipo de Cálculo:</label><br />
              <select
                style={{ ...ESTILOS.select, width: "100%" }}
                value={tipoCalculoDias}
                onChange={e => setTipoCalculoDias(e.target.value)}
              >
                <option value="corridos">Dias Corridos</option>
                <option value="uteis">Dias Úteis</option>
              </select>
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Mês de Referência:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={mesReferenciaCalculo}
                onChange={e => setMesReferenciaCalculo(formatarMesRef(e.target.value))}
                placeholder="Abr/2023"
              />
            </div>

            {tipoCalculoDias === "uteis" && (
              <>
                <div style={{ flex: "1", minWidth: "140px" }}>
                  <label style={ESTILOS.label}>Dias Úteis no Mês:</label><br />
                  <input
                    style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                    value={mesReferenciaCalculo ? diasUteisMes : ""}
                    readOnly
                    placeholder="0"
                  />
                </div>

                <div style={{ flex: "1", minWidth: "160px" }}>
                  <label style={{ ...ESTILOS.label, fontSize: "12px" }}>Feriados/Pontos Facultativos:</label><br />
                  <input
                    style={{ ...ESTILOS.input, width: "100%" }}
                    value={feriadosPontosFacultativos}
                    onChange={e => setFeriadosPontosFacultativos(e.target.value.replace(/\D/g, ""))}
                    placeholder="0"
                  />
                </div>
              </>
            )}

            <div style={{ flex: "1", minWidth: "160px" }}>
              <label style={ESTILOS.label}>Valor Integral da Rubrica:</label><br />
              <input
                style={{ ...ESTILOS.input, width: "100%" }}
                value={valorIntegralTexto}
                onChange={e => setValorIntegralTexto(mascaraMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>

            <div style={{ flex: "1", minWidth: "140px" }}>
              <label style={ESTILOS.label}>Valor Diário:</label><br />
              <input
                style={{ ...ESTILOS.inputSomenteLeitura, width: "100%" }}
                value={formatarNumeroParaMoeda(valorDiarioMiniCalc)}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Valor — linha própria, após a calculadora e antes do quadro */}
      <div style={{ marginBottom: "15px" }}>
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
