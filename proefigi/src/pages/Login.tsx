
import {login} from "../services/cadastro";
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

  function validar(): string{
    if(!email.trim() || !senha.trim()) 
      return "Preencha todos os campos.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
      return "E-mail inválido.";
    if(senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    return "";
  }

  async function handleLogin(){
   
    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setErro("");
    setCarregando(true);

    try{
      const dados = await login(email, senha);

      localStorage.setItem("token", dados.token);
      navigate("/home");
    }catch (err: any) {
      setErro(err.message || "E-mail ou senha incorretos.");
    }finally{
      setCarregando(false);
    }
  }
  function handleGoogle() {
    // Conecte ao provedor OAuth do backend aqui
    alert("Login com Google ainda não implementado.");
  }


  return (

  <div className="container">


  <div className="logo">
    <img src={logo} alt="Logo" />
  </div>

  <div className="overlay"></div>

      <div className="login-card">

        <h1>Entrar</h1>

        <input type="email" 
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

          <div className="buttons">
          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? "Acessando..." : "Acessar"}
          </button>
          <button className="btn-google" onClick={handleGoogle}>
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