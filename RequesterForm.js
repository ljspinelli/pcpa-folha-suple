const { useState } = React;

function RequesterForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    cargo: "",
    protocolo: "",
    interessado: "",
    assunto: ""
  });

  function atualizar(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      {Object.keys(form).map((campo, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <label>{campo.toUpperCase()}:</label><br />
          <input
            name={campo}
            value={form[campo]}
            onChange={atualizar}
            style={{ width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
}
