import './style.css';
import { Link } from 'react-router-dom';

function Header(){
    return(
        <header>
            <Link className="Nome" to="/Tela_inicial">Proefigi</Link>
        </header>
    )
}

export default Header;