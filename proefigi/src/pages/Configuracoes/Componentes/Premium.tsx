import React from 'react';
import {ArrowLeft , Shield, Check, Zap } from 'lucide-react';
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
            {/* Ícone de Raio adicionado */}
            <Zap size={28} color="#007eb5" /> 
          </div>
          <h3>Plano Estudante</h3>
          {/* Subtítulo de impacto atualizado */}
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

        {/* CARD CONTROLE DOS PAIS */}
        <div className="plan-card plan-card-featured">
          <div className="featured-badge">Mais Completo</div>
          
          <div className="plan-icon-wrapper pais-icon">
            <Shield size={28} color="#f59e0b" />
          </div>
          <h3>Controle dos Pais</h3>
          <p className="plan-subtitle">Gestão, foco e segurança para a casa</p>
          
          <div className="plan-price">
            <span className="currency">R$</span>
            <span className="amount">24,90</span>
            <span className="period">/mês</span>
          </div>

          <ul className="plan-features">
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
            Desbloquear Plano Família
          </button>
        </div>

      </div>

      {/* 3. AVISO DE PIONEIRO */}
      <div className="premium-footer-notice">
        <p>💡 <strong>Aviso de Lançamento:</strong> Assinando hoje, você garante o preço promocional de pioneiro e ganha acesso a todas as futuras atualizações do seu plano sem nenhum custo extra.</p>
      </div>
    </div>
  );
}