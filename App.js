function App() {
  const [totalVantagens, setTotalVantagens] = React.useState(0);

  return (
    <PageLayout>

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
        <PayrollForm onTotalChange={setTotalVantagens} />
      </div>

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
        <DiscountForm totalVantagens={totalVantagens} />
      </div>

    </PageLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
