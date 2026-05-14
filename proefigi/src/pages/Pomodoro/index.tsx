import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import "./style.css";
import { useTarefas } from "../../context/TarefaContext";

export default function Pomodoro() {
  // Estados do Cronômetro
  const [tempo, setTempo] = useState(25 * 60);
  const [ativo, setAtivo] = useState(false);
  const [fase, setFase] = useState<"Foco" | "Descanso">("Foco");
  const [cicloAtual, setCicloAtual] = useState(1);

  // Ref para saber se o timer foi iniciado por uma tarefa automática
  const iniciadoPorTarefaRef = useRef(false);

  // ==========================================
  // LÓGICA DE IDENTIFICAÇÃO DA TAREFA
  // ==========================================
  const { tarefas } = useTarefas();

  const tarefaAtual = tarefas.find((t) => {
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    if (!t.inicio || !t.termino) return false;

    const [hIni, mIni] = t.inicio.split(":").map(Number);
    const [hFim, mFim] = t.termino.split(":").map(Number);

    const tempoInicio = hIni * 60 + mIni;
    const tempoFim = hFim * 60 + mFim;

    return (
      t.pomodoroAutomatico && horaAtual >= tempoInicio && horaAtual <= tempoFim
    );
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
      setTimeout(() => {
        if (fase === "Foco") {
          if ((cicloAtual + 1) % 4 === 0) {
            setTempo(15 * 60);
          } else {
            setTempo(5 * 60);
          }
          setCicloAtual((c) => c + 1);
          setFase("Descanso");
        } else {
          setFase("Foco");
          setTempo(25 * 60);
          setAtivo(false);
        }
      }, 0);
    }

    return () => clearInterval(intervalo);
  }, [ativo, tempo, fase, cicloAtual]);

  // Gatilho de INÍCIO — dispara quando bate o horário da tarefa
  useEffect(() => {
    if (tarefaAtual && !ativo) {
      iniciadoPorTarefaRef.current = true;
      setTimeout(() => setAtivo(true), 0);
    }
  }, [tarefaAtual]);

  // Gatilho de FIM — dispara quando o horário da tarefa termina
  // Só reseta se o timer foi iniciado por uma tarefa automática
  useEffect(() => {
    if (!tarefaAtual && ativo && iniciadoPorTarefaRef.current) {
      iniciadoPorTarefaRef.current = false;
      setTimeout(() => {
        setAtivo(false);
        setFase("Foco");
        setTempo(25 * 60);
        setCicloAtual(1);
      }, 0);
    }
  }, [tarefaAtual]);

  // ==========================================
  // FORMATAÇÃO E CÁLCULOS DO CÍRCULO
  // ==========================================
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;
  const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

  const tempoTotalFase =
    fase === "Foco" ? 25 * 60 : cicloAtual % 4 === 0 ? 15 * 60 : 5 * 60;
  const porcentagem = (tempo / tempoTotalFase) * 100;
  const raioCirculo = 190;
  const circunferencia = 2 * Math.PI * raioCirculo;
  const offsetCirculo = circunferencia - (porcentagem / 100) * circunferencia;

  return (
    <div className={`pomodoro-pagina ${fase === "Descanso" ? "descanso" : ""}`}>

      {/* Banner Minimalista no Topo */}
      {tarefaAtual ? (
        <div className="status-tarefa-topo">
          <span className="status-label">Focando em</span>
          <span className="status-nome-tarefa">{tarefaAtual.titulo}</span>
        </div>
      ) : (
        <div className="status-tarefa-topo" style={{ opacity: 0.6 }}>
          <span className="status-label">Modo Livre</span>
          <span
            className="status-nome-tarefa"
            style={{ fontSize: "13px", fontWeight: "normal" }}
          >
            Nenhuma tarefa agendada para agora
          </span>
        </div>
      )}

      {/* Centro do Pomodoro */}
      <div className="pomodoro-centro">
        <div className="pomodoro-circulo-wrapper">
          <svg width="400" height="400" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="200"
              cy="200"
              r={raioCirculo}
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="200"
              cy="200"
              r={raioCirculo}
              stroke={fase === "Foco" ? "#45B9FB" : "#18df61"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offsetCirculo}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
              }}
            />
          </svg>

          <div className="pomodoro-info">
            <span className="pomodoro-titulo">
              {fase === "Foco" ? `Ciclo ${cicloAtual}` : "Hora de Relaxar"}
            </span>
            <span className="pomodoro-tempo">{tempoFormatado}</span>
            <span className="pomodoro-fase">
              {ativo ? "Em andamento..." : "Pausado"}
            </span>
          </div>
        </div>

        <button className="botao-iniciar" onClick={() => setAtivo(!ativo)}>
          {ativo ? <Pause size={24} /> : <Play size={24} />}
          {ativo ? "Pausar" : "Iniciar"}
        </button>
      </div>
    </div>
  );
}