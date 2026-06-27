import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./redefinirSenha.css"; 

export default function RedefinirSenha() {
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function validar(): string {
    if (!novaSenha.trim() || !confirmarSenha.trim())
      return "Preencha todos os campos.";
    if (novaSenha.length < 6) 
      return "A senha deve ter pelo menos 6 caracteres.";
    if (novaSenha !== confirmarSenha) 
      return "As senhas não coincidem.";
    return "";
  }

  async function handleRedefinir(e: React.FormEvent) {
    e.preventDefault();

    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      // Aqui depois você chama o seu serviço da API para salvar a nova senha
      // await redefinirSenhaService(novaSenha); 

      setSucesso(true);
      // Redireciona para o login após 2 segundos
      setTimeout(() => navigate("/"), 2000);
    } catch (err: unknown) {
      setErro((err as Error).message || "Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container-redefinir">
      <div className="redefinir-card">
        <h1>Nova Senha</h1>
        <p className="subtitulo">Digite e confirme sua nova senha de acesso.</p>

        {erro && (
          <p className="error-message-login" style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'left' }}>
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="success-message-login" style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
            Senha alterada com sucesso! Redirecionando para o login...
          </p>
        )}

        <form onSubmit={handleRedefinir} noValidate>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <button
            type="submit"
            className="btn-redefinir"
            disabled={carregando || sucesso}
          >
            {carregando ? "Salvando..." : "Salvar Nova Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}