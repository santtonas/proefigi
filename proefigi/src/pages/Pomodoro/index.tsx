import { useState, useEffect, useRef } from "react";
import { Play, Pause, Settings } from "lucide-react";
import "./style.css";
import { useTarefas } from "../../context/TarefaContext";
import Restricao from "../Restricao";

export default function Pomodoro() {
  const [tempoFocoConfig, setTempoFocoConfig] = useState(25);
  const [tempoDescansoConfig, setTempoDescansoConfig] = useState(5);

  // Inicializa o tempo padrão baseado na configuração de foco
  const [tempo, setTempo] = useState(tempoFocoConfig * 60);
  const [ativo, setAtivo] = useState(false);
  const [fase, setFase] = useState<"Foco" | "Descanso">("Foco");
  const [cicloAtual, setCicloAtual] = useState(1);

  const [menuAberto, setMenuAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"ajustes" | "restricoes">("ajustes");

  const iniciadoPorTarefaRef = useRef(false);

  // ==========================================
  // LÓGICA DE IDENTIFICAÇÃO DA TAREFA
  // ==========================================
  const { tarefas } = useTarefas();

  const tarefaAtual = tarefas.find((t) => {
    const agora = new Date();

    // 1. AJUSTE: Garante que a tarefa pertence ao dia de HOJE (Formato YYYY-MM-DD)
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hojeString = `${ano}-${mes}-${dia}`;

    if (t.data !== hojeString) return false;
    if (!t.inicio || !t.termino) return false;

    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const [hIni, mIni] = t.inicio.split(":").map(Number);
    const [hFim, mFim] = t.termino.split(":").map(Number);

    const tempoInicio = hIni * 60 + mIni;
    const tempoFim = hFim * 60 + mFim;

    return (
      t.pomodoroAutomatico &&
      !t.concluida &&
      horaAtual >= tempoInicio &&
      horaAtual <= tempoFim
    );
  });


  // Função para quando o usuário está no modo personalizado e quer encerrar
  const encerrarSessao = () => {
    
    setTempoFocoConfig(25);
    setTempoDescansoConfig(5);
    
    
    setAtivo(false);
    setFase("Foco");
    setCicloAtual(1);
    setTempo(25 * 60);
  };

  // ==============================================================
  // Efeito que controla o cronômetro e a mudança de fases
  // ==============================================================

  // Função provisória apenas para o código não quebrar
  const tocarAlerta = () => {
    console.log("Sinal de transição de fase disparado!");
  };


  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null;
    if (ativo && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((t) => t - 1);
      }, 1000);
    } else if (tempo === 0) {
      tocarAlerta();

      // Envolvendo a mudança de estados no setTimeout para tirar o aviso vermelho
      setTimeout(() => {
        if (fase === "Foco") {
          setFase("Descanso");

          if (cicloAtual === 4) {
            setTempo((tempoDescansoConfig * 3) * 60);
          } else {
            setTempo(tempoDescansoConfig * 60);
          }

        } else {
          setFase("Foco");
          setTempo(tempoFocoConfig * 60);

          if (cicloAtual === 4) {
            setCicloAtual(1);
          } else {
            setCicloAtual((c) => c + 1);
          }
        }
      }, 0);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [ativo, tempo, fase, cicloAtual, tempoFocoConfig, tempoDescansoConfig]);

 // Gatilho de INÍCIO — dispara quando bate o horário da tarefa
  useEffect(() => {
    if (tarefaAtual && !ativo) {
      iniciadoPorTarefaRef.current = true;
      
      // Colocamos o setTempo e o setAtivo juntos dentro do setTimeout
      setTimeout(() => {
        setTempo(tempoFocoConfig * 60);
        setAtivo(true);
      }, 0);
    }
  }, [tarefaAtual, tempoFocoConfig, ativo]);

  
  
  useEffect(() => {
    if (!tarefaAtual && ativo && iniciadoPorTarefaRef.current) {
      iniciadoPorTarefaRef.current = false;
      setTimeout(() => {
        encerrarSessao(); 
      }, 0);
    }
  }, [tarefaAtual, ativo]);

  // Função para aplicar os tempos manualmente quando o usuário salvar as configurações

  const aplicarNovosTempos = () => {
    
    const foco = tempoFocoConfig || 25;
    const descanso = tempoDescansoConfig || 5;

    // Atualiza os states caso estivessem vazios
    setTempoFocoConfig(foco);
    setTempoDescansoConfig(descanso);

    setTempo(fase === "Foco" ? foco * 60 : descanso * 60);
    setMenuAberto(false);
  };

  

  // ==========================================
  // FORMATAÇÃO E CÁLCULOS DO CÍRCULO
  // ==========================================
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;
  const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

  // 2. AJUSTE: Cálculo da barra circular respeitando os minutos configurados
  const tempoTotalFase =
    fase === "Foco"
      ? tempoFocoConfig * 60
      : cicloAtual % 4 === 0
        ?(tempoDescansoConfig * 3) * 60
        : tempoDescansoConfig * 60;

  const porcentagem = (tempo / tempoTotalFase) * 100;
  const raioCirculo = 190;
  const circunferencia = 2 * Math.PI * raioCirculo;
  const offsetCirculo = circunferencia - (porcentagem / 100) * circunferencia;

  return (
    <div className={`pomodoro-pagina ${fase === "Descanso" ? "descanso" : ""}`}>
      <button
        className="botao-detalhes"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <Settings size={18} /> Configurações
      </button>

      {menuAberto && (
        <div className="painel-detalhes">
          {/* Navegação das Abas */}
          <div className={`abas-navegacao ${abaAtiva}`}>
            <div className="aba-fundo-deslizante"></div>
            <button
              className={`aba-botao ${abaAtiva === "ajustes" ? "ativa" : ""}`}
              onClick={() => setAbaAtiva("ajustes")}
            >
              Ajuste Personalizável
            </button>
            <button
              className={`aba-botao ${abaAtiva === "restricoes" ? "ativa" : ""}`}
              onClick={() => setAbaAtiva("restricoes")}
            >
              Restrição
            </button>
          </div>

          <hr
            style={{ border: "0.5px solid #e2e8f0", margin: "5px 0 15px 0" }}
          />

          {/* ABA 1: Ajustes */}
          <div
            className={`aba-transicao ${abaAtiva === "ajustes" ? "ativa" : ""}`}
          >
            <h3 style={{ marginBottom: "15px", color: "#0F172A" }}>
              Ajustes de Tempo
            </h3>
            <div className="detalhe-grupo">
              <label>Tempo de Foco (min):</label>
              <input
                type="number"
                value={tempoFocoConfig === 0 ? "" : tempoFocoConfig}
                onChange={(e) => setTempoFocoConfig(Number(e.target.value))}
              />
            </div>

            <div className="detalhe-grupo" style={{ marginTop: "10px" }}>
              <label>Tempo de Descanso (min):</label>
              <input
                type="number"
                value={tempoDescansoConfig === 0 ? "" : tempoDescansoConfig}
                onChange={(e) => setTempoDescansoConfig(Number(e.target.value))}
              />
            </div>

            {/* Ajustado para chamar a função de aplicar os novos tempos */}
            <button
              className="botao-salvar-config"
              onClick={aplicarNovosTempos}
              style={{ marginTop: "20px", width: "100%" }}
            >
              Salvar Tempos
            </button>
          </div>

          {/* ABA 2: Restrições */}
          <div
            className={`aba-transicao ${abaAtiva === "restricoes" ? "ativa" : ""}`}
          >
            <Restricao compacto={true} />
          </div>
        </div>
      )}

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

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          
          <button className="botao-iniciar" onClick={() => setAtivo(!ativo)}>
            {ativo ? <Pause size={24} /> : <Play size={24} />}
            {ativo ? "Pausar" : "Iniciar"}
          </button>

          
          {(tempoFocoConfig !== 25 || tempoDescansoConfig !== 5) && (
            <button className="botao-encerrar" onClick={encerrarSessao}>
              Encerrar Sessão - Voltar ao Pomodoro
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
