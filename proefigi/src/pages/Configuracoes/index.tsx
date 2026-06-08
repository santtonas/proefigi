import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Importando as telas isoladas da pasta Componentes
import MenuPrincipal from './Componentes/MenuPrincipal';
import Usuario from './Componentes/Usuario';
import Pais from './Componentes/Pais';
import Premium from './Componentes/Premium';

// Importando o CSS global de layout que criamos
import './style.css';

// Tipagem das possíveis telas (null significa que está no Menu Principal)
type SubPaginaTipo = 'usuario' | 'pais' | 'premium' | null;

export default function Configuracoes() {
  const location = useLocation();

  // 1. O ESTADO INTELIGENTE: 
  // Ele já olha pra rota no momento em que nasce. Se o clique veio 
  // do avatar lá na barra lateral (Nav), ele já abre a tela 'usuario'.
  const [subPaginaAtiva, setSubPaginaAtiva] = useState<SubPaginaTipo>(() => {
    if (location.state && (location.state as any).abrirConta) {
      return 'usuario';
    }
    return null;
  });

  // 2. A LIMPEZA E O ROTEAMENTO ATIVO:
  // Se o usuário já estiver dentro da página de configurações e clicar no perfil
  // no menu lateral, este useEffect captura a mudança da rota e força a tela de usuário.
  useEffect(() => {
    if (location.state && (location.state as any).abrirConta) {
      
      // 🌟 O SEGREDO AQUI: Força a abertura da tela de usuário
      setSubPaginaAtiva('usuario'); 

      // Remove a flag "abrirConta" do histórico do navegador. 
      // Isso evita que o usuário dê F5 e o React reabra a tela de usuário sozinho.
      window.history.replaceState({}, document.title);
    }
  }, [location]); // Fica escutando as mudanças do React Router

  // Função simples para facilitar a passagem de props para os botões de "Voltar"
  const voltarParaMenu = () => setSubPaginaAtiva(null);

  return (
    <div className="config-container-tela">
      
      {/* --- ROTEAMENTO INTERNO --- */}
      
      {subPaginaAtiva === 'usuario' && (
        <Usuario aoVoltar={voltarParaMenu} />
      )}

      {subPaginaAtiva === 'pais' && (
        <Pais 
          aoVoltar={voltarParaMenu} 
          aoIrParaPremium={() => setSubPaginaAtiva('premium')}
        />
      )}

      {subPaginaAtiva === 'premium' && (
        <Premium aoVoltar={voltarParaMenu} />
      )}

      {/* --- MENU PRINCIPAL (FALLBACK) --- */}
      
      {subPaginaAtiva === null && (
        <MenuPrincipal setSubPaginaAtiva={setSubPaginaAtiva} />
      )}
      
    </div>
  );
}