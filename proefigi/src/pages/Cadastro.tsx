import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cadastro.css"
import logo from "../img/icoproefigi.png";
import { cadastro } from "../services/cadastro";

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function validar(): string {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim())
      return "Preencha todos os campos.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (senha !== confirmarSenha) return "As senhas não coincidem.";
    return "";
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
 
    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }
    
    try {
      setErro("");
      setCarregando(true);
      
      await cadastro(nome, email, senha);

      setSucesso(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message || "Erro ao criar conta.");
      } else if (typeof err === "string") {
        setErro(err);
      } else {
        setErro("Erro ao criar conta.");
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container-register">

      <div className="register-card">
        
        {/* 🚀 LOGO INTERNA: Movida para o topo do container do card */}
        <div className="logo">
          <img src={logo} alt="Logo Proefigi" />
        </div>

        <h1>Criar Conta</h1>

        {/* Mensagem de Erro visível na tela caso exista */}
        {erro && (
          <p className="error-message-login" style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'left' }}>
            {erro}
          </p>
        )}
        
        {/* Mensagem de Sucesso visível na tela */}
        {sucesso && (
          <p className="success-message-login" style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'center' }}>
            Conta criada com sucesso! Redirecionando...
          </p>
        )}
 
        <form className="register-form" onSubmit={handleCadastro} noValidate>
          <input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button
            type="submit"
            className="btn-register"
            disabled={carregando || sucesso}
          >
            {carregando ? "Cadastrando..." : "Finalizar Cadastro"}
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