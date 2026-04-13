import { useState, useEffect, useRef } from 'react';
import './style.css';


export default function Pomodoro() {
  const [tempoFoco, setTempoFoco] = useState(25);
  const [tempoDescanso, setTempoDescanso] = useState(5);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);
  const [emFoco, setEmFoco] = useState(true);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSegundos = emFoco ? tempoFoco * 60 : tempoDescanso * 60;
  const progresso = segundosRestantes / totalSegundos;

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

  // Arco SVG
  const raio = 160;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia * (1 - progresso);

  useEffect(() => {
    if (rodando) {
      intervalRef.current = setInterval(() => {
        setSegundosRestantes(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRodando(false);
            // Troca foco/descanso
            setEmFoco(f => {
              const novoFoco = !f;
              setSegundosRestantes(novoFoco ? tempoFoco * 60 : tempoDescanso * 60);
              return novoFoco;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [rodando]);

  const reiniciar = () => {
    setRodando(false);
    setEmFoco(true);
    setSegundosRestantes(tempoFoco * 60);
  };

  const salvarConfiguracoes = () => {
    reiniciar();
    setDetalhesAbertos(false);
  };

  return (
    <div className="pomodoro-pagina">

      {/* Botão Detalhes */}
      <button className="botao-detalhes" onClick={() => setDetalhesAbertos(!detalhesAbertos)}>
        Detalhes 
      </button>

      {/* Painel de configurações */}
      {detalhesAbertos && (
        <div className="painel-detalhes">
          <h3>Configurações</h3>
          <div className="detalhe-grupo">
            <label>Tempo de foco (min)</label>
            <input
              type="number" min={1} max={60}
              value={tempoFoco}
              onChange={e => setTempoFoco(Number(e.target.value))}
            />
          </div>
          <div className="detalhe-grupo">
            <label>Tempo de descanso (min)</label>
            <input
              type="number" min={1} max={30}
              value={tempoDescanso}
              onChange={e => setTempoDescanso(Number(e.target.value))}
            />
          </div>
          <button className="botao-salvar-config" onClick={salvarConfiguracoes}>Salvar</button>
        </div>
      )}

      {/* Círculo */}
      <div className='pomodoro-centro'>
      <div className="pomodoro-circulo-wrapper">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Trilha de fundo */}
          <circle
            cx="200" cy="200" r={raio}
            fill="none"
            stroke={emFoco ? '#f4a89a' : '#a8d0e6'}
            strokeWidth="20"
          />
          {/* Arco de progresso */}
          <circle
            cx="200" cy="200" r={raio}
            fill="none"
            stroke={emFoco ? '#a8d0e6' : '#f4a89a'}
            strokeWidth="20"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 200 200)"
          />
        </svg>

        {/* Texto dentro do círculo */}
        <div className="pomodoro-info">
          <span className="pomodoro-titulo">Pomodoro</span>
          <span className="pomodoro-tempo">{tempoFormatado}</span>
          <span className="pomodoro-fase">{emFoco ? 'Tempo de foco' : 'Tempo de descanso'}</span>
        </div>
      </div>

      {/* Botão Iniciar/Pausar */}
      <button className="botao-iniciar" onClick={() => setRodando(!rodando)}>
        {rodando ? '⏸' : '▶'} {rodando ? 'Pausar' : 'Iniciar'}
      </button>

    </div>
    </div>
  );
}