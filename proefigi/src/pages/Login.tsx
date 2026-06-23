import { login } from "../services/cadastro";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../styles/login.css";
import logo from "../img/icoproefigi.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validar(): string {
    if (!email.trim() || !senha.trim()) 
      return "Preencha todos os campos.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "E-mail inválido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    return "";
  }

  async function handleLogin() {
    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      const dados = await login(email, senha);
      localStorage.setItem("token", dados.token);
      navigate("/home");
    } catch (err: unknown) {
      setErro((err as Error).message || "E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  }

  function handleGoogle() {
    alert("Login com Google ainda não implementado.");
  }

  function handleEsqueciSenha() {
    navigate("/recuperar-senha");
  }

  return (
    <div className="container">
      
      <div className="login-card">
        
        
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <h1>Entrar</h1>

        {/* Mensagem de Erro visível na tela caso exista */}
        {erro && (
          <p className="error-message-login" style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'left' }}>
            {erro}
          </p>
        )}

        <input 
          type="email" 
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {/* Link de Esqueci minha senha */}
        <div className="forgot-password-container">
          <button type="button" className="lnk-forgot" onClick={handleEsqueciSenha}>
            Esqueci minha senha
          </button>
        </div>

        <div className="buttons">
          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? "Acessando..." : "Acessar"}
          </button>
          
          {/* 🚀 BOTÃO DO GOOGLE COM ÍCONE OFICIAL INSERIDO */}
          <button className="btn-google" onClick={handleGoogle}>
  <img 
    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/google/google-original.svg" 
    alt="Google logo" 
    style={{ width: '18px', height: '18px' }} 
  />
  Entrar com Google
</button>
        </div>

        <p className="footer-text">
          Não tem uma conta? <a href="/cadastro">Cadastre-se aqui</a>
        </p>
      </div>

    </div>
  )
}