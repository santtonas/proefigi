import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2,  } from 'lucide-react';
import "./recuperarSenha.css";


const RecuperarSenha: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validarEmail = (): boolean => {
    if (!email.trim()) {
      setErro("Por favor, preencha o campo de e-mail.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("Insira um endereço de e-mail válido.");
      return false;
    }
    return true;
  };

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarEmail()) return;

    setErro("");
    setCarregando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSucesso(true);
    } catch (error) {
      console.error(error);
      setErro("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="page-recuperar-wrapper">
      
      {/* 🚀 NAVBAR EXCLUSIVA E MINIMALISTA */}
      <nav className="nav-autenticacao">
        <div className="nav-auth-container">
          <div className="nav-auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
           
            <span>Proefigi</span>
          </div>
          <div className="nav-auth-links">
            
            <button className="nav-auth-btn-primario" onClick={() => navigate('/')}>
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO CENTRAL DA TELA */}
      <div className="container-recuperar">
        <div className="recuperar-card">
          <button className="btn-voltar" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Voltar para o login
          </button>

          {!sucesso ? (
            <>
              <h1>Recuperar Senha</h1>
              <p className="subtitle-recuperar">
                Insira o e-mail associado à sua conta e enviaremos um link para você redefinir sua senha.
              </p>

              {erro && <p className="error-message-recuperar">{erro}</p>}

              <form onSubmit={handleRecuperar}>
                <div className="input-group-recuperar">
                  <Mail size={18} className="input-icon-recuperar" />
                  <input 
                    type="email" 
                    placeholder="Digite seu e-mail cadastrado" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={carregando}
                  />
                </div>

                <button type="submit" className="btn-enviar-link" disabled={carregando}>
                  {carregando ? "Enviando..." : "Enviar Link de Recuperação"}
                </button>
              </form>
            </>
          ) : (
            <div className="sucesso-container">
              <CheckCircle2 size={56} className="icon-sucesso" />
              <h1>E-mail Enviado!</h1>
              <p className="subtitle-recuperar">
                Enviamos um link de redefinição de senha para o endereço <strong>{email}</strong>. 
                Verifique sua caixa de entrada.
              </p>
              <button className="btn-entendido" onClick={() => navigate('/')}>
                Ir para o Login
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RecuperarSenha;