import './style.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function Header(){
    const [menuAberto, setMenuAberto] = useState(false);
    return(
        <header className="cabecalho-principal">
            <Link className="Nome" to="/Tela_inicial">Proefigi</Link>
            <button 
             className={`botao-hamburger ${menuAberto ? 'aberto' : ''}`} 
             onClick={() => setMenuAberto(!menuAberto)}
            >
            <span className="linha"></span>
            <span className="linha"></span>
            <span className="linha"></span>
            </button>

        
        </header>
    )
}

export default Header;