import './style.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Importe os ícones

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Tarefa {
  id: string;
  data: string;
  titulo: string;
  inicio: string;
  termino: string;
  importancia: 'normal' | 'importante' | 'urgente';
  descricao: string;
}

export function Tela_inicial() {
  const [date, setDate] = useState<Value>(new Date());
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalListaAberto, setModalListaAberto] = useState(false);
  
  // Estado para controlar a tarefa que está sendo visualizada em detalhes
  const [tarefaParaDetalhes, setTarefaParaDetalhes] = useState<Tarefa | null>(null);

  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [importancia, setImportancia] = useState<'normal' | 'importante' | 'urgente'>('normal');
  const [descricao, setDescricao] = useState('');
  
  // Estado para saber qual tarefa estamos editando (se for null, é uma tarefa nova)
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<string | null>(null);

  // Função que o botão "Editar" vai chamar
  const iniciarEdicao = (tarefa: Tarefa) => {
    setTitulo(tarefa.titulo);
    setInicio(tarefa.inicio);
    setTermino(tarefa.termino);
    setImportancia(tarefa.importancia);
    setDescricao(tarefa.descricao);
    setTarefaEmEdicao(tarefa.id); // Avisa ao sistema o ID da tarefa
    
    setTarefaParaDetalhes(null); // 1. Fecha a janelinha de detalhes
    setModalListaAberto(false);
    setModalAberto(true);        // 2. Abre a janela do formulário para editar
  };

  const tarefasDoDiaSelecionado = date instanceof Date 
    ? tarefas.filter(t => t.data === date.toDateString()).sort((a, b) => a.inicio.localeCompare(b.inicio))
    : [];

  const verificarEabrirModal = () => {
    const dataDeHoje = new Date();
    dataDeHoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(date as Date);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada < dataDeHoje) {
      alert("Ops! Você não pode adicionar tarefas em dias que já passaram. ⏳");
    } else {
      setModalListaAberto(false);
      setModalAberto(true);
    }
  };

  const aoClicarNoDia = (dataClicada: Date) => {
    setDate(dataClicada);
    const tarefasNesteDia = tarefas.filter(t => t.data === dataClicada.toDateString());

    if (tarefasNesteDia.length > 0) {
      setModalListaAberto(true);
      setModalAberto(false);
    } else {
      setModalListaAberto(false);
      setModalAberto(false);
    }
  };

  const salvarTarefa = () => {
    if (!titulo) {
      alert("Por favor, dê um título para a tarefa!");
      return;
    }

    if (tarefaEmEdicao) {
      // MODO EDIÇÃO: Atualiza a tarefa que já existe
      const tarefasAtualizadas = tarefas.map(t => {
        if (t.id === tarefaEmEdicao) {
          return { ...t, titulo, inicio, termino, importancia, descricao };
        }
        return t;
      });
      setTarefas(tarefasAtualizadas);
      setTarefaEmEdicao(null); // Limpa o ID da memória
    } else {
      // MODO CRIAÇÃO: Adiciona uma nova tarefa do zero
      const novaTarefa: Tarefa = {
        id: Math.random().toString(),
        data: (date as Date).toDateString(),
        titulo,
        inicio,
        termino,
        importancia,
        descricao
      };
      setTarefas([...tarefas, novaTarefa]);
    }

    // Limpa os campos e fecha a janela
    setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
    setModalAberto(false);
  };

  const excluirTarefa = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTarefas(tarefas.filter(t => t.id !== id));
      setTarefaParaDetalhes(null); // Fecha a janela de detalhes após excluir
    }
  };

  const renderTileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const tarefasDoDia = tarefas.filter(t => t.data === date.toDateString());
      if (tarefasDoDia.length === 0) return null;

      const tarefasParaMostrar = tarefasDoDia.slice(0, 3);
      const tarefasEscondidas = tarefasDoDia.length - 3;

      return (
        <div className="container-indicadores">
          <div className="bolinhas-wrapper"> 
            {tarefasEscondidas > 0 && (
            <span className="contador-tarefas">+{tarefasEscondidas}</span>)}
            
           {tarefasParaMostrar.map(t => (
            <span key={t.id} className={`bolinha bolinha-${t.importancia}`} />
           ))}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <main className="conteudo-principal" style={{ marginTop: '-30px' }}>
        <div className="conteiner-calendario">
          <Calendar onChange={setDate} value={date} tileContent={renderTileContent} showFixedNumberOfWeeks={true} calendarType="iso8601" locale="pt-BR" onClickDay={aoClicarNoDia} prevLabel={<ChevronLeft size={24} color="#45B9FB" />}
  nextLabel={<ChevronRight size={24} color="#45B9FB" />} prev2Label={null}
  next2Label={null}/>
          
        </div>
      </main>

      <button className="botao-adicionar-tarefa" title="Adicionar Tarefa" onClick={verificarEabrirModal}>+</button>

      {/* 1. MODAL ADICIONAR / EDITAR */}
      {modalAberto && (
        <div className="modal-fundo">
          <div className="modal-caixa">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{tarefaEmEdicao ? "Editar Tarefa" : "Nova Tarefa"}</h2>
              <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                📅 {date instanceof Date ? date.toLocaleDateString('pt-BR') : ''}
              </span>
            </div>

            <div className="grupo-input">
              <label>Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div className="linha-horarios">
              <div className="grupo-input"><label>Início</label><input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
              <div className="grupo-input"><label>Fim</label><input type="time" value={termino} onChange={(e) => setTermino(e.target.value)} /></div>
            </div>
            <div className="grupo-input">
              <label>Prioridade</label>
              <select value={importancia} onChange={(e) => setImportancia(e.target.value as any)}>
                <option value="normal">Normal</option>
                <option value="importante">Importante</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="grupo-input"><label>Descrição</label><textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}></textarea></div>
            
            <div className="botoes-modal">
              <button className="botao-salvar" onClick={salvarTarefa}>Salvar</button>
              <button className="botao-cancelar" onClick={() => { 
                setModalAberto(false); 
                setTarefaEmEdicao(null); // Limpa a edição se cancelar
                setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL LISTA DO DIA */}
      {modalListaAberto && date instanceof Date && (
        <div className="modal-fundo">
          <div className="modal-caixa">
            <h3>Tarefas de {date.toLocaleDateString('pt-BR')}</h3>

            <div className="cards-tarefas">
              {tarefasDoDiaSelecionado.map(tarefa => (
                <div 
                  key={tarefa.id} 
                  className={`card-tarefa borda-${tarefa.importancia}`}
                  onClick={() => {setTarefaParaDetalhes(tarefa); setModalListaAberto(false);}} // Abre detalhes ao clicar
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{tarefa.titulo}</strong>
                  <span style={{float: 'right', fontSize: '13px'}}>{tarefa.inicio}</span>
                </div>
              ))}
            </div>
            <div className="botoes-modal">
              <button className="botao-cancelar" onClick={() => setModalListaAberto(false)}>Fechar</button>
              <button className="botao-adicionar-rapido" onClick={() => { setModalListaAberto(false); setModalAberto(true); }}> + Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL DE DETALHES */}
      {tarefaParaDetalhes && (
        <div className="modal-fundo" style={{ zIndex: 1000 }}>
          <div className="modal-caixa" style={{ borderTop: '8px solid', borderColor: tarefaParaDetalhes.importancia === 'urgente' ? 'red' : tarefaParaDetalhes.importancia === 'importante' ? 'orange' : 'green' }}>
            <h2 style={{marginTop: 0}}>{tarefaParaDetalhes.titulo}</h2>
            <p>⏰ <strong>Horário:</strong> {tarefaParaDetalhes.inicio} às {tarefaParaDetalhes.termino}</p>
            <p>🚨 <strong>Importância:</strong> {tarefaParaDetalhes.importancia}</p>
            
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '15px 0', minHeight: '100px' }}>
             <strong style={{ display: 'block', marginBottom: '8px' }}>Descrição:</strong>
             <p className="texto-descricao">
             {tarefaParaDetalhes.descricao || "Sem descrição informada."}
             </p>
            </div>

            <div className="botoes-modal" style={{ justifyContent: 'space-between' }}>
              <button className="botao-cancelar" onClick={() => setTarefaParaDetalhes(null)}>Voltar</button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => iniciarEdicao(tarefaParaDetalhes)}
                  style={{ background: '#45B9FB', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Editar
                </button>

                <button 
                  onClick={() => excluirTarefa(tarefaParaDetalhes.id)}
                  style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}