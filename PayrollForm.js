// Lista de rubricas
const rubricas = [
  "0100 - Vencimento Cargo Comissionado",
  "0191 - Vencisao Judicial SISPEMB",
  "0168 - Abono Complementar Salario Minimo",
  "0274 - Grat Magistério_Vantagem Pessoal Nominalmente Identificada",
  "0109 - Salário Familia Temp/Com",
  "0119 - Abono Salarial",
  "0148 - Salário Maternidade",
  "0056 - Adicional de Curso de Especialização",
  "0209 - Complementação Pecuniária",
  "0219 - Grat. Exerc. de Atividade de Direção de Polícia Judiciária",
  "0186 - Gratificação de Atividade Aerea",
  "0122 - Gratificação de Motorista",
  "0052 - Gratificação de Localidade Especial",
  "0070 - Gratificação de Polícia Judiciária",
  "0040 - Gratificação de Risco de Vida",
  "0031 - Gratificação de Titularidade",
  "0029 - Gratificação Dedicação Exclusiva",
  "0185 - Gratificacao pela Escolaridade DJ",
  "0295 - ATS da Gratificacao da Substituicao do Titular",
  "0291 - Gratificação de Representação Lei 9853/2023",
  "0023 - Gratificação pelo Exercício da Função",
  "0001 - Vencimento Base",
  "0099 - Vencimento Decisão Judicial (Delegado)",
  "0047 - Adicional de Insalubridade",
  "0016 - Adicional pelo Exercício de Cargo em Comissão",
  "0079 - Adicional pelo Exercício de Função Gratificada",
  "0080 - Adicional por Tempo de Serviço",
  "0054 - Gratificação pela Escolaridade",
  "0028 - Gratificação Tempo Integral",
  "0110 - Salário Familia Estatutário",
  "0217 - Auxílio Bolsa de Formação",
  "0124 - Gratificação de Plantão",
  "0210 - Premiação Pecuniária Civil",
  "0101 - Grat Participação Órgão Colegiado",
  "0279 - Gratificação pela Substituição do Titular",
  "0218 - Gratificação por Acúmulo de Titularidade",
  "0136 - Abono Extraordinario",
  "0294 - Gratificacao da Substituicao do Titular",
  "0146 - Abono de Permanência",
  "0114 - Adicional de Férias-Estatutários",
  "1010 - Ajuda de Custo Lei Estadual 10.498/24",
  "0165 - Auxílio Alimentação",
  "0132 - Auxilio Natalidade",
  "0127 - Auxílio Transporte"
];

// Meses válidos
const mesesValidos = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

// Formatar moeda brasileira a partir de dígitos
function formatarMoeda(valor) {
  const num = Number(valor.replace(/\D/g, "")) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// Formatar mês de referência com validação
function formatarMesRef(texto) {
  texto = texto.replace(/\s+/g, "");

  let letras = texto.replace(/[^A-Za-z]/g, "").slice(0, 3);
  if (letras.length > 0) {
    letras = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
  }

  if (letras.length === 3 && !mesesValidos.includes(letras)) {
    return "";
  }

  let ano = texto.replace(/\D/g, "").slice(0, 4);

  if (letras.length === 3) {
    return ano.length > 0 ? `${letras}/${ano}` : `${letras}/`;
  }

  return letras;
}

function PayrollForm({ onTotalChange }) {
  const [rubricaSelecionada, setRubricaSelecionada] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [mesRef, setMesRef] = React.useState("");
  const [vantagens, setVantagens] = React.useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = React.useState(null);

  function inserir() {
    if (!rubricaSelecionada || !valor || !mesRef) return;

    const item = {
      rubrica: rubricaSelecionada,
      mesRef,
      valor: formatarMoeda(valor)
    };

    if (linhaSelecionada !== null) {
      const nova = [...vantagens];
      nova[linhaSelecionada] = item;
      setVantagens(nova);
    } else {
      setVantagens(prev => [...prev, item]);
    }

    setRubricaSelecionada("");
    setValor("");
    setMesRef("");
    setLinhaSelecionada(null);
  }

  function editar() {
    if (linhaSelecionada === null) return;
    const item = vantagens[linhaSelecionada];
    setRubricaSelecionada(item.rubrica);
    setValor(item.valor);
    setMesRef(item.mesRef);
  }

  function excluir() {
    if (linhaSelecionada === null) return;
    setVantagens(vantagens.filter((_, i) => i !== linhaSelecionada));
    setLinhaSelecionada(null);
  }

  // Total como número real
  const total = vantagens.reduce((acc, item) => {
    const v = Number(item.valor.replace(/\./g, "").replace(",", "."));
    return acc + v;
  }, 0);

  // Enviar total para o App.js
  React.useEffect(() => {
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [total]);

  return (
    <div>
      {/* ... resto do JSX ... */}
    </div>
  );
}
