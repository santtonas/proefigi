import React from 'react';
import { ArrowLeft, Shield, Check, Zap, Users } from 'lucide-react';
import './Premium.css';

interface UsuarioProps {
  aoVoltar: () => void;
}

export default function SejaMembro({ aoVoltar }: UsuarioProps) {
  return (
    <div className="premium-container">
      <button className="btn-voltar" onClick={aoVoltar}>
        <ArrowLeft size={18} /> Voltar para Configurações
      </button>
      
      {/* 1. CABEÇALHO */}
      <div className="premium-header">
        <span className="badge-novidade">Modo Premium</span>
        <h2>Escolha o plano ideal para a sua evolução</h2>
        <p>Recursos exclusivos projetados para turbinar sua rotina ou proteger sua família.</p>
      </div>

      {/* 2. CARDS DE ASSINATURA */}
      <div className="premium-cards-grid">
        
        {/* CARD ESTUDANTE */}
        <div className="plan-card">
          <div className="plan-icon-wrapper estudante-icon">
            <Zap size={28} color="#007eb5" /> 
          </div>
          <h3>Plano Estudante</h3>
          <p className="plan-subtitle">Planeje uma vez. Execute sempre.</p>
          
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="amount">9,90</span>
            <span className="period">/mês</span>
          </div>

          <ul className="plan-features">
            <li>
              <Check size={18} color="#10b981" />
              <span>
                <strong>Rotina Otimizada:</strong> Chega de perder tempo reprogramando as mesmas tarefas todo santo dia. Adicione sua rotina recorrente e deixe que o Proefigi monte seu calendário de semanas e meses de forma 100% automática.
              </span>
            </li>
            <li>
              <Check size={18} color="#10b981" />
              <span>Acesso antecipado a novas ferramentas de organização.</span>
            </li>
          </ul>

          <button className="btn-plan btn-estudante">
            Assinar Plano Estudante
          </button>
        </div>

        {/* CARD PLANO FAMÍLIA (Antigo Controle dos Pais) */}
        <div className="plan-card plan-card-featured">
          <div className="featured-badge">Mais Completo</div>
          
          <div className="plan-icon-wrapper pais-icon">
            <Shield size={28} color="#f59e0b" />
          </div>
          <h3>Plano para Pais</h3>
          <p className="plan-subtitle">Gestão, foco e segurança para a casa</p>
          
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="amount">24,90</span>
            <span className="period">/mês</span>
          </div>

          <ul className="plan-features">
            {/* NOVA REGRA DE LIMITES E VALOR EXTRA */}
            <li>
              <Users size={18} color="#10b981" />
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span><strong>Contas Inclusas:</strong> Inclui 1 conta de Administrador (Pais) e até 3 contas para filhos.</span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                  + R$ 4,90/mês por perfil adicional.
                </span>
              </span>
            </li>
            <li>
              <Check size={18} color="#10b981" />
              <span>
                <strong>Controle dos Pais:</strong> Tenha acesso ao controle de bloqueio de sites e aplicativos distrativos diretamente da conta do seu filho.
              </span>
            </li>
            <li>
              <Check size={18} color="#10b981" />
              <span><strong>Acompanhamento de Progresso:</strong> Acompanhe o desempenho do seu filho em tempo real.</span>
            </li>
            <li>
              <Zap size={18} color="#f59e0b" />
              <span><strong>Bônus:</strong> Inclui a ferramenta Rotina Otimizada.</span>
            </li>
          </ul>

          <button className="btn-plan btn-pais">
            Assinar Plano para Pais
          </button>
        </div>

      </div>

      
    </div>
  );
}