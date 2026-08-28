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
// Converte texto "DD/MM/AAAA" em objeto Date. Retorna null se incompleto/inválido.
function parseDataBR(texto) {
  if (!texto || texto.length < 10) return null;
  const [diaTxt, mesTxt, anoTxt] = texto.split("/");
  if (!diaTxt || !mesTxt || !anoTxt || anoTxt.length < 4) return null;

  const dia = Number(diaTxt);
  const mes = Number(mesTxt);
  const ano = Number(anoTxt);

  const data = new Date(ano, mes - 1, dia);
  // Confirma que a data é realmente válida (evita 31/02 virar 03/03, etc.)
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return null;
  }
  return data;
}

// Calcula os avos (0 a 12) entre duas datas no formato "DD/MM/AAAA",
// seguindo a regra trabalhista: mês em que a pessoa trabalhou 15 dias
// ou mais conta como mês cheio (1 avo).
function calcularAvosPeriodo(dataInicialTexto, dataFinalTexto) {
  const dataInicial = parseDataBR(dataInicialTexto);
  const dataFinal = parseDataBR(dataFinalTexto);

  if (!dataInicial || !dataFinal || dataFinal < dataInicial) return 0;

  let avos = 0;
  let cursor = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), 1);
  const fimLimite = new Date(dataFinal.getFullYear(), dataFinal.getMonth(), 1);

  while (cursor <= fimLimite) {
    const ano = cursor.getFullYear();
    const mes = cursor.getMonth();

    const inicioMes = new Date(ano, mes, 1);
    const fimMes = new Date(ano, mes + 1, 0);

    const inicioPeriodo = dataInicial > inicioMes ? dataInicial : inicioMes;
    const fimPeriodo = dataFinal < fimMes ? dataFinal : fimMes;

    const diasTrabalhados = Math.floor((fimPeriodo - inicioPeriodo) / 86400000) + 1;

    if (diasTrabalhados >= 15) avos++;

    cursor = new Date(ano, mes + 1, 1);
  }

  return Math.min(avos, 12);
}
// Quantidade de dias entre duas datas "DD/MM/AAAA" (inclusive).
// Retorna null se as datas estiverem incompletas ou inválidas.
function diasEntreDatas(dataInicialTexto, dataFinalTexto) {
  const dataInicial = parseDataBR(dataInicialTexto);
  const dataFinal = parseDataBR(dataFinalTexto);

  if (!dataInicial || !dataFinal || dataFinal < dataInicial) return null;

  return Math.floor((dataFinal - dataInicial) / 86400000) + 1;
}
// Calcula os avos de FÉRIAS (0 a 12) — regra diferente do 13º salário.
// Férias contam por blocos de 30 dias corridos a partir do início do
// período aquisitivo (não pelo mês civil/calendário). A fração final
// igual ou superior a 15 dias conta como avo completo.
function calcularAvosFerias(dataInicialTexto, dataFinalTexto) {
  const totalDias = diasEntreDatas(dataInicialTexto, dataFinalTexto);
  if (totalDias === null) return 0;

  const mesesCompletos = Math.floor(totalDias / 30);
  const diasRestantes = totalDias % 30;

  let avos = mesesCompletos;
  if (diasRestantes >= 15) avos++;

  return Math.min(avos, 12);
}
// Converte um valor em reais para texto por extenso em português
// (ex: 1500.50 -> "mil e quinhentos reais e cinquenta centavos"),
// usado na frase final do PDF da Folha Suplementar.
function numeroPorExtenso(valor) {
  const UNIDADES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const DEZ_A_DEZENOVE = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const CENTENAS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  function trescentos(n) {
    if (n === 0) return "";
    if (n === 100) return "cem";
    const partes = [];
    const c = Math.floor(n / 100);
    const resto = n % 100;
    if (c > 0) partes.push(CENTENAS[c]);
    if (resto > 0) {
      if (resto < 10) partes.push(UNIDADES[resto]);
      else if (resto < 20) partes.push(DEZ_A_DEZENOVE[resto - 10]);
      else {
        const d = Math.floor(resto / 10);
        const u = resto % 10;
        partes.push(u === 0 ? DEZENAS[d] : DEZENAS[d] + " e " + UNIDADES[u]);
      }
    }
    return partes.join(" e ");
  }

  function grupoComEscala(n, singular, plural) {
    if (n === 1) return "um " + singular;
    return trescentos(n) + " " + plural;
  }

  function inteiroPorExtenso(n) {
    if (n === 0) return "zero";

    const milhoes = Math.floor(n / 1000000);
    const milhares = Math.floor((n % 1000000) / 1000);
    const centenas = n % 1000;

    const partes = [];
    if (milhoes > 0) partes.push(grupoComEscala(milhoes, "milhão", "milhões"));
    if (milhares > 0) {
      partes.push(milhares === 1 ? "mil" : trescentos(milhares) + " mil");
    }
    if (centenas > 0) partes.push(trescentos(centenas));

    if (partes.length === 1) return partes[0];

    const ultimo = partes[partes.length - 1];
    const resto = partes.slice(0, -1);
    return resto.join(", ") + " e " + ultimo;
  }

  const valorArred = Math.round(valor * 100) / 100;
  const inteiro = Math.floor(valorArred);
  const centavos = Math.round((valorArred - inteiro) * 100);

  // "um milhão de reais" / "dois milhões de reais" (com "de") quando o
  // valor é um múltiplo exato de milhão, sem milhares/centenas depois
  const ehMultiploDeMilhao = inteiro >= 1000000 && inteiro % 1000000 === 0;

  let reaisTexto;
  if (inteiro === 1) {
    reaisTexto = "um real";
  } else if (ehMultiploDeMilhao) {
    reaisTexto = inteiroPorExtenso(inteiro) + " de reais";
  } else {
    reaisTexto = inteiroPorExtenso(inteiro) + " reais";
  }

  if (centavos === 0) return reaisTexto;

  const centavosTexto = centavos === 1 ? "um centavo" : inteiroPorExtenso(centavos) + " centavos";
  return reaisTexto + " e " + centavosTexto;
}

// Conta os dias úteis (segunda a sexta, sem sábado/domingo) de um mês
// no formato "Mmm/AAAA". Usado quando o Tipo de Cálculo de uma
// vantagem sem fórmula pronta é "Dias Úteis".
function diasUteisNoMes(mesRef) {
  if (!mesRef || !mesRef.includes("/")) return 0;
  const [mesAbrev, anoTexto] = mesRef.split("/");
  const mesNumero = MESES_ABREV[mesAbrev];
  const ano = Number(anoTexto);
  if (!mesNumero || !ano || anoTexto.length < 4) return 0;

  const totalDiasMes = diasNoMes(mesRef);
  let uteis = 0;
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const diaSemana = new Date(ano, mesNumero - 1, dia).getDay(); // 0=domingo, 6=sábado
    if (diaSemana !== 0 && diaSemana !== 6) uteis++;
  }
  return uteis;
}

// Conta os dias úteis (segunda a sexta) entre duas datas "DD/MM/AAAA"
// (inclusive). Retorna null se as datas estiverem incompletas/inválidas.
function diasUteisEntreDatas(dataInicialTexto, dataFinalTexto) {
  const dataInicial = parseDataBR(dataInicialTexto);
  const dataFinal = parseDataBR(dataFinalTexto);
  if (!dataInicial || !dataFinal || dataFinal < dataInicial) return null;

  let uteis = 0;
  let cursor = new Date(dataInicial);
  while (cursor <= dataFinal) {
    const diaSemana = cursor.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) uteis++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return uteis;
}
