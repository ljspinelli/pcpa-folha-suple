// ============================
// UTILITÁRIOS E FUNÇÕES
// ============================

/**
 * Formata texto para formato Mês/Ano (Abr/2020)
 * @param {string} texto - Texto a ser formatado
 * @returns {string} Texto formatado
 */
export function formatarMesRef(texto) {
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

/**
 * Formata valor para máscara de moeda
 * @param {string} valor - Valor a ser formatado
 * @returns {string} Valor formatado em moeda
 */
export function mascaraMoeda(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return "";
  
  const num = Number(digitos) / 100;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Converte valor formatado em moeda para número
 * @param {string} valorFormatado - Valor formatado (ex: "1.234,56")
 * @returns {number} Número
 */
export function converterMoedaParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  const num = Number(valorFormatado.replace(/\./g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}

/**
 * Calcula total de um conjunto de valores
 * @param {object} valoresData - Objeto com os valores
 * @returns {number} Total em número
 */
export function calcularTotal(valoresData) {
  return Object.values(valoresData).reduce((acc, v) => {
    return acc + converterMoedaParaNumero(v);
  }, 0);
}

/**
 * Calcula base de cálculo para IR, RPPS ou INSS
 * @param {object} valoresData - Objeto com os valores
 * @param {array} codigos - Array de códigos a incluir na base
 * @returns {number} Total da base em número
 */
export function calcularBaseCalculo(valoresData, codigos) {
  return codigos.reduce((acc, codigo) => {
    const v = valoresData[codigo];
    if (!v) return acc;
    return acc + converterMoedaParaNumero(v);
  }, 0);
}

/**
 * Formata número para moeda brasileira
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado em moeda
 */
export function formatarNumeroParaMoeda(numero) {
  return numero.toLocaleString("pt-BR", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}