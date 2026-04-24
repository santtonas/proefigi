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
  const estadoRef = useRef({
    rodando: false,
    emFoco: true,
    tempoFoco: 25,
    tempoDescanso: 5,
    segundos: 25 * 60,
  });

  const totalSegundos = emFoco ? tempoFoco * 60 : tempoDescanso * 60;
  const progresso = segundosRestantes / totalSegundos;
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

  const raio = 160;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia * (1 - progresso);

  const iniciarIntervalo = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      estadoRef.current.segundos -= 1;
      
      if (estadoRef.current.segundos <= 0) {
        estadoRef.current.emFoco = !estadoRef.current.emFoco;
        estadoRef.current.segundos = estadoRef.current.emFoco
          ? estadoRef.current.tempoFoco * 60
          : estadoRef.current.tempoDescanso * 60;
        
        setEmFoco(estadoRef.current.emFoco);
      }
      
      setSegundosRestantes(estadoRef.current.segundos);
    }, 1000);
  };

  const toggleRodando = () => {
    const novoRodando = !rodando;
    estadoRef.current.rodando = novoRodando;
    setRodando(novoRodando);
    
    if (novoRodando) {
      iniciarIntervalo();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const salvarConfiguracoes = (novoTempoFoco: number, novoTempoDescanso: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    estadoRef.current = {
      rodando: false,
      emFoco: true,
      tempoFoco: novoTempoFoco,
      tempoDescanso: novoTempoDescanso,
      segundos: novoTempoFoco * 60,
    };
    setRodando(false);
    setEmFoco(true);
    setSegundosRestantes(novoTempoFoco * 60);
    setDetalhesAbertos(false);
  };

  useEffect(() => {
    estadoRef.current.tempoFoco = tempoFoco;
  }, [tempoFoco]);

  useEffect(() => {
    estadoRef.current.tempoDescanso = tempoDescanso;
  }, [tempoDescanso]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={`pomodoro-pagina ${!emFoco ? 'descanso' : ''}`}>

      <button className="botao-detalhes" onClick={() => setDetalhesAbertos(!detalhesAbertos)}>
        Detalhes
      </button>

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
          <button className="botao-salvar-config" onClick={() => salvarConfiguracoes(tempoFoco, tempoDescanso)}>
            Salvar
          </button>
        </div>
      )}

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
              stroke={emFoco ? '#a8d0e6' : '#c8e6c8'}
              strokeWidth="20"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 200 200)"
            />
          </svg>

          <div className="pomodoro-info">
            <span className="pomodoro-titulo">Pomodoro</span>
            <span className="pomodoro-tempo">{tempoFormatado}</span>
            <span className="pomodoro-fase">{emFoco ? 'Tempo de foco' : 'Tempo de descanso'}</span>
          </div>
        </div>

        <button className="botao-iniciar" onClick={toggleRodando}>
          {rodando ? '⏸' : '▶'} {rodando ? 'Pausar' : 'Iniciar'}
        </button>
      </div>

    </div>
  );
}