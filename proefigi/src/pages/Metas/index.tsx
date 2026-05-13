import { useState } from 'react';
import './style.css';
import { Plus, Trash2, Circle } from 'lucide-react';
import { useMetas } from '../../context/MetaContext';
import MetaCard from '../../components/Metacard';
import type { SubItem, Meta } from '../../context/MetaContext';

export default function Metas() {
  const { metas, adicionarMeta, atualizarMeta, deletarMeta, toggleItem } = useMetas(); // ✅ funções do backend

  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('#45B9FB');
  const opcoesCores = ['#45B9FB', '#f97316', '#a855f7'];

  const [novoItem, setNovoItem] = useState('');
  const [itens, setItens] = useState<SubItem[]>([]);

  const adicionarItem = () => {
    if (!novoItem.trim()) return;
    setItens([...itens, { id: Math.random().toString(), texto: novoItem, concluido: false }]);
    setNovoItem('');
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };


  const salvarMeta = async () => {
    if (!titulo.trim() || !tipo.trim()) return;

    await adicionarMeta({
      titulo,
      tipo,
      cor: corSelecionada,
      fixada: false,
      concluida: false,
      itens,
    });

    setTitulo(''); setTipo(''); setCorSelecionada('#45B9FB'); setItens([]); setModalAberto(false);
  };



  const excluirMeta = async (id: string) => {
    await deletarMeta(id);
  };


  const fixarMeta = async (id: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    if (!meta.fixada && metas.filter(m => m.fixada).length >= 3) {
      alert("Você só pode fixar no máximo 3 metas na Home!");
      return;
    }

    await atualizarMeta(id, { ...meta, fixada: !meta.fixada });
  };

  const concluirMeta = async (id: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    await atualizarMeta(id, { ...meta, concluida: !meta.concluida });
  };

  return (
    <div className="metas-pagina">
      <div className="metas-header">
        <h2>Minhas Metas</h2>
        <button className="botao-nova-meta" onClick={() => setModalAberto(true)}>
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      <div className="metas-lista">
        {metas.length === 0 ? (
          <div className="metas-vazio">
            <span>Nenhuma meta criada ainda.</span>
            <span>Clique em "Nova Meta" para começar!</span>
          </div>
        ) : (
          metas.map(meta => (
            <MetaCard
              key={meta.id}
              meta={meta}
              onExcluir={excluirMeta}
              onToggleItem={toggleItem}
              onFixar={fixarMeta}
              onConcluir={concluirMeta}
            />
          ))
        )}
      </div>

      {modalAberto && (
        <div className="modal-fundo" onClick={() => setModalAberto(false)}>
          <div className="modal-caixa" onClick={e => e.stopPropagation()}>
            <h3>Nova Meta</h3>

            <div className="grupo-input">
              <label>Título</label>
              <input type="text" placeholder="Ex: Estudar para a prova" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </div>

            <div className="grupo-input">
              <label>Tipo</label>
              <input
                type="text"
                placeholder="Ex: Trabalho, Pessoal, Faculdade..."
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <label>Cor da Tag</label>
              <div className="seletor-cores">
                {opcoesCores.map(cor => (
                  <button
                    key={cor}
                    className={`bola-cor ${corSelecionada === cor ? 'selecionada' : ''}`}
                    style={{ backgroundColor: cor }}
                    onClick={() => setCorSelecionada(cor)}
                    type="button"
                  />
                ))}
              </div>
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
                    <button onClick={() => removerItem(item.id)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="botoes-modal">
              <button className="botao-salvar" onClick={salvarMeta}>Salvar Meta</button>
              <button className="botao-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}