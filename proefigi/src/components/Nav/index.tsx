import './style.css';
import { Link } from 'react-router-dom';
import { Calendar, Target, Home, TrendingUp, Clock4, Timer, Settings, HelpCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface NavProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

export default function Nav({ menuAberto, setMenuAberto }: NavProps) {
  // 1. Criamos uma referência para o menu
  const menuRef = useRef<HTMLDivElement>(null);

  // 2. Criamos o "ouvinte" de cliques
  useEffect(() => {
    function lidarComCliqueFora(event: MouseEvent) {
      
      if (menuAberto && menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

      {/* Fundo escuro ao abrir o menu */}
      {menuAberto && (
        <div className="nav-overlay" onClick={() => setMenuAberto(false)} />
      )}

      <nav className={`nav-lateral ${menuAberto ? 'aberto' : ''}`} ref={menuRef}>
        
        {/* Perfil */}
        <div className="nav-perfil">
          <div className="nav-avatar">
            <span>👤</span>
          </div>
          <span className="nav-nome">Olá, Paulo</span>
        </div>

        {/* Itens do menu */}
        <div className="nav-itens">
          <Link to="/home" className="nav-item" onClick={() => setMenuAberto(false)}>
          <Home size={20}/>
          <span>Início</span>
          </Link>
          <Link to="/calendario" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Calendar size={20} />
            <span>Calendário</span>
          </Link>
          <Link to="/metas" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Target size={20}/>
            <span>Metas</span>
          </Link>
          <Link to="/progresso" className="nav-item" onClick={() => setMenuAberto(false)}>
            <TrendingUp size={20}/>
            <span>Meu Progresso</span>
          </Link>
          <Link to="/rotina" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Clock4 size={20}/>
            <span>Rotina Otimizada</span>
          </Link>
          <Link to="/pomodoro" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Timer size={20}/>
            <span>Pomodoro</span></Link>
        </div>

        

        {/* Rodapé do menu */}
        <div className="nav-rodape">
          <Link to="/configuracoes" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Settings size={20}/>
            <span>Configurações</span>
          </Link>
          <Link to="/ajuda" className="nav-item" onClick={() => setMenuAberto(false)}>
            <HelpCircle size={20}/>
            <span>Central de ajuda</span>
          </Link>
        </div>

      </nav>
    </>
  );
}