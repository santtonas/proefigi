import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, Check, X, Plus } from 'lucide-react'; // 🚀 Importando os novos ícones
import "./restricao.css";

// 🚀 Adicionado: Interface para o componente aceitar a propriedade 'compacto'
interface RestricaoProps {
  compacto?: boolean;
}

interface Site {
  id: number;
  nome: string;
  ativo: boolean;
}

// 🚀 Alterado: Agora o componente recebe 'compacto' (que por padrão é false)
const Restricao: React.FC<RestricaoProps> = ({ compacto = false }) => {
  const [site, setSite] = useState('');
  const [sitesBloqueados, setSitesBloqueados] = useState<Site[]>([]);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [nomeEditado, setNomeEditado] = useState('');

  const sugestoes = ['youtube.com', 'tiktok.com', 'twitter.com', 'netflix.com'];

  useEffect(() => {
    const salvos = localStorage.getItem('@proefigi:sites');
    if (salvos) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSitesBloqueados(JSON.parse(salvos));
    } else {
      setSitesBloqueados([
        { id: 1, nome: 'facebook.com', ativo: true },
        { id: 2, nome: 'instagram.com', ativo: true }
      ]);
    }
  }, []);

  useEffect(() => {
    if (sitesBloqueados.length > 0) {
      localStorage.setItem('@proefigi:sites', JSON.stringify(sitesBloqueados));
    }
  }, [sitesBloqueados]);

  const adicionarSite = () => {
    if (site.trim() !== '') {
      const novoSite: Site = { id: Date.now(), nome: site.toLowerCase(), ativo: true };
      setSitesBloqueados([...sitesBloqueados, novoSite]);
      setSite('');
    }
  };

  const alternarStatus = (id: number) => {
    setSitesBloqueados(sitesBloqueados.map(s => 
      s.id === id ? { ...s, ativo: !s.ativo } : s
    ));
  };

  const excluirSite = (id: number) => {
    const novaLista = sitesBloqueados.filter(s => s.id !== id);
    setSitesBloqueados(novaLista);
    if (novaLista.length === 0) localStorage.removeItem('@proefigi:sites');
  };

  const iniciarEdicao = (id: number, nomeAtual: string) => {
    setIdEditando(id);
    setNomeEditado(nomeAtual);
  };

  const salvarEdicao = (id: number) => {
    if (nomeEditado.trim() !== '') {
      setSitesBloqueados(sitesBloqueados.map(s => 
        s.id === id ? { ...s, nome: nomeEditado.toLowerCase() } : s
      ));
      setIdEditando(null);
    }
  };

  return (
    // 🚀 Alterado: Adiciona a classe 'modo-compacto' se a prop for true
    <div className={`container-restricao ${compacto ? 'modo-compacto' : ''}`}>
      <div className="restricao-card">
        
        {/* 🚀 Oculta o título e subtítulo se for compacto */}
        {!compacto && (
          <>
            <h1>Foco Total</h1>
            <p className="subtitle">Gerencie os sites que tiram sua atenção</p>
          </>
        )}

        <div className="form-group">
          <label>Bloquear novo site</label>
          <div className="input-with-button">
            <input 
              type="text" 
              placeholder="Ex: reddit.com" 
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
            {/* 🚀 Trocamos o + pelo ícone Plus */}
            <button className="btn-add" onClick={adicionarSite}>
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* 🚀 Oculta as sugestões comuns se for compacto */}
        {!compacto && (
          <div className="suggestions">
            <label>Sugestões comuns:</label>
            <div className="suggestion-tags">
              {sugestoes.map((sug, i) => (
                <span key={i} className="tag" onClick={() => setSite(sug)}>{sug}</span>
              ))}
            </div>
          </div>
        )}

        {!compacto && <hr className="divider" />}

        <div className="sites-list">
          <label>Sua lista de restrições:</label>
          {sitesBloqueados.map((s) => (
            <div key={s.id} className="site-item">
              
              {idEditando === s.id ? (
                /* Modo de Edição */
                <div className="edit-inline-container">
                  <input 
                    type="text" 
                    className="input-edit-inline"
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                  />
                  {/* 🚀 Ícones de Confirmar e Cancelar na edição */}
                  <button className="btn-save-inline" onClick={() => salvarEdicao(s.id)}>
                    <Check size={18} />
                  </button>
                  <button className="btn-cancel-inline" onClick={() => setIdEditando(null)}>
                    <X size={18} />
                  </button>
                </div>
              ) : (
                /* Modo de Visualização Normal */
                <>
                  <span className={s.ativo ? 'site-name' : 'site-name disabled'}>{s.nome}</span>
                  
                  <div className="actions-right">
                    {/* 🚀 Ícones de Lápis e Lixeira */}
                    <button className="btn-action-icon edit" onClick={() => iniciarEdicao(s.id, s.nome)} title="Editar site">
                      <Pencil size={16} />
                    </button>
                    <button className="btn-action-icon delete" onClick={() => excluirSite(s.id)} title="Excluir site">
                      <Trash2 size={16} />
                    </button>
                    
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={s.ativo} 
                        onChange={() => alternarStatus(s.id)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>

        {/* 🚀 Oculta o botão inferior de confirmação se for compacto */}
        {!compacto && (
          <button className="btn-save-restricao" onClick={() => alert('Configurações salvas no seu navegador!')}>
            Confirmar Configurações
          </button>
        )}
      </div>
    </div>
  );
};

export default Restricao;