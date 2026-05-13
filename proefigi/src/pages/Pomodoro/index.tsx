import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import './style.css';
import { useTarefas } from '../../context/TarefaContext';

export default function Pomodoro() {
  // Estados do Cronômetro
  const [tempo, setTempo] = useState(25 * 60); // Começa em 25 minutos
  const [ativo, setAtivo] = useState(false);
  const [fase, setFase] = useState<'Foco' | 'Descanso'>('Foco');
  const [cicloAtual, setCicloAtual] = useState(1); // Conta os "tomates" (pomodoros)

  // ==========================================
  // LÓGICA DE IDENTIFICAÇÃO DA TAREFA
  // ==========================================
  
  // Descomente a linha abaixo e apague o array vazio quando o import acima estiver correto
  const { tarefas } = useTarefas(); 
 // const tarefas: any[] = []; // Array vazio temporário só para não dar erro na tela
  
  const tarefaAtual = tarefas.find(t => {
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    if (!t.inicio || !t.termino) return false;

    // Converte os horários da tarefa para minutos totais
    const [hIni, mIni] = t.inicio.split(':').map(Number);
    const [hFim, mFim] = t.termino.split(':').map(Number);
    
    const tempoInicio = hIni * 60 + mIni;
    const tempoFim = hFim * 60 + mFim;

    // Retorna a tarefa se ela for automática e estiver no horário exato
    return t.pomodoroAutomatico && horaAtual >= tempoInicio && horaAtual <= tempoFim;
  });

  // ==========================================
  // LÓGICA DO CRONÔMETRO E FASES
  // ==========================================
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;

    if (ativo && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((t) => t - 1);
      }, 1000);
    } else if (ativo && tempo === 0) {
      if (fase === 'Foco') {
        // Se for o 4º ciclo, dá uma pausa longa de 15 minutos! Se não, 5 minutos.
        if (cicloAtual % 4 === 3) {
          setTempo(15 * 60); 
        } else {
          setTempo(5 * 60); 
        }
        setFase('Descanso');
      } else {
        setFase('Foco');
        setTempo(25 * 60);
        setCicloAtual(c => c + 1); // Aumenta o ciclo
        setAtivo(false); // Pausa esperando iniciar o próximo foco
      }
    }

    return () => clearInterval(intervalo);
  }, [ativo, tempo, fase, cicloAtual]);

  // Formatação para MM:SS
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;
  const tempoFormatado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  // Cálculos da Animação do Círculo
  const tempoTotalFase = fase === 'Foco' ? 25 * 60 : (cicloAtual % 4 === 0 ? 15 * 60 : 5 * 60);
  const porcentagem = (tempo / tempoTotalFase) * 100;
  const raioCirculo = 190;
  const circunferencia = 2 * Math.PI * raioCirculo;
  const offsetCirculo = circunferencia - (porcentagem / 100) * circunferencia;

  return (
    <div className={`pomodoro-pagina ${fase === 'Descanso' ? 'descanso' : ''}`}>
      
      {/* Banner Minimalista no Topo */}
      {tarefaAtual ? (
        <div className="status-tarefa-topo">
          <span className="status-label">Focando em</span>
          <span className="status-nome-tarefa">{tarefaAtual.titulo}</span>
        </div>
      ) : (
        <div className="status-tarefa-topo" style={{ opacity: 0.6 }}>
          <span className="status-label">Modo Livre</span>
          <span className="status-nome-tarefa" style={{ fontSize: '13px', fontWeight: 'normal' }}>
            Nenhuma tarefa agendada para agora
          </span>
        </div>
      )}

      {/* Centro do Pomodoro */}
      <div className="pomodoro-centro">
        <div className="pomodoro-circulo-wrapper">
          <svg width="400" height="400" style={{ transform: 'rotate(-90deg)' }}>
            {/* Fundo do círculo */}
            <circle
              cx="200" cy="200" r={raioCirculo}
              stroke="#e2e8f0" strokeWidth="8" fill="none"
            />
            {/* Círculo que diminui */}
            <circle
              cx="200" cy="200" r={raioCirculo}
              stroke={fase === 'Foco' ? '#45B9FB' : '#22c55e'} 
              strokeWidth="8" fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offsetCirculo}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
            />
          </svg>

          <div className="pomodoro-info">
            <span className="pomodoro-titulo">
              {fase === 'Foco' ? `Ciclo ${cicloAtual}` : 'Hora de Relaxar'}
            </span>
            <span className="pomodoro-tempo">{tempoFormatado}</span>
            <span className="pomodoro-fase">
              {ativo ? 'Em andamento...' : 'Pausado'}
            </span>
          </div>
        </div>

        <button className="botao-iniciar" onClick={() => setAtivo(!ativo)}>
          {ativo ? <Pause size={24} /> : <Play size={24} />}
          {ativo ? 'Pausar' : 'Iniciar'}
        </button>
      </div>
    </div>
  );
}