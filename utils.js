// ============================
// FUNÇÕES UTILITÁRIAS
// ============================

function formatarMesRef(texto) {
  texto = texto.replace(/\s+/g, "");
  let letras = texto.replace(/[^A-Za-z]/g, "").slice(0, 3);
  
  if (letras.length > 0) {
    letras = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
  }
  
  const mesesValidos = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  if (letras.length === 3 && !mesesValidos.includes(letras)) return "";
  
  let ano = texto.replace(/\D/g, "").slice(0, 4);
  
  if (letras.length === 3) {
    return ano.length > 0 ? `${letras}/${ano}` : `${letras}/`;
  }
  
  return letras;
}

function mascaraMoeda(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return "";
  
  const num = Number(digitos) / 100;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function converterMoedaParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  const num = Number(valorFormatado.replace(/\./g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}

function calcularTotal(valoresData) {
  return Object.values(valoresData).reduce((acc, v) => {
    return acc + converterMoedaParaNumero(v);
  }, 0);
}

function calcularBaseCalculo(valoresData, codigos) {
  return codigos.reduce((acc, codigo) => {
    const v = valoresData[codigo];
    if (!v) return acc;
    return acc + converterMoedaParaNumero(v);
  }, 0);
}

function formatarNumeroParaMoeda(numero) {
  return numero.toLocaleString("pt-BR", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
