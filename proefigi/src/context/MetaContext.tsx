import React, { createContext, useContext, useEffect, useState } from "react";
import {
  buscarMetas,
  criarMetas,
  atualizarMetas as atualizarMetaApi,
  excluirMeta as excluirMetaApi,
  atualizarItemchecklist,
} from "../services/metas";

export interface SubItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface Meta {
  id: string;
  titulo: string;
  tipo: string;
  cor: string;
  fixada?: boolean;
  concluida?: boolean;
  itens: SubItem[];
  total: number;
  concluidas: number;
}

interface MetaContextType {
  metas: Meta[];
  carregando: boolean;
  setMetas: (metas: Meta[]) => void;
  adicionarMeta: (
    meta: Omit<Meta, "id" | "total" | "concluidas">,
  ) => Promise<void>;
  atualizarMeta: (
    id: string,
    meta: Omit<Meta, "id" | "total" | "concluidas">,
  ) => Promise<void>;
  deletarMeta: (id: string) => Promise<void>;
  toggleItem: (metaId: string, itemId: string) => Promise<void>;
}

const MetaContext = createContext<MetaContextType | null>(null);

export function MetaProvider({ children }: { children: React.ReactNode }) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarMetas()
      .then((data) => {
        setMetas(data);
      })
      .catch(() => setMetas([]))
      .finally(() => setCarregando(false));
  }, []);

  async function adicionarMeta(
    meta: Omit<Meta, "id" | "total" | "concluidas">,
  ) {
    await criarMetas({
      titulo: meta.titulo,
      tipo: meta.tipo,
      cor: meta.cor,
      fixada: meta.fixada,
      concluida: meta.concluida,
      itens: meta.itens,
    });
    const atualizadas = await buscarMetas();
    setMetas(atualizadas);
  }

  async function atualizarMeta(
    id: string,
    meta: Omit<Meta, "id" | "total" | "concluidas">,
  ) {
    await atualizarMetaApi(id, {
      titulo: meta.titulo,
      tipo: meta.tipo,
      cor: meta.cor,
      fixada: meta.fixada,
      concluida: meta.concluida,
      itens: meta.itens,
    });
    setMetas((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...meta,
              total: meta.itens.length,
              concluidas: meta.itens.filter((i) => i.concluido).length,
            }
          : m,
      ),
    );
  }

  async function toggleItem(metaId: string, itemId: string) {
    const meta = metas.find((m) => m.id === metaId);
    if (!meta) return;

    const item = meta.itens.find((i) => i.id === itemId);
    if (!item) return;

    await atualizarItemchecklist(itemId, {
      texto: item.texto,
      concluido: !item.concluido,
    });

    setMetas((prev) =>
      prev.map((m) => {
        if (m.id !== metaId) return m;

        const novosItens = m.itens.map((i) =>
          i.id === itemId ? { ...i, concluido: !i.concluido } : i,
        );

        return {
          ...m,
          itens: novosItens,
          total: novosItens.length,
          concluidas: novosItens.filter((i) => i.concluido).length,
        };
      }),
    );
  }

  async function deletarMeta(id: string) {
    await excluirMetaApi(id);
    setMetas((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <MetaContext.Provider
      value={{
        metas,
        carregando,
        setMetas,
        adicionarMeta,
        atualizarMeta,
        deletarMeta,
        toggleItem,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
}

export function useMetas() {
  const context = useContext(MetaContext);
  if (!context)
    throw new Error("useMetas deve ser usado dentro do MetaProvider");
  return context;
}
