import React from "react";
import RequesterForm from "./components/RequesterForm";

export default function App() {
  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#0B2B4A" }}>
        Folha Suplementar – PCPA
      </h1>

      <p>
        Protótipo inicial para substituir planilhas Excel no cálculo de
        13º proporcional e férias proporcionais.
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h2 style={{ color: "#0B2B4A" }}>
        Formulário de Identificação do Requerente
      </h2>

      {/* Aqui o formulário é exibido */}
      <RequesterForm />
    </div>
  );
}
