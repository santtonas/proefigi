import './style.css';
import { X, Home, Calendar, Settings, LogOut } from 'lucide-react'; 

// Isso avisa ao TypeScript que o Nav também vai receber as informações
interface NavProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

function Nav({ menuAberto, setMenuAberto }: NavProps) {
  return (
    <>
      {menuAberto && (
        <div className="overlay-menu" onClick={() => setMenuAberto(false)}></div>
      )}

      <nav className={`sidebar ${menuAberto ? 'aberta' : ''}`}>
        <div className="sidebar-cabecalho">
          <h2>Menu</h2>
          
        </div>

        <ul className="sidebar-links">
          <li><a href="#"><Home size={20} /> Início</a></li>
          <li><a href="#"><Calendar size={20} /> Minhas Tarefas</a></li>
          <li><a href="#"><Settings size={20} /> Configurações</a></li>
        </ul>

        <div className="sidebar-rodape">
          <button className="botao-sair"><LogOut size={20} /> Sair</button>
        </div>
      </nav>
    </>
  );
}

export default Nav;