import React, { useState } from 'react';
import "./restricao.css"; //

const Restricao: React.FC = () => { 
  const [site, setSite] = useState('');
  const [sitesBloqueados, setSitesBloqueados] = useState([
    { id: 1, nome: 'facebook.com', ativo: true },
  ]);

  const sugestoes = ['youtube.com', 'tiktok.com', 'x.com', 'netflix.com'];

  const adicionarSite = () => {
    if (site.trim() !== '') {
      setSitesBloqueados([...sitesBloqueados, { id: Date.now(), nome: site, ativo: true }]);
      setSite('');
    }
  };

  const alternarStatus = (id: number) => {
    setSitesBloqueados(sitesBloqueados.map(s => 
      s.id === id ? { ...s, ativo: !s.ativo } : s
    ));
  };

  return (
    <div className="container-restricao">
      <div className="restricao-card">
        <h1> Restrições </h1>
        <p className="subtitle">Gerencie os sites que tiram sua atenção</p>

        <div className="form-group">
          <label>Bloquear novo site</label>
          <div className="input-with-button">
            <input 
              type="text" 
              placeholder="Ex: instagram.com" 
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
            <button className="btn-add" onClick={adicionarSite}>+</button>
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
                  onChange={() => alternarStatus(s.id)} 
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