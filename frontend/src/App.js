import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('hospedes');
  const [hospedes, setHospedes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [hospedeForm, setHospedeForm] = useState({ cpf: '', nome: '', telefone: '', email: '' });
  const [quartoForm, setQuartoForm] = useState({ numero: '', tipo: '', capacidade: '', valor_diaria: '', status: 'Livre' });
  const [funcionarioForm, setFuncionarioForm] = useState({ nome: '', cargo: '', cpf: '' });
  const [reservaForm, setReservaForm] = useState({ cpf_hospede: '', id_quarto: '', id_funcionario: '', data_checkin: '', data_checkout: '', status: 'Confirmada', valor_total: '' });
  const [servicoForm, setServicoForm] = useState({ id_reserva: '', id_funcionario: '', valor_unitario: '', categoria: '', quantidade: 1 });
  const [pagamentoForm, setPagamentoForm] = useState({ id_reserva: '', data_pagamento: '', valor: '', forma_pagamento: 'Cartão de Crédito', status: 'Pago' });

  // Estados para Busca e Detalhes
  const [searchHospede, setSearchHospede] = useState('');
  const [searchQuarto, setSearchQuarto] = useState('');
  const [searchReserva, setSearchReserva] = useState('');
  const [selectedHospede, setSelectedHospede] = useState(null);
  const [selectedQuarto, setSelectedQuarto] = useState(null);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedPagamento, setSelectedPagamento] = useState(null);
  const [detailsHospede, setDetailsHospede] = useState(null);
  const [detailsQuarto, setDetailsQuarto] = useState(null);
  const [detailsReserva, setDetailsReserva] = useState(null);
  const [detailsPagamento, setDetailsPagamento] = useState(null);

  const api = axios.create({ baseURL: 'http://localhost:5000' });

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('pt-BR');
  };

  const formatMoney = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return '0.00';
    return numericValue.toFixed(2);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    api.get('/hospedes').then(res => setHospedes(res.data)).catch(err => console.error(err));
    api.get('/quartos').then(res => setQuartos(res.data)).catch(err => console.error(err));
    api.get('/funcionarios').then(res => setFuncionarios(res.data)).catch(err => console.error(err));
    api.get('/reservas').then(res => setReservas(res.data)).catch(err => console.error(err));
    api.get('/pagamentos').then(res => setPagamentos(res.data)).catch(err => console.error(err));
    api.get('/servicos').then(res => setServicos(res.data)).catch(err => console.error(err));
  };

  // Funções de Busca
  const searchHospedes = async () => {
    if (!searchHospede.trim()) { loadAll(); return; }
    try {
      const res = await api.get(`/hospedes/buscar/${searchHospede}`);
      setHospedes(res.data);
    } catch (err) {
      alert('Erro ao buscar');
    }
  };

  const searchQuartos = async () => {
    if (!searchQuarto.trim()) { loadAll(); return; }
    try {
      const res = await api.get(`/quartos/buscar/${searchQuarto}`);
      setQuartos(res.data);
    } catch (err) {
      alert('Erro ao buscar');
    }
  };

  const searchReservas = async () => {
    if (!searchReserva.trim()) { loadAll(); return; }
    try {
      const res = await api.get(`/reservas/buscar/${searchReserva}`);
      setReservas(res.data);
    } catch (err) {
      alert('Erro ao buscar');
    }
  };

  // Funções de Detalhes
  const loadHospedeDetails = async (cpf) => {
    try {
      const res = await api.get(`/hospedes/${cpf}/detalhes`);
      setSelectedHospede(cpf);
      setDetailsHospede(res.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao carregar detalhes';
      alert(msg);
    }
  };

  const loadQuartoDetails = async (id) => {
    try {
      const res = await api.get(`/quartos/${id}/detalhes`);
      setSelectedQuarto(id);
      setDetailsQuarto(res.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao carregar detalhes';
      alert(msg);
    }
  };

  const loadReservaDetails = async (id) => {
    try {
      const res = await api.get(`/reservas/${id}/detalhes`);
      setSelectedReserva(id);
      setDetailsReserva(res.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao carregar detalhes';
      alert(msg);
    }
  };

  const loadPagamentoDetails = async (id) => {
    try {
      const res = await api.get(`/pagamentos/${id}/detalhes`);
      setSelectedPagamento(id);
      setDetailsPagamento(res.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao carregar detalhes';
      alert(msg);
    }
  };

  const addHospede = async () => {
    if (!hospedeForm.cpf || !hospedeForm.nome) { alert('Preencha CPF e Nome'); return; }
    try { await api.post('/hospedes', hospedeForm); setHospedeForm({ cpf: '', nome: '', telefone: '', email: '' }); loadAll(); } catch (err) { alert('Erro ao adicionar'); }
  };

  const deleteHospede = async (cpf) => {
    try { await api.delete(`/hospedes/${cpf}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  const addQuarto = async () => {
    if (!quartoForm.numero || !quartoForm.tipo) { alert('Preencha Número e Tipo'); return; }
    try { await api.post('/quartos', quartoForm); setQuartoForm({ numero: '', tipo: '', capacidade: '', valor_diaria: '', status: 'Livre' }); loadAll(); } catch (err) { alert('Erro ao adicionar'); }
  };

  const deleteQuarto = async (id) => {
    try { await api.delete(`/quartos/${id}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  const addFuncionario = async () => {
    if (!funcionarioForm.nome || !funcionarioForm.cargo) { alert('Preencha Nome e Cargo'); return; }
    try { await api.post('/funcionarios', funcionarioForm); setFuncionarioForm({ nome: '', cargo: '', cpf: '' }); loadAll(); } catch (err) { alert('Erro ao adicionar'); }
  };

  const deleteFuncionario = async (id) => {
    try { await api.delete(`/funcionarios/${id}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  const addReserva = async () => {
    if (!reservaForm.cpf_hospede || !reservaForm.id_quarto || !reservaForm.data_checkin || !reservaForm.data_checkout) {
      alert('Preencha CPF, ID do Quarto, Check-in e Check-out');
      return;
    }

    const cpfHospede = reservaForm.cpf_hospede.trim();
    const quartoId = Number(reservaForm.id_quarto);
    const funcionarioId = reservaForm.id_funcionario ? Number(reservaForm.id_funcionario) : null;

    const hospedeExiste = hospedes.some(h => h.cpf === cpfHospede);
    if (!hospedeExiste) {
      alert('CPF do hóspede não encontrado. Cadastre o hóspede primeiro ou selecione um CPF válido.');
      return;
    }

    const quartoExiste = quartos.some(q => Number(q.id_quarto) === quartoId);
    if (!quartoExiste) {
      alert('ID do quarto não encontrado.');
      return;
    }

    if (funcionarioId !== null) {
      const funcionarioExiste = funcionarios.some(f => Number(f.id_funcionario) === funcionarioId);
      if (!funcionarioExiste) {
        alert('Funcionário selecionado não existe.');
        return;
      }
    }

    if (new Date(reservaForm.data_checkout) < new Date(reservaForm.data_checkin)) {
      alert('A data de check-out não pode ser menor que a data de check-in');
      return;
    }

    const payload = {
      cpf_hospede: cpfHospede,
      id_quarto: quartoId,
      id_funcionario: funcionarioId,
      data_checkin: reservaForm.data_checkin,
      data_checkout: reservaForm.data_checkout,
      status: reservaForm.status || 'Confirmada',
      valor_total: reservaForm.valor_total ? Number(reservaForm.valor_total) : null
    };

    try {
      await api.post('/reservas', payload);
      setReservaForm({ cpf_hospede: '', id_quarto: '', id_funcionario: '', data_checkin: '', data_checkout: '', status: 'Confirmada', valor_total: '' });
      loadAll();
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao adicionar reserva';
      alert(msg);
    }
  };

  const deleteReserva = async (id) => {
    try { await api.delete(`/reservas/${id}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  const addServico = async () => {
    if (!servicoForm.id_reserva || !servicoForm.id_funcionario || !servicoForm.valor_unitario || !servicoForm.categoria) { alert('Preencha todos os campos'); return; }
    try { await api.post('/servicos', servicoForm); setServicoForm({ id_reserva: '', id_funcionario: '', valor_unitario: '', categoria: '', quantidade: 1 }); loadAll(); } catch (err) { alert('Erro ao adicionar'); }
  };

  const deleteServico = async (id) => {
    try { await api.delete(`/servicos/${id}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  const addPagamento = async () => {
    if (!pagamentoForm.id_reserva || !pagamentoForm.valor) { alert('Preencha ID e Valor'); return; }
    try { await api.post('/pagamentos', pagamentoForm); setPagamentoForm({ id_reserva: '', data_pagamento: '', valor: '', forma_pagamento: 'Cartão de Crédito', status: 'Pago' }); loadAll(); } catch (err) { alert('Erro ao adicionar'); }
  };

  const deletePagamento = async (id) => {
    try { await api.delete(`/pagamentos/${id}`); loadAll(); } catch (err) { alert('Erro ao deletar'); }
  };

  return (
    <div className="app">
      <header className="header"><h1>🏨 Sistema Hotelaria</h1></header>
      <nav className="tabs">
        {['hospedes', 'quartos', 'funcionarios', 'reservas', 'servicos', 'pagamentos'].map(tab => (
          <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
      <main className="content">
        {activeTab === 'hospedes' && (<section>
          <h2>Hóspedes</h2>
          <div className="form-container">
            <input type="text" placeholder="CPF" value={hospedeForm.cpf} onChange={e => setHospedeForm({ ...hospedeForm, cpf: e.target.value })} />
            <input type="text" placeholder="Nome" value={hospedeForm.nome} onChange={e => setHospedeForm({ ...hospedeForm, nome: e.target.value })} />
            <input type="text" placeholder="Telefone" value={hospedeForm.telefone} onChange={e => setHospedeForm({ ...hospedeForm, telefone: e.target.value })} />
            <input type="email" placeholder="Email" value={hospedeForm.email} onChange={e => setHospedeForm({ ...hospedeForm, email: e.target.value })} />
            <button onClick={addHospede}>Adicionar</button>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Buscar por nome..." value={searchHospede} onChange={e => setSearchHospede(e.target.value)} onKeyPress={e => e.key === 'Enter' && searchHospedes()} />
            <button onClick={searchHospedes}>Buscar</button>
            <button onClick={() => { setSearchHospede(''); loadAll(); }}>Limpar</button>
          </div>
          {selectedHospede && detailsHospede && (
            <div className="details-container">
              <button className="close-details" onClick={() => { setSelectedHospede(null); setDetailsHospede(null); }}>✕</button>
              <div className="details-content">
                <h3>Detalhes de {detailsHospede.hospede?.nome}</h3>
                <div className="detail-info">
                  <p><strong>CPF:</strong> {detailsHospede.hospede?.cpf}</p>
                  <p><strong>Telefone:</strong> {detailsHospede.hospede?.telefone}</p>
                  <p><strong>Email:</strong> {detailsHospede.hospede?.email}</p>
                  <hr />
                  <h4>Reservas:</h4>
                  {detailsHospede.reservas && detailsHospede.reservas.length > 0 ? (
                    <ul className="related-list">
                      {detailsHospede.reservas.map(r => (
                        <li key={r.id_reserva}>
                          <strong>Quarto {r.numero}</strong> ({r.tipo})<br />
                          {formatDate(r.data_checkin)} → {formatDate(r.data_checkout)}<br />
                          Status: <span className={`status-${r.status.toLowerCase()}`}>{r.status}</span> | R$ {r.valor_total}
                        </li>
                      ))}
                    </ul>
                  ) : <p><em>Sem reservas</em></p>}
                </div>
              </div>
            </div>
          )}
          <ul className="list">
            {hospedes.map(h => (<li key={h.cpf} className="list-item list-clickable" onClick={() => loadHospedeDetails(h.cpf)}>
              <div className="item-info"><strong>{h.nome}</strong> - {h.cpf}<br /><small>{h.telefone} | {h.email}</small></div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteHospede(h.cpf); }}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
        {activeTab === 'quartos' && (<section>
          <h2>Quartos</h2>
          <div className="form-container">
            <input type="number" placeholder="Número" value={quartoForm.numero} onChange={e => setQuartoForm({ ...quartoForm, numero: e.target.value })} />
            <input type="text" placeholder="Tipo" value={quartoForm.tipo} onChange={e => setQuartoForm({ ...quartoForm, tipo: e.target.value })} />
            <input type="number" placeholder="Capacidade" value={quartoForm.capacidade} onChange={e => setQuartoForm({ ...quartoForm, capacidade: e.target.value })} />
            <input type="number" placeholder="Valor Diária" value={quartoForm.valor_diaria} onChange={e => setQuartoForm({ ...quartoForm, valor_diaria: e.target.value })} />
            <select value={quartoForm.status} onChange={e => setQuartoForm({ ...quartoForm, status: e.target.value })}><option>Livre</option><option>Ocupado</option></select>
            <button onClick={addQuarto}>Adicionar</button>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Buscar por número..." value={searchQuarto} onChange={e => setSearchQuarto(e.target.value)} onKeyPress={e => e.key === 'Enter' && searchQuartos()} />
            <button onClick={searchQuartos}>Buscar</button>
            <button onClick={() => { setSearchQuarto(''); loadAll(); }}>Limpar</button>
          </div>
          {selectedQuarto && detailsQuarto && (
            <div className="details-container">
              <button className="close-details" onClick={() => { setSelectedQuarto(null); setDetailsQuarto(null); }}>✕</button>
              <div className="details-content">
                <h3>Detalhes do Quarto {detailsQuarto.quarto?.numero}</h3>
                <div className="detail-info">
                  <p><strong>Tipo:</strong> {detailsQuarto.quarto?.tipo}</p>
                  <p><strong>Capacidade:</strong> {detailsQuarto.quarto?.capacidade} pessoas</p>
                  <p><strong>Valor/Diária:</strong> R$ {detailsQuarto.quarto?.valor_diaria}</p>
                  <p><strong>Status:</strong> <span className={`status-${detailsQuarto.quarto?.status.toLowerCase()}`}>{detailsQuarto.quarto?.status}</span></p>
                  <hr />
                  <h4>Quem está hospedado:</h4>
                  {detailsQuarto.quarto?.status === 'Livre' || !(detailsQuarto.reservas && detailsQuarto.reservas.length > 0) ? (
                    <p><em>Ninguém hospedado no momento</em></p>
                  ) : (
                    <ul className="related-list">
                      {detailsQuarto.reservas.map(r => (
                        <li key={r.id_reserva}>
                          <strong>{r.nome}</strong><br />
                          {formatDate(r.data_checkin)} → {formatDate(r.data_checkout)}<br />
                          Status: {r.status} | R$ {r.valor_total}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
          <ul className="list">
            {quartos.map(q => (<li key={q.id_quarto} className="list-item list-clickable" onClick={() => loadQuartoDetails(q.id_quarto)}>
              <div className="item-info"><strong>Quarto {q.numero}</strong> - {q.tipo}<br /><small>Cap: {q.capacidade} | R$ {q.valor_diaria}/dia | {q.status}</small></div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteQuarto(q.id_quarto); }}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
        {activeTab === 'funcionarios' && (<section>
          <h2>Funcionários</h2>
          <div className="form-container">
            <input type="text" placeholder="Nome" value={funcionarioForm.nome} onChange={e => setFuncionarioForm({ ...funcionarioForm, nome: e.target.value })} />
            <input type="text" placeholder="Cargo" value={funcionarioForm.cargo} onChange={e => setFuncionarioForm({ ...funcionarioForm, cargo: e.target.value })} />
            <input type="text" placeholder="CPF" value={funcionarioForm.cpf} onChange={e => setFuncionarioForm({ ...funcionarioForm, cpf: e.target.value })} />
            <button onClick={addFuncionario}>Adicionar</button>
          </div>
          <ul className="list">
            {funcionarios.map(f => (<li key={f.id_funcionario} className="list-item">
              <div className="item-info"><strong>{f.nome}</strong> - {f.cargo}<br /><small>CPF: {f.cpf}</small></div>
              <button className="delete-btn" onClick={() => deleteFuncionario(f.id_funcionario)}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
        {activeTab === 'reservas' && (<section>
          <h2>Reservas</h2>
          <div className="form-container">
            <input type="text" placeholder="CPF" value={reservaForm.cpf_hospede} onChange={e => setReservaForm({ ...reservaForm, cpf_hospede: e.target.value })} />
            <input type="number" placeholder="ID Quarto" value={reservaForm.id_quarto} onChange={e => setReservaForm({ ...reservaForm, id_quarto: e.target.value })} />
            <input type="date" value={reservaForm.data_checkin} onChange={e => setReservaForm({ ...reservaForm, data_checkin: e.target.value })} />
            <input type="date" value={reservaForm.data_checkout} onChange={e => setReservaForm({ ...reservaForm, data_checkout: e.target.value })} />
            <input type="number" placeholder="Valor Total" value={reservaForm.valor_total} onChange={e => setReservaForm({ ...reservaForm, valor_total: e.target.value })} />
            <select value={reservaForm.status} onChange={e => setReservaForm({ ...reservaForm, status: e.target.value })}><option>Confirmada</option><option>Cancelada</option><option>Finalizada</option></select>
            <select value={reservaForm.id_funcionario} onChange={e => setReservaForm({ ...reservaForm, id_funcionario: e.target.value })}>
              <option value="">Selecionar Funcionário</option>
              {funcionarios.map(f => (<option key={f.id_funcionario} value={f.id_funcionario}>{f.nome} ({f.cargo})</option>))}
            </select>
            <button onClick={addReserva}>Adicionar</button>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Buscar por ID, CPF ou Nome..." value={searchReserva} onChange={e => setSearchReserva(e.target.value)} onKeyPress={e => e.key === 'Enter' && searchReservas()} />
            <button onClick={searchReservas}>Buscar</button>
            <button onClick={() => { setSearchReserva(''); loadAll(); }}>Limpar</button>
          </div>
          {selectedReserva && detailsReserva && (
            <div className="details-container">
              <button className="close-details" onClick={() => { setSelectedReserva(null); setDetailsReserva(null); }}>✕</button>
              <div className="details-content">
                <h3>Detalhes da Reserva #{detailsReserva.reserva?.id_reserva}</h3>
                <div className="detail-info">
                  <h4>Hóspede:</h4>
                  <p><strong>{detailsReserva.reserva?.hospede_nome}</strong><br />
                     CPF: {detailsReserva.reserva?.cpf_hospede}<br />
                     Email: {detailsReserva.reserva?.email}<br />
                     Telefone: {detailsReserva.reserva?.telefone}</p>
                  <hr />
                  <h4>Quarto:</h4>
                  <p><strong>Quarto {detailsReserva.reserva?.quarto_numero}</strong> ({detailsReserva.reserva?.quarto_tipo})</p>
                  <hr />
                  <h4>Funcionário (Responsável):</h4>
                  <p><strong>{detailsReserva.reserva?.funcionario_nome || 'Não atribuído'}</strong> {detailsReserva.reserva?.cargo && `(${detailsReserva.reserva?.cargo})`}</p>
                  <hr />
                  <h4>Período:</h4>
                  <p>{formatDate(detailsReserva.reserva?.data_checkin)} → {formatDate(detailsReserva.reserva?.data_checkout)}</p>
                  <p><strong>Status:</strong> <span className={`status-${detailsReserva.reserva?.status.toLowerCase()}`}>{detailsReserva.reserva?.status}</span></p>
                  <p><strong>Valor Total:</strong> R$ {detailsReserva.reserva?.valor_total}</p>
                  <hr />
                  <h4>Pagamentos:</h4>
                  {detailsReserva.pagamentos && detailsReserva.pagamentos.length > 0 ? (
                    <ul className="related-list">
                      {detailsReserva.pagamentos.map(p => (
                        <li key={p.id_pagamento}>
                          {formatDate(p.data_pagamento)} | R$ {p.valor} | {p.forma_pagamento}<br />
                          <span className={`status-${p.status.toLowerCase()}`}>{p.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p><em>Sem pagamentos registrados</em></p>}
                  <hr />
                  <h4>Serviços Adicionais:</h4>
                  {detailsReserva.servicos && detailsReserva.servicos.length > 0 ? (
                    <ul className="related-list">
                      {detailsReserva.servicos.map(s => (
                        <li key={s.id_servico}>
                          <strong>{s.categoria}</strong> | Qtd: {s.quantidade} | R$ {formatMoney(s.valor_total ?? (Number(s.quantidade) * Number(s.valor_unitario)))}<br />
                          <small>Valor unitário: R$ {s.valor_unitario} | Funcionário: {s.funcionario_nome || 'Desconhecido'}</small>
                        </li>
                      ))}
                    </ul>
                  ) : <p><em>Sem serviços adicionais</em></p>}
                </div>
              </div>
            </div>
          )}
          <ul className="list">
            {reservas.map(r => (<li key={r.id_reserva} className="list-item list-clickable" onClick={() => loadReservaDetails(r.id_reserva)}>
              <div className="item-info"><strong>Reserva #{r.id_reserva}</strong><br /><small>{r.cpf_hospede} | Quarto {r.id_quarto} {r.funcionario_nome && `| ${r.funcionario_nome}`}</small><br /><small>{formatDate(r.data_checkin)} até {formatDate(r.data_checkout)} | R$ {r.valor_total} | {r.status}</small></div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteReserva(r.id_reserva); }}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
        {activeTab === 'servicos' && (<section>
          <h2>Serviços</h2>
          <div className="form-container">
            <select value={servicoForm.id_reserva} onChange={e => setServicoForm({ ...servicoForm, id_reserva: e.target.value })}>
              <option value="">Selecionar Reserva</option>
              {reservas.map(r => (<option key={r.id_reserva} value={r.id_reserva}>Reserva #{r.id_reserva} - {r.cpf_hospede}</option>))}
            </select>
            <select value={servicoForm.id_funcionario} onChange={e => setServicoForm({ ...servicoForm, id_funcionario: e.target.value })}>
              <option value="">Selecionar Funcionário</option>
              {funcionarios.map(f => (<option key={f.id_funcionario} value={f.id_funcionario}>{f.nome} ({f.cargo})</option>))}
            </select>
            <input type="text" placeholder="Categoria" value={servicoForm.categoria} onChange={e => setServicoForm({ ...servicoForm, categoria: e.target.value })} />
            <input type="number" placeholder="Valor Unitário" step="0.01" value={servicoForm.valor_unitario} onChange={e => setServicoForm({ ...servicoForm, valor_unitario: e.target.value })} />
            <input type="number" placeholder="Quantidade" min="1" value={servicoForm.quantidade} onChange={e => setServicoForm({ ...servicoForm, quantidade: e.target.value })} />
            <button onClick={addServico}>Adicionar</button>
          </div>
          <ul className="list">
            {servicos.map(s => (<li key={s.id_servico} className="list-item">
              <div className="item-info"><strong>{s.categoria}</strong> (Reserva #{s.id_reserva}) - <small>{funcionarios.find(f => f.id_funcionario === s.id_funcionario)?.nome || 'Desconhecido'}</small><br /><small>R$ {s.valor_unitario} × {s.quantidade} = R$ {formatMoney(Number(s.quantidade) * Number(s.valor_unitario))}</small></div>
              <button className="delete-btn" onClick={() => deleteServico(s.id_servico)}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
        {activeTab === 'pagamentos' && (<section>
          <h2>Pagamentos</h2>
          <div className="form-container">
            <input type="number" placeholder="ID Reserva" value={pagamentoForm.id_reserva} onChange={e => setPagamentoForm({ ...pagamentoForm, id_reserva: e.target.value })} />
            <input type="date" value={pagamentoForm.data_pagamento} onChange={e => setPagamentoForm({ ...pagamentoForm, data_pagamento: e.target.value })} />
            <input type="number" placeholder="Valor" value={pagamentoForm.valor} onChange={e => setPagamentoForm({ ...pagamentoForm, valor: e.target.value })} />
            <select value={pagamentoForm.forma_pagamento} onChange={e => setPagamentoForm({ ...pagamentoForm, forma_pagamento: e.target.value })}><option>Cartão de Crédito</option><option>Cartão de Débito</option><option>Dinheiro</option><option>Pix</option></select>
            <select value={pagamentoForm.status} onChange={e => setPagamentoForm({ ...pagamentoForm, status: e.target.value })}><option>Pago</option><option>Pendente</option><option>Cancelado</option></select>
            <button onClick={addPagamento}>Adicionar</button>
          </div>
          {selectedPagamento && detailsPagamento && (
            <div className="details-container">
              <button className="close-details" onClick={() => { setSelectedPagamento(null); setDetailsPagamento(null); }}>✕</button>
              <div className="details-content">
                <h3>Detalhes do Pagamento #{detailsPagamento.id_pagamento}</h3>
                <div className="detail-info">
                  <h4>Reserva:</h4>
                  <p><strong>Reserva #{detailsPagamento.id_reserva}</strong></p>
                  <hr />
                  <h4>Hóspede:</h4>
                  <p><strong>{detailsPagamento.hospede_nome}</strong><br />
                     Quarto {detailsPagamento.quarto_numero}</p>
                  <hr />
                  <h4>Pagamento:</h4>
                  <p><strong>Valor:</strong> R$ {detailsPagamento.valor}</p>
                  <p><strong>Data:</strong> {formatDate(detailsPagamento.data_pagamento)}</p>
                  <p><strong>Forma:</strong> {detailsPagamento.forma_pagamento}</p>
                  <p><strong>Status:</strong> <span className={`status-${detailsPagamento.status.toLowerCase()}`}>{detailsPagamento.status}</span></p>
                  <hr />
                  <h4>Período da Reserva:</h4>
                  <p>{formatDate(detailsPagamento.data_checkin)} → {formatDate(detailsPagamento.data_checkout)}</p>
                </div>
              </div>
            </div>
          )}
          <ul className="list">
            {pagamentos.map(p => (<li key={p.id_pagamento} className="list-item list-clickable" onClick={() => loadPagamentoDetails(p.id_pagamento)}>
              <div className="item-info"><strong>Pagamento #{p.id_pagamento}</strong><br /><small>Reserva {p.id_reserva} | R$ {p.valor}</small><br /><small>{formatDate(p.data_pagamento)} | {p.forma_pagamento} | {p.status}</small></div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deletePagamento(p.id_pagamento); }}>Deletar</button>
            </li>))}
          </ul>
        </section>)}
      </main>
    </div>
  );
}

export default App;
