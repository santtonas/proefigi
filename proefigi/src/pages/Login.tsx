import "../styles/login.css"
import logo from "../img/icoproefigi.png"

export default function Login() {
  return (

<div className="container">


<div className="logo">
  <img src={logo} alt="Logo" />
</div>

<div className="overlay"></div>

      <div className="login-card">

        <h1>Entrar</h1>

        <input type="email" placeholder="Digite seu email" />
        <input type="password" placeholder="Digite sua senha" />

        <div className="buttons">
          <button className="btn-primary">
            Acessar
          </button>

          <button className="btn-google">
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