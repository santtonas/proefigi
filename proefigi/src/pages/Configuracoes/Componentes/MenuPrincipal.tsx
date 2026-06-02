import { useUser } from '../../../context/UserContext';
import { User, Users, Crown, ChevronRight } from 'lucide-react';
import './MenuPrincipal.css'; 

interface MenuPrincipalProps {
  setSubPaginaAtiva: (pagina: 'usuario' | 'pais' | 'premium' | null) => void;
}

export default function MenuPrincipal({ setSubPaginaAtiva }: MenuPrincipalProps) {
  const { foto } = useUser();

  return (
    <div className="config-box-vertical">
      <h1 className="config-lista-titulo">Configurações</h1>

      <div className="config-lista-vertical">
        
        {/* OPÇÃO 1: USUÁRIO (CONTA) */}
        <div className="item-lista-clicavel" onClick={() => setSubPaginaAtiva('usuario')}>
          <div className="item-lista-esquerda">
            {foto ? (
              <img src={foto} alt="Menu Perfil" className="mini-avatar-menu" />
            ) : (
              <div className="icon-wrapper cor-conta"><User size={20} /></div>
            )}
            <div>
              <h3>Informações da Conta</h3>
              <p>Altere seu nome, e-mail e dados de perfil</p>
            </div>
          </div>
          <ChevronRight size={18} className="seta-ir" />
        </div>

        {/* OPÇÃO 2: PREMIUM */}
        <div className="item-lista-clicavel" onClick={() => setSubPaginaAtiva('premium')}>
          <div className="item-lista-esquerda">
            <div className="icon-wrapper cor-premium"><Crown size={20} /></div>
            <div>
              <h3>Seja Premium</h3>
              <p>Veja o status da sua assinatura e vantagens</p>
            </div>
          </div>
          <ChevronRight size={18} className="seta-ir" />
        </div>

        {/* OPÇÃO 3: CONTROLE DOS PAIS */}
        <div className="item-lista-clicavel" onClick={() => setSubPaginaAtiva('pais')}>
          <div className="item-lista-esquerda">
            <div className="icon-wrapper cor-pais"><Users size={20} /></div>
            <div>
              <h3>Controle dos Pais</h3>
              <p>Configure limites de uso e bloqueios de segurança</p>
            </div>
          </div>
          <ChevronRight size={18} className="seta-ir" />
        </div>

      </div>
    </div>
  );
}