import React, { createContext, useContext, useState } from 'react';

// Tipagem da Tarefa
interface Tarefa {
  id: string;
  titulo: string;
  data: string;
  concluida: boolean;
  inicio?: string;
  termino?: string;
}

interface TarefaContextData {
  tarefas: Tarefa[];
  adicionarTarefa: (tarefa: Tarefa) => Promise<void>;
  excluirTarefa: (id: string) => Promise<void>;
  atualizarTarefa: (id: string, dados: Partial<Tarefa>) => Promise<void>;
}

const TarefaContext = createContext<TarefaContextData>({} as TarefaContextData);

// --- FUNÇÃO DE CALCULAR DIAS SEGUIDOS ---
function registrarEstudoDoDia() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ultimaDataSalva = localStorage.getItem('@proefigi:ultimaDataEstudada');
  const diasAtuais = Number(localStorage.getItem('@proefigi:diasSeguidos') || 0);

  let novosDias = diasAtuais;

  if (ultimaDataSalva) {
    const ultimaData = new Date(ultimaDataSalva);
    ultimaData.setHours(0, 0, 0, 0);

    const diferencaTempo = hoje.getTime() - ultimaData.getTime();
    const diferencaDias = diferencaTempo / (1000 * 3600 * 24);

    if (diferencaDias === 1) {
      novosDias = diasAtuais + 1; // Estudou ontem, aumenta!
    } else if (diferencaDias > 1) {
      novosDias = 1; // Pulou dia, reseta.
    }
  } else {
    novosDias = 1; // Primeira vez.
  }

  localStorage.setItem('@proefigi:diasSeguidos', String(novosDias));
  localStorage.setItem('@proefigi:ultimaDataEstudada', hoje.toISOString());

  // DISPARA UM AVISO PARA O APLICATIVO QUE O LOCALSTORAGE MUDOU
  window.dispatchEvent(new Event('atualizouDiasSeguidos'));
}
// ----------------------------------------

export const TarefaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // 1. ADICIONAR
  const adicionarTarefa = async (novaTarefa: Tarefa) => {
    const tarefaComId = { ...novaTarefa, id: novaTarefa.id || String(Date.now()) };
    setTarefas(prev => [...prev, tarefaComId]);
  };

  // 2. EXCLUIR
  const excluirTarefa = async (id: string) => {
    setTarefas(prev => prev.filter(t => t.id !== id));
  };

  // 3. ATUALIZAR
  const atualizarTarefa = async (id: string, dados: Partial<Tarefa>) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, ...dados } : t));

    // A MÁGICA ACONTECE AQUI: Se a tarefa foi marcada como CONCLUÍDA, roda a função!
    if (dados.concluida === true) {
      registrarEstudoDoDia();
    }
  };

  return (
    <TarefaContext.Provider value={{ tarefas, adicionarTarefa, excluirTarefa, atualizarTarefa }}>
      {children}
    </TarefaContext.Provider>
  );
};

export const useTarefas = () => useContext(TarefaContext);