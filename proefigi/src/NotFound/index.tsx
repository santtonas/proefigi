import { useNavigate } from "react-router-dom";
import "./notFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        
        <h2 className="not-found-title">Página não encontrada</h2>
        
        <p className="not-found-text">
          Ops! O caminho que você tentou acessar não existe ou foi movido. 
          Vamos voltar para um lugar seguro?
        </p>

        <div className="not-found-buttons">
          <button className="btn-not-found-home" onClick={() => navigate("/home")}>
            Voltar para o Início
          </button>
          <button className="btn-not-found-back" onClick={() => navigate(-1)}>
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
}