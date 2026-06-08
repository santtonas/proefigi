import { useState, useEffect, useRef } from "react";
import { Play, Pause, Settings, RotateCcw } from "lucide-react";
import "./style.css";
import { useTarefas } from "../../context/TarefaContext";
import Restricao from "../Restricao";

export default function Pomodoro() {
  const tarefaIdAutomatizadaRef = useRef<string | null>(null);
  const [tempoFocoConfig, setTempoFocoConfig] = useState(25);
  const [tempoDescansoConfig, setTempoDescansoConfig] = useState(5);

  const [tempo, setTempo] = useState(tempoFocoConfig * 60);
  const [ativo, setAtivo] = useState(false);
  const [fase, setFase] = useState<"Foco" | "Descanso">("Foco");
  const [cicloAtual, setCicloAtual] = useState(1);

  // Guarda o exato milissegundo (Unix Timestamp) em que a sessão atual vai acabar
  const [horarioTermino, setHorarioTermino] = useState<number | null>(null);

  const [menuAberto, setMenuAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"ajustes" | "restricoes">("ajustes");

  const iniciadoPorTarefaRef = useRef(false);
  const { tarefas } = useTarefas();

  // ==============================================================
  // 🌐 SINCRONIZAÇÃO INICIAL COM O C# (ANTI-TRAPAÇA)
  // ==============================================================
  useEffect(() => {
    const puxarStatusDoServidor = async () => {
      try {
        /* 🔌 CONEXÃO C# (GET) - ANTI-F5 / RECARREGAMENTO DE PÁGINA
          -------------------------------------------------------------------
          AMIGO DO C#: Você precisa criar uma rota GET (ex: /api/pomodoro/status) para este usuário.
          Quando o usuário der F5 ou reabrir o app, o React vai perguntar se ele já tinha um Pomodoro ativo.
          
          📌 SUA BUSCA NO MYSQL: 
          Buscar o registro do usuário na tabela de estados do Pomodoro.

          📌 RETORNO ESPERADO (JSON):
          - Se houver sessão ativa rodando no banco:
            { "ativo": true, "horarioTermino": 1786123456000, "fase": "Foco", "cicloAtual": 1 }
            Nota: 'horarioTermino' deve vir como Unix Timestamp em milissegundos (BigInt/Double no banco).
          - Se NÃO houver sessão ativa:
            { "ativo": false, "horarioTermino": null, "fase": "Foco", "cicloAtual": 1 }
        */

        // const resposta = await fetch("http://suaapi.com/api/pomodoro/status");
        // const dados = await resposta.json();

        // Simulação de resposta do banco MySQL se o app fechar e reabrir:
        const dados = {
          ativo: false,
          horarioTermino: null,
          fase: "Foco",
          cicloAtual: 1,
        };

        if (dados.ativo && dados.horarioTermino) {
          const agora = Date.now();
          const restante = Math.max(
            0,
            Math.ceil((dados.horarioTermino - agora) / 1000),
          );

          setFase(dados.fase as "Foco" | "Descanso");
          setCicloAtual(dados.cicloAtual);
          setHorarioTermino(dados.horarioTermino);
          setTempo(restante);
          setAtivo(true);
        }
      } catch (erro) {
        console.error("Erro ao sincronizar com o servidor C#:", erro);
      }
    };

    puxarStatusDoServidor();
  }, []);

  // ==========================================
  // LÓGICA DE IDENTIFICAÇÃO DA TAREFA
  // ==========================================
  const tarefaAtual = tarefas.find((t) => {
    const agora = new Date();
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

  // ==============================================================
  // FUNÇÃO DE DISPARO DE AÇÃO PARA O BACKEND C#
  // ==============================================================
  const avisarServidorMudancaEstado = async (
    estaAtivo: boolean,
    faseAtual: string,
    ciclo: number,
    fimTimestamp: number | null,
  ) => {
    try {
      /* 🔌 CONEXÃO C# (POST) - GERENCIADOR DE ESTADO, BLOQUEIO E NOTIFICAÇÕES
        -------------------------------------------------------------------
        AMIGO DO C#: Você deve criar uma rota POST (ex: /api/pomodoro/atualizar).
        Você receberá no Body da requisição: estaAtivo (bool), faseAtual (string), ciclo (int) e fimTimestamp (long/null).

        🎯 REGRAS DE NEGÓCIO DO SEU BACKEND BASEADO NO 'estaAtivo':

        1️⃣ SE 'estaAtivo' FOR TRUE (Usuário deu Play, iniciou tarefa ou virou de fase automaticamente):
           - Salve ou atualize o registro no MySQL: ativo = true, fase = faseAtual, ciclo = ciclo, horario_termino = fimTimestamp.
           - AGENDAR WEB PUSH NOTIFICATION: Programe um gatilho em segundo plano (usando Hangfire, Quartz.NET ou BackgroundService) 
             para disparar um Push para o navegador exatamente no milissegundo enviado em 'fimTimestamp' avisando que a fase acabou.
           - Bloquear o aplicativo/sites conforme regras estritas.

        2️⃣ SE 'estaAtivo' FOR FALSE (Usuário Pausou, Reiniciou, Encerrou Sessão ou alterou tempos de configuração):
           - Atualize no MySQL: ativo = false, horario_termino = NULL.
           - CANCELAR AGENDAMENTO ANTIGO: Como o cronômetro foi interrompido, remova a tarefa agendada do Hangfire/Quartz 
             referente à notificação antiga desse usuário para ela não disparar errada.
           - Desativar temporariamente as restrições estritas.
      */

      console.log("Enviando para o C#:", {
        estaAtivo,
        faseAtual,
        ciclo,
        fimTimestamp,
      });

      /*
      await fetch("http://suaapi.com/api/pomodoro/atualizar", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ estaAtivo, faseAtual, ciclo, fimTimestamp })
      });
      */
    } catch (erro) {
      console.error("Erro ao atualizar dados no servidor:", erro);
    }
  };

  const encerrarSessao = () => {
    setTempoFocoConfig(25);
    setTempoDescansoConfig(5);
    setAtivo(false);
    setFase("Foco");
    setCicloAtual(1);
    setTempo(25 * 60);
    setHorarioTermino(null);
    avisarServidorMudancaEstado(false, "Foco", 1, null);
  };

  const tocarAlerta = () => {
    console.log("Sinal de transição de fase disparado!");
  };

  // ==============================================================
  // CRONÔMETRO RESISTENTE A FECHAMENTOS DE ABA
  // ==============================================================
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null;

    if (ativo && horarioTermino) {
      intervalo = setInterval(() => {
        const agora = Date.now();
        const restante = Math.max(
          0,
          Math.ceil((horarioTermino - agora) / 1000),
        );

        setTempo(restante);

        if (restante === 0) {
          if (intervalo) clearInterval(intervalo);
          tocarAlerta();

          // Transição de Fase Automatizada
          setTimeout(() => {
            const proximaFase: "Foco" | "Descanso" =
              fase === "Foco" ? "Descanso" : "Foco";
            let proximoCiclo = cicloAtual;
            let novoTempoSegundos = 0;

            if (fase === "Foco") {
              novoTempoSegundos =
                cicloAtual === 4
                  ? tempoDescansoConfig * 3 * 60
                  : tempoDescansoConfig * 60;
            } else {
              novoTempoSegundos = tempoFocoConfig * 60;
              proximoCiclo = cicloAtual === 4 ? 1 : cicloAtual + 1;
            }

            const novoFim = Date.now() + novoTempoSegundos * 1000;

            setFase(proximaFase);
            setCicloAtual(proximoCiclo);
            setTempo(novoTempoSegundos);
            setHorarioTermino(novoFim);

            // Avisa o C# para criar o próximo agendamento de Push Notification da nova fase
            avisarServidorMudancaEstado(
              true,
              proximaFase,
              proximoCiclo,
              novoFim,
            );
          }, 0);
        }
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [
    ativo,
    horarioTermino,
    fase,
    cicloAtual,
    tempoFocoConfig,
    tempoDescansoConfig,
  ]);

  const alternarCronometro = () => {
    const novoEstadoAtivo = !ativo;

    if (novoEstadoAtivo) {
      const novoFim = Date.now() + tempo * 1000;
      setHorarioTermino(novoFim);
      setAtivo(true);
      avisarServidorMudancaEstado(true, fase, cicloAtual, novoFim);
    } else {
      setHorarioTermino(null);
      setAtivo(false);
      avisarServidorMudancaEstado(false, fase, cicloAtual, null);
    }
  };

  const reiniciarCronometro = () => {
    setAtivo(false);
    setHorarioTermino(null);

    let tempoOriginal = tempoFocoConfig * 60;

    if (fase === "Descanso") {
      tempoOriginal =
        cicloAtual === 4
          ? tempoDescansoConfig * 3 * 60
          : tempoDescansoConfig * 60;
    }

    setTempo(tempoOriginal);
    avisarServidorMudancaEstado(false, fase, cicloAtual, null);
  };

  // Gatilho Automático por Tarefa
  useEffect(() => {
    if (
      tarefaAtual &&
      !ativo &&
      tarefaIdAutomatizadaRef.current !== tarefaAtual.id
    ) {
      iniciadoPorTarefaRef.current = true;
      tarefaIdAutomatizadaRef.current = tarefaAtual.id;

      setTimeout(() => {
        const tempoSegundos = tempoFocoConfig * 60;
        const novoFim = Date.now() + tempoSegundos * 1000;
        setTempo(tempoSegundos);
        setHorarioTermino(novoFim);
        setAtivo(true);
        avisarServidorMudancaEstado(true, "Foco", cicloAtual, novoFim);
      }, 0);
    }

    if (!tarefaAtual) {
      tarefaIdAutomatizadaRef.current = null;
    }
  }, [tarefaAtual, tempoFocoConfig, ativo, cicloAtual]);

  useEffect(() => {
    if (!tarefaAtual && ativo && iniciadoPorTarefaRef.current) {
      iniciadoPorTarefaRef.current = false;
      setTimeout(() => {
        encerrarSessao();
      }, 0);
    }
  }, [tarefaAtual, ativo]);

  const aplicarNovosTempos = () => {
    const foco = tempoFocoConfig || 25;
    const descanso = tempoDescansoConfig || 5;

    setTempoFocoConfig(foco);
    setTempoDescansoConfig(descanso);
    setTempo(fase === "Foco" ? foco * 60 : descanso * 60);
    setAtivo(false);
    setHorarioTermino(null);
    setMenuAberto(false);

    avisarServidorMudancaEstado(false, fase, cicloAtual, null);
  };

  // ==========================================
  // FORMATAÇÃO E CÁLCULOS DO CÍRCULO
  // ==========================================
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;
  const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

  const tempoTotalFase =
    fase === "Foco"
      ? tempoFocoConfig * 60
      : cicloAtual === 4
        ? tempoDescansoConfig * 3 * 60
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

          <hr style={{ border: "0.5px solid #e2e8f0", margin: "5px 0 15px 0" }} />

          <div className={`aba-transicao ${abaAtiva === "ajustes" ? "ativa" : ""}`}>
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

            <button
              className="botao-salvar-config"
              onClick={aplicarNovosTempos}
              style={{ marginTop: "20px", width: "100%" }}
            >
              Salvar Tempos
            </button>
          </div>

          <div className={`aba-transicao ${abaAtiva === "restricoes" ? "ativa" : ""}`}>
            <Restricao compacto={true} />
          </div>
        </div>
      )}

      {tarefaAtual ? (
        <div className="status-tarefa-topo">
          <span className="status-label">Focando em</span>
          <span className="status-nome-tarefa">{tarefaAtual.titulo}</span>
        </div>
      ) : (
        <div className="status-tarefa-topo" style={{ opacity: 0.6 }}>
          <span className="status-label">Modo Livre</span>
          <span className="status-nome-tarefa" style={{ fontSize: "13px", fontWeight: "normal" }}>
            Nenhuma tarefa agendada para agora
          </span>
        </div>
      )}

      <div className="pomodoro-centro">
        <div className="pomodoro-circulo-wrapper">
          <svg width="400" height="400" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="200" cy="200" r={raioCirculo} stroke="#e2e8f0" strokeWidth="8" fill="none" />
            <circle
              cx="200"
              cy="200"
              r={raioCirculo}
              stroke={fase === "Foco" ? "#45B9FB" : "#18df61"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offsetCirculo}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
            />
          </svg>

          <div className="pomodoro-info">
            <span className="pomodoro-titulo">
              {fase === "Foco" ? `Ciclo ${cicloAtual}` : "Hora de Relaxar"}
            </span>
            <span className="pomodoro-tempo">{tempoFormatado}</span>
            <span className="pomodoro-fase">{ativo ? "Em andamento..." : "Pausado"}</span>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
          <button className="botao-iniciar" onClick={alternarCronometro}>
            {ativo ? <Pause size={24} /> : <Play size={24} />}
            {ativo ? "Pausar" : "Iniciar"}
          </button>

          <button className="botao-reiniciar" onClick={reiniciarCronometro} title="Reiniciar ciclo atual">
            <RotateCcw size={22} /> Reiniciar
          </button>

          {(tempoFocoConfig !== 25 || tempoDescansoConfig !== 5) && (
            <button className="botao-encerrar" onClick={encerrarSessao}>
              Encerrar Sessão - Voltar ao pomodoro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}