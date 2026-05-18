import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface para o tipo de objeto de um site bloqueado
export interface SiteBloqueado {
  id: number;
  nome: string;
  ativo: boolean;
}

// Interface para o que o Contexto vai disponibilizar para o app
interface RestricaoContextType {
  sitesBloqueados: SiteBloqueado[];
  sugestoes: string[];
  adicionarSite: (nomeSite: string) => void;
  alternarStatus: (id: number) => void;
}

const RestricaoContext = createContext<RestricaoContextType | undefined>(undefined);

export const RestricaoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sitesBloqueados, setSitesBloqueados] = useState<SiteBloqueado[]>([
    { id: 1, nome: 'facebook.com', ativo: true },
  ]);

  const sugestoes = ['youtube.com', 'tiktok.com', 'x.com', 'netflix.com'];

  const adicionarSite = (nomeSite: string) => {
    if (nomeSite.trim() !== '') {
      setSitesBloqueados((prev) => [
        ...prev,
        { id: Date.now(), nome: nomeSite, ativo: true }
      ]);
    }
  };

  const alternarStatus = (id: number) => {
    setSitesBloqueados((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ativo: !s.ativo } : s))
    );
  };

  return (
    <RestricaoContext.Provider value={{ sitesBloqueados, sugestoes, adicionarSite, alternarStatus }}>
      {children}
    </RestricaoContext.Provider>
  );
};

// Hook customizado para facilitar o uso nos componentes
export const useRestricoes = () => {
  const context = useContext(RestricaoContext);
  if (!context) {
    throw new Error('useRestricoes deve ser usado dentro de um RestricaoProvider');
  }
  return context;
};