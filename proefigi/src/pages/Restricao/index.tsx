import React, { useState } from 'react';
import "./restricao.css"; 
import {useRestricoes} from '../../context/RestricaoContext';

interface RestricaoProps {
  compacto?: boolean;
}

const Restricao: React.FC<RestricaoProps> = ({ compacto = false }) => { 
  const [site, setSite] = useState('');
  
  // PEGANDO OS DADOS DO CONTEXTO GLOBAL AQUI 👇
  const { sitesBloqueados, sugestoes, adicionarSite, alternarStatus } = useRestricoes();

  const handleAdicionar = () => {
    if (site.trim() !== '') {
      adicionarSite(site);
      setSite('');
    }
  };

  return (
    <div className={`container-restricao ${compacto ? 'modo-compacto' : ''}`}>
      <div className="restricao-card">
        {!compacto && <h1> Restrições </h1>}
        {!compacto && <p className="subtitle">Gerencie os sites que tiram sua atenção</p>}
        {compacto && <h3 style={{ marginBottom: '15px', color: '#0F172A' }}>Restrições</h3>}

        <div className="form-group">
          <label>Bloquear novo site</label>
          <div className="input-with-button">
            <input 
              type="text" 
              placeholder="Ex: instagram.com" 
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
            {/* Atualizado para chamar a função local que limpa o input */}
            <button className="btn-add" onClick={handleAdicionar}>+</button> 
          </div>
        </div>

        <div className="suggestions">
          <label>Sugestões comuns:</label>
          <div className="suggestion-tags">
            {sugestoes.map((sug, i) => (
              <span key={i} className="tag" onClick={() => setSite(sug)}>{sug}</span>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="sites-list">
          <label>Sua lista de restrições:</label>
          {sitesBloqueados.map((s) => (
            <div key={s.id} className="site-item">
              <span className={s.ativo ? 'site-name' : 'site-name disabled'}>{s.nome}</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={s.ativo} 
                  onChange={() => alternarStatus(s.id)} // Puxando do contexto
                />
                <span className="slider round"></span>
              </label>
            </div>
          ))}
        </div>

        <button className="btn-save-restricao">Salvar Configurações</button>
      </div>
    </div>
  );
};

export default Restricao; // Exportando no singular