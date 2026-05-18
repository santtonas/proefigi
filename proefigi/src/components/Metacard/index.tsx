import { Trash2, CheckCircle2, Circle, Pin, CheckCircle, Pencil } from 'lucide-react';
import type { Meta } from '../../context/MetaContext';
import './style.css';

interface MetaCardProps {
  meta: Meta;
  compacto?: boolean;
  onExcluir?: (id: string) => void;
  onToggleItem?: (metaId: string, itemId: string) => void;
  onFixar?: (id: string) => void;
  onConcluir?: (id: string) => void;
  onEditar?: (meta: Meta) => void; // ← novo
}

export default function MetaCard({ meta, compacto = false, onExcluir, onToggleItem, onFixar, onConcluir, onEditar }: MetaCardProps) {
  const porcentagem = meta.total > 0 ? Math.round((meta.concluidas / meta.total) * 100) : 0;

  return (
    <div className={`meta-card ${compacto ? 'compacto' : ''} ${meta.concluida ? 'meta-concluida' : ''}`}>
      <div className="meta-card-header">
        <div className="meta-card-titulo">
          <span className="meta-tipo-badge" style={{ backgroundColor: meta.cor }}>
            {meta.tipo}
          </span>
          <strong>{meta.titulo}</strong>
        </div>

        {/* Botões apenas na tela de Metas (não compacto) */}
        {!compacto && (
          <div className="meta-card-acoes">
            {onFixar && (
              <button
                className={`botao-acao-meta ${meta.fixada ? 'fixado' : ''}`}
                onClick={() => onFixar(meta.id)}
                title={meta.fixada ? "Remover da Home" : "Fixar na Home"}
              >
                <Pin size={18} fill={meta.fixada ? "currentColor" : "none"} />
              </button>
            )}
            {onConcluir && (
              <button
                className={`botao-acao-meta ${meta.concluida ? 'concluido' : ''}`}
                onClick={() => onConcluir(meta.id)}
                title={meta.concluida ? "Reabrir Meta" : "Concluir Meta"}
              >
                <CheckCircle size={18} />
              </button>
            )}
            {onEditar && (
              <button
                className="botao-acao-meta"
                onClick={() => onEditar(meta)}
                title="Editar Meta"
              >
                <Pencil size={18} />
              </button>
            )}
            {onExcluir && (
              <button className="botao-excluir-meta" onClick={() => onExcluir(meta.id)} title="Excluir">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="meta-progresso">
        <div className="meta-progresso-barra">
          <div
            className="meta-progresso-preenchimento"
            style={{ width: `${porcentagem}%`, backgroundColor: meta.cor }}
          />
        </div>
        <span className="meta-progresso-texto">{meta.concluidas}/{meta.total}</span>
      </div>

      {!compacto && (
        <div className="meta-checklist">
          {meta.itens.map(item => (
            <div
              key={item.id}
              className={`meta-item ${item.concluido ? 'concluido' : ''}`}
              onClick={() => !meta.concluida && onToggleItem && onToggleItem(meta.id, item.id)}
            >
              {item.concluido ? (
                <CheckCircle2 size={18} color={meta.cor} />
              ) : (
                <Circle size={18} color="#94a3b8" />
              )}
              <span>{item.texto}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}