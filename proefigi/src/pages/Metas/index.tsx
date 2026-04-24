import { useState } from 'react';
import './style.css';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

type TipoMeta = 'estudo' | 'tarefas' | 'materias';

interface SubItem {
  id: string;
  texto: string;
  concluido: boolean;
}

interface Meta {
  id: string;
  titulo: string;
  tipo: TipoMeta;
  itens: SubItem[];
}

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoMeta>('estudo');
  const [novoItem, setNovoItem] = useState('');
  const [itens, setItens] = useState<SubItem[]>([]);

  const adicionarItem = () => {
    if (!novoItem.trim()) return;
    setItens([...itens, {
      id: Math.random().toString(),
      texto: novoItem,
      concluido: false
    }]);
    setNovoItem('');
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const salvarMeta = () => {
    if (!titulo.trim()) return;
    const novaMeta: Meta = {
      id: Math.random().toString(),
      titulo,
      tipo,
      itens
    };
    setMetas([...metas, novaMeta]);
    setTitulo('');
    setTipo('estudo');
    setItens([]);
    setModalAberto(false);
  };

  const toggleItem = (metaId: string, itemId: string) => {
    setMetas(metas.map(m => {
      if (m.id !== metaId) return m;
      return {
        ...m,
        itens: m.itens.map(i =>
          i.id === itemId ? { ...i, concluido: !i.concluido } : i
        )
      };
    }));
  };

  const excluirMeta = (id: string) => {
    setMetas(metas.filter(m => m.id !== id));
  };

  const tipoLabel = (tipo: TipoMeta) => {
    if (tipo === 'estudo') return { label: 'Estudo', cor: '#45B9FB' };
    if (tipo === 'tarefas') return { label: 'Tarefas', cor: '#f97316' };
    return { label: 'Matérias', cor: '#a855f7' };
  };

  return (
    <div className="metas-pagina">
      {/* Header Fixo */}
      <div className="metas-header">
        <h2>Minhas Metas</h2>
        <button className="botao-nova-meta" onClick={() => setModalAberto(true)}>
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      {/* Área de conteúdo com Scroll */}
      <div className="metas-lista">
        {metas.length === 0 ? (
          <div className="metas-vazio">
            <span>Nenhuma meta criada ainda.</span>
            <span>Clique em "Nova Meta" para começar!</span>
          </div>
        ) : (
          metas.map(meta => {
            const concluidos = meta.itens.filter(i => i.concluido).length;
            const total = meta.itens.length;
            const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;
            const { label, cor } = tipoLabel(meta.tipo);

            return (
              <div key={meta.id} className="meta-card">
                <div className="meta-card-header">
                  <div className="meta-card-titulo">
                    <span className="meta-tipo-badge" style={{ backgroundColor: cor }}>
                      {label}
                    </span>
                    <strong>{meta.titulo}</strong>
                  </div>
                  <button className="botao-excluir-meta" onClick={() => excluirMeta(meta.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="meta-progresso">
                  <div className="meta-progresso-barra">
                    <div
                      className="meta-progresso-preenchimento"
                      style={{ width: `${porcentagem}%`, backgroundColor: cor }}
                    />
                  </div>
                  <span className="meta-progresso-texto">{concluidos}/{total}</span>
                </div>

                <div className="meta-checklist">
                  {meta.itens.map(item => (
                    <div
                      key={item.id}
                      className={`meta-item ${item.concluido ? 'concluido' : ''}`}
                      onClick={() => toggleItem(meta.id, item.id)}
                    >
                      {item.concluido
                        ? <CheckCircle2 size={18} color={cor} />
                        : <Circle size={18} color="#94a3b8" />
                      }
                      <span>{item.texto}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal permanece igual */}
      {modalAberto && (
        <div className="modal-fundo" onClick={() => setModalAberto(false)}>
          <div className="modal-caixa" onClick={e => e.stopPropagation()}>
            <h3>Nova Meta</h3>
            <div className="grupo-input">
              <label>Título</label>
              <input
                type="text"
                placeholder="Ex: Estudar para a prova"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
              />
            </div>
            <div className="grupo-input">
              <label>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as TipoMeta)}>
                <option value="estudo">Estudo</option>
                <option value="tarefas">Tarefas</option>
                <option value="materias">Matérias</option>
              </select>
            </div>
            <div className="grupo-input">
              <label>Itens do checklist</label>
              <div className="input-adicionar-item">
                <input
                  type="text"
                  placeholder="Ex: Ler capítulo 1"
                  value={novoItem}
                  onChange={e => setNovoItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && adicionarItem()}
                />
                <button onClick={adicionarItem}><Plus size={18} /></button>
              </div>
              <div className="itens-preview">
                {itens.map(item => (
                  <div key={item.id} className="item-preview">
                    <Circle size={16} color="#94a3b8" />
                    <span>{item.texto}</span>
                    <button onClick={() => removerItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="botoes-modal">
              <button className="botao-salvar" onClick={salvarMeta}>Salvar</button>
              <button className="botao-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}