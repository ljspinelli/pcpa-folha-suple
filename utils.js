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
// Mapa de meses abreviados (pt-BR) para número do mês (1-12)
const MESES_ABREV = {
  Jan: 1, Fev: 2, Mar: 3, Abr: 4, Mai: 5, Jun: 6,
  Jul: 7, Ago: 8, Set: 9, Out: 10, Nov: 11, Dez: 12
};

// Recebe referência no formato "Mmm/AAAA" (ex: "Dez/2023")
// e retorna o número de dias daquele mês/ano, calculado
// automaticamente (considera anos bissextos corretamente).
function diasNoMes(mesRef) {
  if (!mesRef || !mesRef.includes("/")) return 30; // padrão de segurança

  const [mesAbrev, anoTexto] = mesRef.split("/");
  const mesNumero = MESES_ABREV[mesAbrev];
  const ano = Number(anoTexto);

  if (!mesNumero || !ano || anoTexto.length < 4) return 30;

  // Dia 0 do mês seguinte = último dia do mês atual
  return new Date(ano, mesNumero, 0).getDate();
}

// Arredondamento padrão (meio para cima), evitando problemas
// de ponto flutuante do JavaScript
function arredondarPadrao(valor, casas = 2) {
  const fator = Math.pow(10, casas);
  return Math.round((valor + Number.EPSILON) * fator) / fator;
}
