import "./style.css";
import { Link } from "react-router-dom";
import {
  Calendar,
  Target,
  Home,
  TrendingUp,
  Clock4,
  Timer,
  Settings,
  HelpCircle,
  Lock
} from "lucide-react";
import { useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext"; 

interface NavProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

export default function Nav({ menuAberto, setMenuAberto }: NavProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Consumindo os dados dinâmicos do contexto global
  const { nome, foto } = useUser();

  useEffect(() => {
    function lidarComCliqueFora(event: MouseEvent) {
      if (
        menuAberto &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("click", lidarComCliqueFora);

    return () => {
      document.removeEventListener("click", lidarComCliqueFora);
    };
  }, [menuAberto, setMenuAberto]);

  return (
    <>
      <nav
        className={`nav-lateral ${menuAberto ? "aberto" : ""}`}
        ref={menuRef}
      >
        {/* ÁREA DO PERFIL TRANSFORMA-DA EM LINK CLICÁVEL */}
        <Link
          to="/configuracoes"
          state={{ abrirConta: true }} // <-- Envia o comando para a tela de configurações
          className="nav-perfil"
          onClick={() => setMenuAberto(false)} // Fecha a nav ao clicar
        >
          <div className="nav-avatar">
            {foto ? (
              <img
                src={foto}
                alt={`Foto de ${nome}`}
                className="nav-avatar-img"
              />
            ) : (
              <span className="nav-avatar-inicial">
                {nome.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="nav-nome">Olá, {nome}</span>
        </Link>

        {/* Itens do menu */}
        <div className="nav-itens">
          <Link
            to="/home"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Home size={20} />
            <span>Início</span>
          </Link>
          <Link
            to="/calendario"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Calendar size={20} />
            <span>Calendário</span>
          </Link>
          <Link
            to="/metas"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Target size={20} />
            <span>Metas</span>
          </Link>
          <Link
            to="/progresso"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <TrendingUp size={20} />
            <span>Meu Progresso</span>
          </Link>
          <Link
            to="/rotina"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Clock4 size={20} />
            <span>Rotina Otimizada</span>
          </Link>
          <Link
            to="/pomodoro"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Timer size={20} />
            <span>Pomodoro</span>
          </Link>
          <Link
          to="/restricao"
          className="nav-item"
          onClick={() => setMenuAberto(false)}
          >
            <Lock size={20}/>
            <span>Bloqueador</span>
          </Link>
        </div>

        {/* Rodapé do menu */}
        <div className="nav-rodape">
          <Link
            to="/configuracoes"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
          <Link
            to="/ajuda"
            className="nav-item"
            onClick={() => setMenuAberto(false)}
          >
            <HelpCircle size={20} />
            <span>Central de ajuda</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
