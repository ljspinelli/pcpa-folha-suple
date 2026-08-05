function App() {
  const [totalVantagens, setTotalVantagens] = React.useState(0);
  const [totalDescontos, setTotalDescontos] = React.useState(0);
  const [totalBasePrevidencia, setTotalBasePrevidencia] = React.useState(0);
  const [totalPeriodosAquisitivos, setTotalPeriodosAquisitivos] = React.useState(0);
  const [listaPeriodosAquisitivos, setListaPeriodosAquisitivos] = React.useState([]);
  const [totalAdiantamentos, setTotalAdiantamentos] = React.useState(0);
  const [decimoFeriasData, setDecimoFeriasData] = React.useState({
    valorBase13: 0,
    mesRef13: "",
    valorBaseFerias: 0,
    mesRefFerias: ""
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
        <RequesterForm />
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
        <BasicInfoForm />
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
          onTotalChange={setTotalVantagens}
          onDecimoFeriasChange={setDecimoFeriasData}
          onBasePrevidenciaChange={setTotalBasePrevidencia}
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
          valorBase13={decimoFeriasData.valorBase13}
          mesRef13={decimoFeriasData.mesRef13}
          valorBaseFerias={decimoFeriasData.valorBaseFerias}
          mesRefFerias={decimoFeriasData.mesRefFerias}
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
          valorBase13={decimoFeriasData.valorBase13}
          valorDiario13={arredondarPadrao(
            decimoFeriasData.valorBase13 /
            diasNoMes(decimoFeriasData.mesRef13)
          )}
          onTotalChange={setTotalAdiantamentos}
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
          totalVantagens={totalVantagens}
          totalBasePrevidencia={totalBasePrevidencia}
          totalPeriodosAquisitivos={totalPeriodosAquisitivos}
          listaPeriodosAquisitivos={listaPeriodosAquisitivos}
          totalAdiantamentos={totalAdiantamentos}
          setTotalDescontos={setTotalDescontos}
        />
      </div>

      {/* Valor Líquido */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#0B2B4A" }}>Valor Líquido</h2>
        <NetValueForm
          totalVantagens={totalVantagens}
          totalDescontos={totalDescontos}
        />
      </div>

    </PageLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
