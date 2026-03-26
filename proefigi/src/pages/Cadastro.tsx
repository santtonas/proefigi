import React from 'react';
import "../styles/cadastro.css"
import logo from "../img/icoproefigi.png";
import { Link } from "react-router-dom";

const Cadastro: React.FC = () => {
  return (
    <div className="container-register">
      {/* Opcional: Se quiser manter o logo flutuando como no login */}
      <div className="logo-register">
        <img src={logo} alt="Logo Proefigi" />
      </div>

      <div className="overlay"></div>

      <div className="register-card">
        <h1>Criar Conta</h1>
        
        <form className="register-form">
          <input type="text" placeholder="Nome Completo" />
          <input type="email" placeholder="Digite seu e-mail" />
          <input type="password" placeholder="Crie uma senha" />
          <input type="password" placeholder="Confirme sua senha" />

          <button type="submit" className="btn-register">
            Finalizar Cadastro
          </button>
        </form>

        <p className="footer-text">
             Já possui uma conta? <Link to="/">Faça login aqui</Link>
      </p> 
      </div>
    </div>
  );
};

export default Cadastro;