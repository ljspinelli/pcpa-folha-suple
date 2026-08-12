function App() {
  const [totalPeriodosAquisitivos, setTotalPeriodosAquisitivos] = React.useState(0);
  const [listaPeriodosAquisitivos, setListaPeriodosAquisitivos] = React.useState([]);
  const [totalAdiantamentos, setTotalAdiantamentos] = React.useState(0);
  const [listaAdiantamentos, setListaAdiantamentos] = React.useState([]);
  const [dadosRequerente, setDadosRequerente] = React.useState({
    nome: "", cpf: "", matricula: "", cargo: "", pae: "", interessado: "", assunto: ""
  });
  const [dadosVinculo, setDadosVinculo] = React.useState({
    posse: "", motivoPosse: "", encerramento: "", motivoEncerramento: ""
  });
  const [dadosDescontos, setDadosDescontos] = React.useState({
    lista: [], total: 0, totalBruto: 0, totalLiquido: 0
  });
  const [pdfData, setPdfData] = React.useState({
    abaReferencia: "",
    numeroFolha: "",
    redutorConstitucional: 0,
    nomeAssinante: "",
    cargoAssinante: "",
    matriculaAssinante: ""
  });
  const [dadosFolha, setDadosFolha] = React.useState({
    mesRef: "",
    valores: {},
    valorBaseDias: 0,
    valorBaseFerias: 0,
    valorBase13: 0,
    valorBasePecunia: 0,
    valorBaseAuxilioFuneral: 0,
    valorBaseATS: 0,
    valorBaseAuxilioDoenca: 0,
    valorBaseIR: 0,
    valorBaseRPPS: 0,
    valorBaseINSS: 0
  });

  return (
    <PageLayout>

      {/* Identificação do Requerente */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>Identificação do Requerente</h2>
        <RequesterForm onDadosChange={setDadosRequerente} />
      </div>

      {/* Informações Preliminares */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Informações Preliminares para Base de Cálculo
        </h2>
        <BasicInfoForm onDadosChange={setDadosVinculo} />
      </div>

      {/* Vantagens */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Composição da Remuneração – Vantagens
        </h2>
        <PayrollForm
          onDadosChange={setDadosFolha}
        />
      </div>

      {/* Cálculo de 13º e Férias (avos) */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Cálculo de 13º e Férias
        </h2>
        <ThirteenthVacationForm
          valorBase13={dadosFolha.valorBase13}
          mesRef13={dadosFolha.mesRef}
          valorBaseFerias={dadosFolha.valorBaseFerias}
          mesRefFerias={dadosFolha.mesRef}
          onTotalPeriodosChange={setTotalPeriodosAquisitivos}
          onListaPeriodosChange={setListaPeriodosAquisitivos}
        />
      </div>

      {/* Adiantamentos e Outros Valores Recebidos */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Adiantamentos e Outros Valores Recebidos
        </h2>
        <AdiantamentosForm
          valorBase13={dadosFolha.valorBase13}
          valorDiario13={
            dadosFolha.valorBase13 /
            diasNoMes(dadosFolha.mesRef)
          }
          onTotalChange={setTotalAdiantamentos}
          onListaChange={setListaAdiantamentos}
        />
      </div>

      {/* Descontos */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Descontos e Retenções
        </h2>
        <DiscountForm
          totalPeriodosAquisitivos={totalPeriodosAquisitivos}
          listaPeriodosAquisitivos={listaPeriodosAquisitivos}
          totalAdiantamentos={totalAdiantamentos}
          onDadosChange={setDadosDescontos}
        />
      </div>

      {/* Dados para Emissão do PDF */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>
          Dados para Emissão do PDF
        </h2>
        <PdfDataForm onDadosChange={setPdfData} />
      </div>

    </PageLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
