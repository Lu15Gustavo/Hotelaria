import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [hospedes, setHospedes] = useState([]);
  const [form, setForm] = useState({ cpf: '', nome: '', telefone: '', email: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/hospedes')
      .then(res => setHospedes(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/hospedes', form)
      .then(() => {
        setForm({ cpf: '', nome: '', telefone: '', email: '' });
        return axios.get('http://localhost:5000/hospedes');
      })
      .then(res => setHospedes(res.data));
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Hóspedes</h1>
      <form onSubmit={handleSubmit}>
        <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {hospedes.map(h => (
          <li key={h.cpf}>{h.nome} - {h.cpf} - {h.telefone} - {h.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
