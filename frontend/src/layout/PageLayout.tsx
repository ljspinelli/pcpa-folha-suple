import React from "react";

export default function PageLayout({ children }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f8"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ color: "#0B2B4A", marginBottom: "10px" }}>
          Folha Suplementar – PCPA
        </h1>
        <p style={{ marginTop: "0" }}>
          Protótipo inicial para substituir planilhas Excel no cálculo de
          13º proporcional e férias proporcionais.
        </p>
      </div>

      {children}
    </div>
  );
}
