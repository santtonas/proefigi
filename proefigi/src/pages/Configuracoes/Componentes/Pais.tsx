import { useUser } from "../../../context/UserContext";
import { Crown, Eye, Ban, ArrowLeft, Clock4 } from "lucide-react";
import "./Pais.css";

interface ControlePaisProps {
  aoVoltar: () => void;
  aoIrParaPremium: () => void;
}

export default function ControlePais({
  aoVoltar,
  aoIrParaPremium,
}: ControlePaisProps) {
  const { plano } = useUser();

 
  if (plano !== "Premium") {
    return (
      <div className="config-box-vertical animacao-tela-nova">
        <button
          className="btn-voltar-pais"
          onClick={aoVoltar}
          style={{ marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Voltar para configurações
        </button>
        <div className="premium-card-paywall">
          <div className="badge-premium-tag">
            <Crown size={14} fill="#eab308" color="#eab308" />
            <span>RECURSO PREMIUM</span>
          </div>

          <h1 className="painel-titulo" style={{ marginTop: "12px" }}>
            Controle dos Pais
          </h1>
          <p className="painel-subtitulo">
            Gerencie e proteja a jornada de aprendizado do seu filho com
            ferramentas exclusivas.
          </p>

          
          <div className="premium-beneficios-lista">
            <div className="beneficio-item">
              <div className="beneficio-icone-wrapper">
                <Eye size={20} color="#007eb5" />
              </div>
              <div className="beneficio-texto">
                <strong>Progresso em Tempo Real</strong>
                <p>
                  Acompanhe cada evolução, acerto e tempo de estudo do seu filho
                  no exato momento em que acontece.
                </p>
              </div>
            </div>

            <div className="beneficio-item">
              <div className="beneficio-icone-wrapper">
                <Ban size={20} color="#007eb5" />
              </div>
              <div className="beneficio-texto">
                <strong>Bloqueador de Distrações</strong>
                <p>
                  Mantenha o foco total bloqueando abas, notificações e
                  conteúdos que tiram a atenção dos estudos.
                </p>
              </div>
            </div>

            <div className="beneficio-item">
              <div className="beneficio-icone-wrapper">
                <Clock4 size={20} color="#007eb5" />
              </div>
              <div className="beneficio-texto">
                <strong>Rotina Otimizada</strong>
                <p>
                  Funcionalidade para facilitar a organização das tarefas mais
                  recorrentes adicionando por dias seguidos, semanas ou meses de
                  forma automática no calendário.
                </p>
              </div>
            </div>
          </div>

          {/* BOTÃO DE UPGRADE */}
          <button
            className="btn-primario btn-upgrade-premium"
            onClick={aoIrParaPremium}
            style={{ width: "100%", marginTop: "32px" }}
          >
            Quero ser Premium
          </button>
        </div>
      </div>
    );
  }
}
