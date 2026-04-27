import './style.css';
import React, { useState } from 'react';
import { Clock, ArrowRight, Target } from 'lucide-react';
import { useTarefas } from '../../context/TarefaContext';

// Define o formato da Tarefa para o TypeScript não reclamar
interface Tarefa {
  id: string;
  data: string;
  titulo: string;
  inicio: string;
  termino: string;
  importancia: 'normal' | 'importante' | 'urgente';
  descricao: string;
  concluida?: boolean;
}

export function Home() {
  // 1. Agora puxamos também a exclusão e atualização!
  const { tarefas, adicionarTarefa, excluirTarefa, atualizarTarefa } = useTarefas();
  
  const dataHoje = new Date();
  const tarefasDeHoje = tarefas.filter(t => t.data === dataHoje.toDateString() && !t.concluida);

  const ano = dataHoje.getFullYear();
  const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
  const dia = String(dataHoje.getDate()).padStart(2, '0');
  const hojeISO = `${ano}-${mes}-${dia}`;

  // --- ESTADOS ---
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaParaDetalhes, setTarefaParaDetalhes] = useState<Tarefa | null>(null); 
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<string | null>(null);         
  
  const [dataNovaTarefa, setDataNovaTarefa] = useState(hojeISO); 
  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [importancia, setImportancia] = useState<'normal' | 'importante' | 'urgente'>('normal');
  const [descricao, setDescricao] = useState('');

  // --- FUNÇÕES DE EDIÇÃO E EXCLUSÃO ---
  const iniciarEdicao = (tarefa: Tarefa) => {
    setTitulo(tarefa.titulo);
    setInicio(tarefa.inicio);
    setTermino(tarefa.termino);
    setImportancia(tarefa.importancia);
    setDescricao(tarefa.descricao);
    setTarefaEmEdicao(tarefa.id);

    // Converte a data da tarefa de volta para YYYY-MM-DD para o input
    const dataObj = new Date(tarefa.data);
    const anoT = dataObj.getFullYear();
    const mesT = String(dataObj.getMonth() + 1).padStart(2, '0');
    const diaT = String(dataObj.getDate()).padStart(2, '0');
    setDataNovaTarefa(`${anoT}-${mesT}-${diaT}`);

    setTarefaParaDetalhes(null); 
    setModalAberto(true);        
  };

  const lidarComExclusao = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      excluirTarefa(id);
      setTarefaParaDetalhes(null);
    }
  };

  const salvarNovaTarefa = () => {
    if (!titulo) {
      alert("Por favor, dê um título para a tarefa!");
      return;
    }

    const [anoSel, mesSel, diaSel] = dataNovaTarefa.split('-');
    const dataFormatadaParaContexto = new Date(Number(anoSel), Number(mesSel) - 1, Number(diaSel)).toDateString();

    if (tarefaEmEdicao) {
      // SE ESTIVER EDITANDO
      atualizarTarefa(tarefaEmEdicao, {
        data: dataFormatadaParaContexto, 
        titulo, inicio, termino, importancia, descricao
      });
      setTarefaEmEdicao(null);
    } else {
      // SE FOR NOVA TAREFA
      const novaTarefa: Tarefa = {
        id: Math.random().toString(),
        data: dataFormatadaParaContexto,
        titulo, inicio, termino, importancia, descricao
      };
      adicionarTarefa(novaTarefa); 
    }

    // Limpa os campos
    setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
    setDataNovaTarefa(hojeISO); 
    setModalAberto(false);
  };

  const marcarConcluida = (id: string) => {
    atualizarTarefa(id, { concluida: true });
    setTarefaParaDetalhes(null); 
  };

  return (
    <div className="home-pagina">
      
      <div className="home-header">
        
        <p>Aqui penso em colocar opções de ver "Amanhã e está semana" mostra as tarefas.</p>
      </div>

      <div className="home-conteudo">
        
        <div className="home-card-destaque">
          <div className="destaque-header">
            <h3>Tarefas do dia</h3>
          </div>
          
          <div className="area-da-tarefa">
            <div className="cards-tarefas" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tarefasDeHoje.length > 0 ? (
                tarefasDeHoje.map(t => (
                  <div 
                    key={t.id} 
                    className={`card-tarefa borda-${t.importancia}`} 
                    onClick={() => setTarefaParaDetalhes(t)} 
                    style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: `6px solid ${t.importancia === 'urgente' ? 'red' : t.importancia === 'importante' ? 'orange' : 'green'}`, cursor: 'pointer' }}
                  >
                    <strong>{t.titulo}</strong>
                    <span style={{float: 'right', fontSize: '13px', color: '#64748b'}}>{t.inicio}</span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>Nenhuma tarefa para hoje! 🎉</p>
              )}
            </div>

            <button 
              onClick={() => {
                setTarefaEmEdicao(null); 
                setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
                setDataNovaTarefa(hojeISO);
                setModalAberto(true);
              }}
              style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Adicionar Nova Tarefa
            </button>
          </div>
        </div>
        
        <p>Não liga pra esses card por enquanto, tou focando em finalizar o card de tarefas do dia logo.</p>


        {/* ... (ÁREA DOS RESUMOS MANTIDA IGUAL) ... */}
        <div className="home-resumos">
          <div className="home-card-resumo">
            <h3>Progresso Hoje</h3>
            <div className="progresso-layout">
              <div className="progresso-anel-placeholder"><div className="anel-falso"><span>75%</span></div></div>
              <div className="divisor-vertical"></div>
              <div className="progresso-horas"><Clock size={28} color="#45B9FB" /><span className="horas-valor">02h 30m</span><span className="horas-label">Estudadas hoje</span></div>
            </div>
          </div>
          <div className="home-card-resumo">
            <div className="resumo-header-metas">
              <h3>Metas da Semana</h3>
              <button className="botao-ver-tudo">Ver tudo <ArrowRight size={14} /></button>
            </div>
            <div className="metas-lista-mini">
              <div className="meta-mini-item"><Target size={16} color="#a855f7" /><span>Estudar para o concurso</span><strong>(1/3)</strong></div>
              <div className="meta-mini-item"><Target size={16} color="#f97316" /><span>Ler capítulo 5</span><strong>(0/1)</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE FORMULÁRIO (CRIAR/EDITAR) --- */}
      {modalAberto && (
        <div className="modal-fundo">
          <div className="modal-caixa">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{tarefaEmEdicao ? "Editar Tarefa" : "Nova Tarefa"}</h2>
              <input type="date" value={dataNovaTarefa} onChange={(e) => setDataNovaTarefa(e.target.value)} style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }} />
            </div>

            <div className="grupo-input"><label>Título</label><input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
            <div className="linha-horarios">
              <div className="grupo-input"><label>Início</label><input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
              <div className="grupo-input"><label>Fim</label><input type="time" value={termino} onChange={(e) => setTermino(e.target.value)} /></div>
            </div>
            <div className="grupo-input">
              <label>Prioridade</label>
              <select value={importancia} onChange={(e) => setImportancia(e.target.value as any)}>
                <option value="normal">Normal</option><option value="importante">Importante</option><option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="grupo-input"><label>Descrição</label><textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}></textarea></div>
            
            <div className="botoes-modal">
              <button className="botao-salvar" onClick={salvarNovaTarefa}>Salvar</button>
              <button className="botao-cancelar" onClick={() => { setModalAberto(false); setTarefaEmEdicao(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOVO: MODAL DE DETALHES --- */}
      {tarefaParaDetalhes && (
        <div className="modal-fundo" style={{ zIndex: 1000 }}>
          <div className="modal-caixa" style={{ borderTop: '8px solid', borderColor: tarefaParaDetalhes.importancia === 'urgente' ? 'red' : tarefaParaDetalhes.importancia === 'importante' ? 'orange' : 'green' }}>
            <h2 style={{marginTop: 0}}>{tarefaParaDetalhes.titulo}</h2>
            <p>⏰ <strong>Horário:</strong> {tarefaParaDetalhes.inicio} às {tarefaParaDetalhes.termino}</p>
            <p>🚨 <strong>Importância:</strong> {tarefaParaDetalhes.importancia}</p>
            
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '15px 0', minHeight: '100px' }}>
             <strong style={{ display: 'block', marginBottom: '8px' }}>Descrição:</strong>
             <p className="texto-descricao">{tarefaParaDetalhes.descricao || "Sem descrição informada."}</p>
            </div>

            <div className="botoes-modal" style={{ justifyContent: 'space-between' }}>
              <button className="botao-cancelar" onClick={() => setTarefaParaDetalhes(null)}>Voltar</button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {!tarefaParaDetalhes.concluida && (
                  <button 
                    onClick={() => marcarConcluida(tarefaParaDetalhes.id)} 
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Concluir
                  </button>
                )}
                <button onClick={() => iniciarEdicao(tarefaParaDetalhes)} style={{ background: '#45B9FB', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                <button onClick={() => lidarComExclusao(tarefaParaDetalhes.id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}