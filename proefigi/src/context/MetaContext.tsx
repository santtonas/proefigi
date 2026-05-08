import React, { createContext, useState, useContext, useEffect } from 'react';

// Adicionei os "export" aqui para resolver o erro vermelho do console!
export type TipoMeta = 'estudo' | 'tarefas' | 'materias';

export interface SubItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface Meta {
  id: string;
  titulo: string;
  concluidas: number;
  total: number;
  cor: string;
  tipo: TipoMeta;
  itens: SubItem[];
  fixada?: boolean;    
  concluida?: boolean;
}

interface MetaContextData {
  metas: Meta[];
  setMetas: React.Dispatch<React.SetStateAction<Meta[]>>;
}

export const MetaContext = createContext<MetaContextData>({} as MetaContextData);

export const MetaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lógica do LocalStorage para não perder os dados no F5
  const [metas, setMetas] = useState<Meta[]>(() => {
    try {
      const metasSalvas = localStorage.getItem('@MinhasMetas');
      return metasSalvas ? JSON.parse(metasSalvas) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@MinhasMetas', JSON.stringify(metas));
  }, [metas]);

  return (
    <MetaContext.Provider value={{ metas, setMetas }}>
      {children}
    </MetaContext.Provider>
  );
};

export const useMetas = () => useContext(MetaContext);