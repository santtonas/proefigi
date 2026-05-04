import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. O endereço da API ex.
const API_URL = 'http://localhost:3000/tarefas'; 

// 2. O TypeScript precisa dessa interface para saber o que é uma "Tarefa"
interface Tarefa {
  id: string;
  data: string;
  titulo: string;
  inicio: string;
  termino: string;
  importancia: 'normal' | 'importante' | 'urgente';
  descricao: string;
  concluida?: boolean;
}

// 3. E dessa interface para o Contexto
interface TarefaContextData {
  tarefas: Tarefa[];
  adicionarTarefa: (t: Tarefa) => void;
  excluirTarefa: (id: string) => void;
  atualizarTarefa: (id: string, t: Partial<Tarefa>) => void;
}

// CORREÇÃO 1: Criar o contexto de fato!
const TarefaContext = createContext<TarefaContextData>({} as TarefaContextData);

export const TarefaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  // BUSCAR TAREFAS (GET)
  useEffect(() => {
    async function carregarTarefas() {
      try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();
        setTarefas(dados);
      } catch (error) {
        console.error("Erro ao carregar tarefas do banco:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarTarefas();
  }, []);

  // ADICIONAR (POST)
  const adicionarTarefa = async (nova: Tarefa) => {
    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nova),
      });
      // CORREÇÃO 2: Removido o espaço no nome da variável
      const tarefaSalvaNoBanco = await resposta.json();
      setTarefas([...tarefas, tarefaSalvaNoBanco]);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  // EXCLUIR (DELETE)
  const excluirTarefa = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTarefas(tarefas.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  // ATUALIZAR (PATCH/PUT)
  const atualizarTarefa = async (id: string, dados: Partial<Tarefa>) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      setTarefas(tarefas.map(t => t.id === id ? { ...t, ...dados } : t));
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return (
    <TarefaContext.Provider value={{ tarefas, adicionarTarefa, excluirTarefa, atualizarTarefa }}>
      {!loading && children}
    </TarefaContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTarefas = () => useContext(TarefaContext);