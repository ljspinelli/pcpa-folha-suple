import React from "react";
import PageLayout from "./layout/PageLayout";
import RequesterForm from "./components/RequesterForm";
import BasicInfoForm from "./components/BasicInfoForm";

export default function App() {
  return (
    <PageLayout>
      {/* Cartão 1 */}
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

      {/* Cartão 2 */}
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
    </PageLayout>
  );
}
