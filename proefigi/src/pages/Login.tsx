import "./login.css"
import ParticlesBackground from "../components/ParticlesBackground.tsx"



export default function Login() {
  return (
    <div className="container">

      <ParticlesBackground />

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

      </div>

    </div>
  )
}