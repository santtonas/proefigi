import './style.css';
import { Link } from 'react-router-dom';
import { Calendar, Target, TrendingUp, Clock4, Users, Timer, Settings, HelpCircle } from 'lucide-react';

interface NavProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

export default function Nav({ menuAberto, setMenuAberto }: NavProps) {
  return (
    <>
      {/* Fundo escuro ao abrir o menu */}
      {menuAberto && (
        <div className="nav-overlay" onClick={() => setMenuAberto(false)} />
      )}

      <nav className={`nav-lateral ${menuAberto ? 'aberto' : ''}`}>
        
        {/* Perfil */}
        <div className="nav-perfil">
          <div className="nav-avatar">
            <span>👤</span>
          </div>
          <span className="nav-nome">Olá, Paulo</span>
        </div>

        {/* Itens do menu */}
        <div className="nav-itens">
          <Link to="/inicio" className="nav-item" onClick={() => setMenuAberto(false)}>
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
          <Link to="/controle-pais" className="nav-item" onClick={() => setMenuAberto(false)}>
            <Users size={20}/>
            <span>Controle dos Pais</span>
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