import React, { createContext, useState, useContext, useEffect } from 'react';

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

interface TarefaContextData {
  tarefas: Tarefa[];
  adicionarTarefa: (t: Tarefa) => void;
  excluirTarefa: (id: string) => void;
  atualizarTarefa: (id: string, t: Partial<Tarefa>) => void;
}

const TarefaContext = createContext<TarefaContextData>({} as TarefaContextData);

export const TarefaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    const salvas = localStorage.getItem('@proefigi:tarefas');
    return salvas ? JSON.parse(salvas) : [];
  });

  useEffect(() => {
    localStorage.setItem('@proefigi:tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = (nova: Tarefa) => setTarefas([...tarefas, nova]);
  
  const excluirTarefa = (id: string) => setTarefas(tarefas.filter(t => t.id !== id));

  const atualizarTarefa = (id: string, dados: Partial<Tarefa>) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, ...dados } : t));
  };

  return (
    <TarefaContext.Provider value={{ tarefas, adicionarTarefa, excluirTarefa, atualizarTarefa }}>
      {children}
    </TarefaContext.Provider>
  );
};

export const useTarefas = () => useContext(TarefaContext);