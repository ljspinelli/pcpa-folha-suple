// ============================
// CONSTANTES - RUBRICAS E BASES
// ============================

// Lista única de rubricas para lançamento de valores (sem abas —
// o mesmo valor digitado aqui alimenta todas as "Bases" calculadas
// abaixo, cada uma somando um subconjunto específico de códigos).
const RUBRICAS_FIXAS = [
  { codigo: "0001", nome: "Vencimento Base" },
  { codigo: "0016", nome: "Adicional pelo Exercício de Cargo em Comissão" },
  { codigo: "0023", nome: "Gratificação pelo Exercício da Função" },
  { codigo: "0028", nome: "Gratificação Tempo Integral" },
  { codigo: "0029", nome: "Gratificação Dedicação Exclusiva" },
  { codigo: "0031", nome: "Gratificação de Titularidade" },
  { codigo: "0040", nome: "Gratificação de Risco de Vida" },
  { codigo: "0047", nome: "Adicional de Insalubridade" },
  { codigo: "0052", nome: "Gratificação de Localidade Especial" },
  { codigo: "0054", nome: "Gratificação pela Escolaridade" },
  { codigo: "0056", nome: "Adicional de Curso de Especialização" },
  { codigo: "0070", nome: "Gratificação de Polícia Judiciária" },
  { codigo: "0079", nome: "Adicional pelo Exercício de Função Gratificada" },
  { codigo: "0080", nome: "Adicional por Tempo de Serviço" },
  { codigo: "0099", nome: "Vencimento Decisão Judicial (Delegado)" },
  { codigo: "0100", nome: "Vencimento Cargo Comissionado" },
  { codigo: "0109", nome: "Salário Família Temp/Com" },
  { codigo: "0110", nome: "Salário Família Estatutário" },
  { codigo: "0119", nome: "Abono Salarial" },
  { codigo: "0122", nome: "Gratificação de Atividade de Motorista" },
  { codigo: "0136", nome: "Gratificação de Atividade de Motorista" },
  { codigo: "0146", nome: "Abono de Permanência" },
  { codigo: "0168", nome: "Abono Complementar Salário Mínimo" },
  { codigo: "0185", nome: "Gratificação pela Escolaridade DJ" },
  { codigo: "0186", nome: "Gratificação de Atividade Aérea" },
  { codigo: "0191", nome: "Vencimento Decisão Judicial SISPEMB" },
  { codigo: "0209", nome: "Complementação Pecuniária" },
  { codigo: "0218", nome: "Gratificação por Acúmulo de Titularidade" },
  { codigo: "0219", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
  { codigo: "0226", nome: "Grat. Exerc. de Atividade de Direção de Polícia Judiciária" },
  { codigo: "0274", nome: "Grat Magistério - Vantagem Pessoal Nominalmente Identificada" },
  { codigo: "0279", nome: "Gratificação pela Substituição do Titular" },
  { codigo: "0291", nome: "Gratificação de Representação Lei 9853/2023" },
  { codigo: "0294", nome: "Gratificação da Substituição do Titular" },
  { codigo: "0295", nome: "ATS da Gratificação da Substituição do Titular" }
];

// Cada "Valor Base X" soma só os códigos abaixo, todos vindos do
// mesmo RUBRICAS_FIXAS/valores digitados uma única vez.
const CODIGOS_BASE_DIAS = [
  "0001","0016","0023","0028","0029","0031","0040","0047","0052","0054",
  "0056","0070","0079","0080","0099","0100","0109","0110","0119","0122",
  "0168","0185","0186","0191","0209","0219","0274","0291","0295"
];

const CODIGOS_BASE_FERIAS = [
  "0001","0016","0023","0028","0029","0031","0040","0047","0052","0054",
  "0056","0070","0079","0080","0099","0100","0109","0110","0122",
  "0168","0185","0186","0191","0209","0219","0274","0291","0295"
];

const CODIGOS_BASE_DECIMO = [
  "0001","0016","0023","0028","0029","0031","0040","0047","0052","0054",
  "0056","0070","0079","0080","0099","0100","0109","0110","0119","0136",
  "0146","0168","0185","0186","0191","0209","0218","0219","0274","0279",
  "0291","0294","0295"
];

const CODIGOS_BASE_PECUNIA = [
  "0001","0016","0028","0029","0040","0054","0056","0070","0079","0080",
  "0099","0100","0168","0185","0209","0219","0274","0295"
];

const CODIGOS_BASE_AUXILIO_FUNERAL = [
  "0001","0016","0028","0029","0040","0047","0054","0056","0070","0079",
  "0080","0099","0100","0168","0185","0191","0209","0219","0274","0295"
];

const CODIGOS_BASE_ATS = [
  "0001","0016","0023","0028","0029","0031","0040","0047","0052","0054",
  "0056","0070","0079","0099","0100","0122","0168","0185","0186","0191",
  "0209","0218","0226","0274","0279","0291","0294"
];

const CODIGOS_BASE_AUXILIO_DOENCA = [
  "0001","0016","0028","0029","0040","0047","0054","0056","0070","0079",
  "0080","0099","0100","0168","0185","0191","0209","0219","0274","0295"
];


const CODIGOS_BASE_IR = [
  "0100","0191","0168","0274","0148","0056","0209","0219","0186","0122",
  "0052","0070","0040","0031","0029","0185","0295","0291","0023","0001",
  "0099","0047","0016","0079","0080","0054","0028","0124","0101","0279",
  "0218","0136","0294","0146","0114"
];

const CODIGOS_BASE_RPPS = [
  "0191","0168","0274","0148","0056","0209","0219","0122","0052","0070",
  "0040","0029","0185","0295","0023","0001","0099","0016","0079",
  "0080","0054","0028"
];

const CODIGOS_BASE_INSS = [
  "0100","0191","0168","0148","0295","0023","0001","0099","0016",
  "0079","0080"
];

const ABAS_INFO = [
  { id: "dias", label: "Dias Trabalhados" },
  { id: "ferias", label: "Férias Indenizadas" },
  { id: "decimo", label: "13º Salário" },
  { id: "pecunia", label: "Pecúnia" },
  { id: "auxilioFuneral", label: "Auxílio Funeral" },
  { id: "ats", label: "Adicional Tempo Serviço" },
  { id: "auxilioDoenca", label: "Auxílio Doença" }
];

const ESTILOS = {
  label: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#0B2B4A"
  },
  input: {
    width: "300px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#ffffff"
  },
  select: {
    width: "300px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#ffffff"
  },
  inputSomenteLeitura: {
    width: "300px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#f7f7f7"
  },
  inputDestaque: {
    width: "300px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "bold",
    color: "#0B2B4A",
    backgroundColor: "#e8f5e9"
  },
  inputTabela: {
    width: "180px",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    textAlign: "right"
  },
  containerPrincipal: {
    padding: "20px"
  },
  navAbas: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  botaoAba: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333"
  },
  botaoAbaAtivo: {
    padding: "8px 12px",
    border: "2px solid #0B2B4A",
    borderRadius: "4px",
    backgroundColor: "#0B2B4A",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff"
  },
  containerTabela: {
    background: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  },
  totalGeral: {
    marginTop: "20px",
    fontWeight: "bold",
    textAlign: "right",
    fontSize: "18px",
    padding: "10px",
    background: "#f7f7f7",
    borderRadius: "8px",
    border: "1px solid #e0e0e0"
  },
  baseCalculo: {
    marginTop: "10px",
    fontWeight: "bold",
    textAlign: "right"
  }
};
