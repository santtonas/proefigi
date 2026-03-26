import './style.css';
import { Link } from 'react-router-dom';

// 1. Avisamos ao arquivo que ele vai receber essas duas informações do Layout
interface HeaderProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

// 2. Colocamos as propriedades aqui dentro dos parênteses
function Header({ menuAberto, setMenuAberto }: HeaderProps) {
  
  return (
    <header className="cabecalho-principal">
      <Link className="Nome" to="/">Proefigi</Link>
      
      <button 
        className={`botao-hamburger ${menuAberto ? 'aberto' : ''}`}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <span className="linha"></span>
        <span className="linha"></span>
        <span className="linha"></span>
      </button>

    </header>
  );
}

export default Header;