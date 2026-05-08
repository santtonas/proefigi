import './style.css';
import React, { useState } from 'react';
import { Clock, ArrowRight, Target } from 'lucide-react';
import { useTarefas } from '../../context/TarefaContext';
import { useMetas } from '../../context/MetaContext';
import MetaCard from '../../components/MetaCard';
import { useNavigate } from 'react-router-dom';
import { BarraDiasSeguidos } from '../../components/BarraDiasSeguidos';

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
  const { metas } = useMetas();
  const metasFixadas = metas.filter(m => m.fixada);
  const metasHome = (metasFixadas.length > 0 ? metasFixadas : metas).slice(0, 3);
  const navigate = useNavigate();
  const { tarefas, adicionarTarefa, excluirTarefa, atualizarTarefa } = useTarefas();
  
  const dataHoje = new Date();
  const ano = dataHoje.getFullYear();
  const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
  const dia = String(dataHoje.getDate()).padStart(2, '0');
  const hojeISO = `${ano}-${mes}-${dia}`;
  
  const amanha = new Date();
  amanha.setDate(dataHoje.getDate() + 1);
  const amanhaISO = amanha.toISOString().split('T')[0];
  
  const [modoVisualizacao, setModoVisualizacao] = useState<string>('hoje');

  const dataFimSemana = new Date(dataHoje);
  const diasParaSabado = 6 - dataHoje.getDay(); 
  dataFimSemana.setDate(dataHoje.getDate() + diasParaSabado);
  
  const diaFim = String(dataFimSemana.getDate()).padStart(2, '0');
  const mesFim = String(dataFimSemana.getMonth() + 1).padStart(2, '0');
  const anoFim = dataFimSemana.getFullYear();
  
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaParaDetalhes, setTarefaParaDetalhes] = useState<Tarefa | null>(null); 
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<string | null>(null);         
  
  const [dataNovaTarefa, setDataNovaTarefa] = useState(hojeISO); 
  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [importancia, setImportancia] = useState<'normal' | 'importante' | 'urgente'>('normal');
  const [descricao, setDescricao] = useState('');

  const [dataVisualizacao, setDataVisualizacao] = useState(hojeISO);
  const [anoV, mesV, diaV] = dataVisualizacao.split('-');
  const dataFormatadaVisualizacao = new Date(Number(anoV), Number(mesV) - 1, Number(diaV)).toDateString();
  
  const tarefasDaTela = tarefas.filter(t => {
    if (t.concluida) return false;

    if (modoVisualizacao === 'semana') {
      const dataTarefa = new Date(t.data);
      const hoje = new Date(ano, Number(mes) - 1, Number(dia)); 
      const limite = new Date(anoFim, Number(mesFim) - 1, Number(diaFim)); 
      
      return dataTarefa >= hoje && dataTarefa <= limite;
    }

    return t.data === dataFormatadaVisualizacao;
  });

  const tarefasOrdenadas = [...tarefasDaTela].sort((a, b) => {
    const dataA = new Date(`${a.data} ${a.inicio || '00:00'}`);
    const dataB = new Date(`${b.data} ${b.inicio || '00:00'}`);
    return dataA.getTime() - dataB.getTime();
  });

  // --- FUNÇÕES DE EDIÇÃO E EXCLUSÃO ---
  const iniciarEdicao = (tarefa: Tarefa) => {
    setTitulo(tarefa.titulo);
    setInicio(tarefa.inicio);
    setTermino(tarefa.termino);
    setImportancia(tarefa.importancia);
    setDescricao(tarefa.descricao);
    setTarefaEmEdicao(tarefa.id);
    
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
      atualizarTarefa(tarefaEmEdicao, {
        data: dataFormatadaParaContexto, 
        titulo, inicio, termino, importancia, descricao
      });
      setTarefaEmEdicao(null);
    } else {
      const novaTarefa: Tarefa = {
        id: Math.random().toString(),
        data: dataFormatadaParaContexto,
        titulo, inicio, termino, importancia, descricao
      };
      adicionarTarefa(novaTarefa); 
    }
    
    setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
    setDataNovaTarefa(dataVisualizacao); 
    setModalAberto(false);
  };

  const marcarConcluida = (id: string) => {
    atualizarTarefa(id, { concluida: true });
    setTarefaParaDetalhes(null); 
  };

  const formatarDataTarefa = (dataString: string) => {
    const dataObj = new Date(dataString);
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    return `${diaSemana}, ${dia}/${mes}`;
  };

  // --- LÓGICA PROGRESSO DE HOJE ---------
  const dataHojeObj = new Date(ano, Number(mes) - 1, Number(dia));
  const dataHojeString = dataHojeObj.toDateString();

  const todasAsTarefasDeHoje = tarefas.filter(t => t.data === dataHojeString);
  const totalTarefasHoje = todasAsTarefasDeHoje.length;
  const tarefasConcluidasHoje = todasAsTarefasDeHoje.filter(t => t.concluida).length;
  const temTarefasHoje = totalTarefasHoje > 0;

  const progressoPorcentagem = temTarefasHoje
    ? Math.round((tarefasConcluidasHoje / totalTarefasHoje) * 100)
    : 0;

  let corDoProgresso = '#45B9FB'; 
  if (progressoPorcentagem === 100 && temTarefasHoje) {
    corDoProgresso = '#10b981'; 
  } else if (progressoPorcentagem < 30 && temTarefasHoje) {
    corDoProgresso = '#a2d9ff'; 
  }

  let minutosEstudados = 0;
  todasAsTarefasDeHoje.forEach(tarefa => {
    if (tarefa.concluida && tarefa.inicio && tarefa.termino) {
      const [horaInicio, minInicio] = tarefa.inicio.split(':').map(Number);
      const [horaFim, minFim] = tarefa.termino.split(':').map(Number);
      const tempoInicioMinutos = (horaInicio * 60) + minInicio;
      const tempoFimMinutos = (horaFim * 60) + minFim;
      if (tempoFimMinutos >= tempoInicioMinutos) {
        minutosEstudados += (tempoFimMinutos - tempoInicioMinutos);
      }
    }
  });

  const horasProgresso = Math.floor(minutosEstudados / 60);
  const minProgresso = minutosEstudados % 60;
  const tempoFormatado = `${String(horasProgresso).padStart(2, '0')}h ${String(minProgresso).padStart(2, '0')}m`;

  return (
    <div className="home-pagina">
      
      <div className="home-header">
        <div className="filtros-lista-container">
          <button 
            className={`botao-filtro-tempo ${modoVisualizacao === 'hoje' ? 'ativo' : ''}`}
            onClick={() => { setModoVisualizacao('hoje'); setDataVisualizacao(hojeISO); }}
          >
            Hoje
          </button>
          
          <button 
            className={`botao-filtro-tempo ${modoVisualizacao === 'amanha' ? 'ativo' : ''}`}
            onClick={() => { setModoVisualizacao('amanha'); setDataVisualizacao(amanhaISO); }}
          >
            Amanhã
          </button>
          
          <button 
            className={`botao-filtro-tempo ${modoVisualizacao === 'semana' ? 'ativo' : ''}`}
            onClick={() => setModoVisualizacao('semana')}
          >
            Da semana
          </button>
        </div>
      </div>

      <div className="home-conteudo">
        
        {/* --- INÍCIO DO DASHBOARD (GRID) --- */}
        <div className="home-dashboard-container">
          
          {/* --- COLUNA ESQUERDA: TAREFAS --- */}
          <div className="home-card-destaque coluna-tarefas">
            <div className="destaque-header-linha">
              <h3>
                {modoVisualizacao === 'semana' ? "Tarefas da Semana" : 
                 dataVisualizacao === hojeISO ? "Tarefas de Hoje" : 
                 dataVisualizacao === amanhaISO ? "Tarefas de Amanhã" : "Tarefas do dia"}
              </h3>
              
              {modoVisualizacao === 'semana' ? (
                <span className="input-data-cabecalho" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                   {dia}/{mes} - {diaFim}/{mesFim}
                </span>
              ) : (
                <input 
                  type="date" 
                  value={dataVisualizacao} 
                  onChange={(e) => {
                    setDataVisualizacao(e.target.value);
                    setModoVisualizacao('custom'); 
                  }} 
                  className="input-data-cabecalho"
                />
              )}
            </div>
            
            <div className="area-da-tarefa">
              <div className="cards-tarefas" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tarefasOrdenadas.length > 0 ? (
                  tarefasOrdenadas.map((t, index) => {
                    const mostrarCabecalhoData = modoVisualizacao === 'semana' && (index === 0 || tarefasOrdenadas[index - 1].data !== t.data);

                    return (
                      <React.Fragment key={t.id}>
                        {mostrarCabecalhoData && (
                          <div className="separador-data">
                             {formatarDataTarefa(t.data)}
                          </div>
                        )}
                        
                        <div 
                          className={`card-tarefa borda-${t.importancia}`} 
                          onClick={() => setTarefaParaDetalhes(t)} 
                          style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: `6px solid ${t.importancia === 'urgente' ? 'red' : t.importancia === 'importante' ? 'orange' : 'green'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <strong style={{ color: '#1e293b' }}>{t.titulo}</strong>
                          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>{t.inicio}</span>
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>Nenhuma tarefa para este período! 🎉</p>
                )}
              </div>

              <button 
                onClick={() => {
                  setTarefaEmEdicao(null); 
                  setTitulo(''); setInicio(''); setTermino(''); setImportancia('normal'); setDescricao('');
                  setDataNovaTarefa(dataVisualizacao);
                  setModalAberto(true);
                }}
                style={{ 
                  width: '100%', 
                  marginTop: 'auto', /* Empurra o botão pro fundo se sobrar espaço */
                  padding: '12px', 
                  backgroundColor: '#f1f5f9', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#475569', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  flexShrink: 0, /* Impede o botão de ser esmagado */
                  flexGrow: 0,   /* Impede o botão de esticar e ficar gigante */
                  height: '45px' /* Crava a altura exata dele */
                }}
              >
                + Adicionar Nova Tarefa
              </button>
            </div>
          </div>
          {/* --- FIM DA COLUNA ESQUERDA --- */}
          
          {/* --- COLUNA DIREITA: PROGRESSO E METAS --- */}
          <div className="home-resumos coluna-lateral">
            
            {/* CARD: PROGRESSO */}
            <div className="home-card-resumo card-clicavel" onClick={() => navigate('/progresso')}>
              <h3>Progresso Hoje</h3>
              
              {!temTarefasHoje ? (
                <div className="estado-vazio-progresso">
                  <p>☕</p>
                  <span>Nenhuma tarefa para hoje.<br />Pronto para começar?</span>
                </div>
              ) : (
                <div className="progresso-layout">
                  <div className="bloco-grafico">
                    <div className="progresso-anel-container">
                      <svg className="progresso-svg" viewBox="0 0 36 36">
                        <path className="circulo-fundo" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="circulo-barra"
                          style={{ stroke: corDoProgresso, strokeDasharray: `${progressoPorcentagem}, 100` }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      
                      <div className="progresso-texto-central">
                        {progressoPorcentagem === 100 ? (
                          <span className="icone-concluido">🏆</span>
                        ) : (
                          <>
                            <span className="porcentagem-valor">{progressoPorcentagem}%</span>
                            <span className="fracao-valor">{tarefasConcluidasHoje} / {totalTarefasHoje}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="texto-anel">Tarefa concluída</h3>
                  </div>

                  <div className="divisor-vertical"></div>

                  <div className="progresso-horas">
                    <Clock size={28} color={corDoProgresso} />
                    <span className="horas-valor">{tempoFormatado}</span>
                    <span className="horas-label">Estudadas hoje</span>
                  </div>
                </div>
              )}
            </div>

            {/* CARD: METAS DA SEMANA */}
            <div className="home-card-resumo card-clicavel" onClick={() => navigate('/metas')}>
              <div className="cabecalho-bloco" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Metas da Semana</h3>
              </div>
              <div className="metas-semana-lista" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                {metas.length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#94a3b8' }}>Nenhuma meta criada.</p>
                ) : (
                  metasHome.map(meta => (
                    <MetaCard 
                      key={meta.id} 
                      meta={meta} 
                      compacto={true} 
                    />
                  ))
                )}
              </div>
            </div>

          </div>
          

        </div>



        <BarraDiasSeguidos />
       


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

      {/* --- MODAL DE DETALHES --- */}
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