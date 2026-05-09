import React, { createContext, useContext, useEffect, useState } from "react";
import {
  buscarTarefas,
  criarTarefa,
  atualizarTarefa as atualizarTarefaApi,
  excluirTarefa as excluirTarefaApi,
} from "../services/calendario";

interface Tarefa {
  id: string;
  data: string;
  titulo: string;
  inicio: string;
  termino: string;
  importancia: "normal" | "importante" | "urgente";
  descricao: string;
  concluida?: boolean;
}

interface TarefaContextType {
  tarefas: Tarefa[];
  carregando: boolean;
  adicionarTarefa: (tarefa: Omit<Tarefa, "id">) => Promise<void>;
  atualizarTarefa: (id: string, campos: Partial<Tarefa>) => Promise<void>;
  excluirTarefa: (id: string) => Promise<void>;
}

const TarefaContext = createContext<TarefaContextType | null>(null);

export function TarefaProvider({ children }: { children: React.ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca tarefas do backend ao carregar
  useEffect(() => {
    buscarTarefas()
      .then(setTarefas)
      .catch(() => setTarefas([]))
      .finally(() => setCarregando(false));
  }, []);

  async function adicionarTarefa(tarefa: Omit<Tarefa, "id">) {
    await criarTarefa({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      data: tarefa.data,
      inicio: tarefa.inicio,
      termino: tarefa.termino,
      importancia: tarefa.importancia,
      concluida: tarefa.concluida ?? false,
    });
    const atualizadas = await buscarTarefas();
    setTarefas(atualizadas ?? []);
  }

  async function atualizarTarefa(id: string, campos: Partial<Tarefa>) {
    const tarefaAtual = tarefas.find((t) => t.id === id);
    if (!tarefaAtual) return;

    const tarefaMerged = { ...tarefaAtual, ...campos };

    await atualizarTarefaApi(id, {
      titulo: tarefaMerged.titulo,
      descricao: tarefaMerged.descricao,
      data: tarefaMerged.data,
      inicio: tarefaMerged.inicio,
      termino: tarefaMerged.termino,
      importancia: tarefaMerged.importancia,
      concluida: tarefaMerged.concluida ?? false,
    });

    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...campos } : t))
    );
  }

  async function excluirTarefa(id: string) {
    await excluirTarefaApi(id);
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TarefaContext.Provider
      value={{ tarefas, carregando, adicionarTarefa, atualizarTarefa, excluirTarefa }}
    >
      {children}
    </TarefaContext.Provider>
  );
}

export function useTarefas() {
  const context = useContext(TarefaContext);
  if (!context) throw new Error("useTarefas deve ser usado dentro do TarefaProvider");
  return context;
}

