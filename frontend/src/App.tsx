import React from "react";
import PageLayout from "./layout/PageLayout";
import RequesterForm from "./components/RequesterForm";
import BasicInfoForm from "./components/BasicInfoForm";
import PayrollForm from "./components/PayrollForm";

export default function App() {
  return (
    <PageLayout>

      {/* Cartão 1 – Identificação */}
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
          Identificação do Requerente
        </h2>
        <RequesterForm />
      </div>

      {/* Cartão 2 – Informações Preliminares */}
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

      {/* Cartão 3 – Composição da Remuneração */}
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
        <PayrollForm />
      </div>

    </PageLayout>
  );
}
