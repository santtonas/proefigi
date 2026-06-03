import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, Key, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import "./ajuda.css";

interface FAQItem {
  id: number;
  categoria: 'geral' | 'pomodoro' | 'restricao' | 'conta';
  pergunta: string;
  resposta: string;
}

const Ajuda: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [abertoId, setAbertoId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      categoria: 'geral',
      pergunta: 'O que é o Proefigi e como ele funciona?',
      resposta: 'O Proefigi é uma plataforma integrada de produtividade para estudantes. Reunimos ferramentas de gerenciamento de tempo (Pomodoro), cronogramas (Rotinas e Calendário) e bloqueio de distrações (Restrições) em um único ambiente focado.'
    },
    {
      id: 2,
      categoria: 'pomodoro',
      pergunta: 'Como funciona o temporizador Pomodoro?',
      resposta: 'O método consiste em ciclos de 25 minutos de foco total seguidos por 5 minutos de descanso. Após 4 ciclos completos, a plataforma sugere um descanso maior de 15 minutos. Você pode personalizar esses tempos nas configurações.'
    },
    {
      id: 3,
      categoria: 'restricao',
      pergunta: 'O bloqueio de sites realmente impede o meu acesso?',
      resposta: 'Sim! Quando a lista de restrições está ativa e integrada com nossa extensão/app, qualquer tentativa de acessar os sites listados será redirecionada para uma tela de foco, ajudando você a vencer a procrastinação.'
    },
    {
      id: 4,
      categoria: 'conta',
      pergunta: 'Como posso redefinir a minha senha?',
      resposta: 'Caso tenha esquecido sua senha, você pode clicar em "Esqueci minha senha" na tela de login. Se já estiver logado, basta acessar a aba de Configurações > Segurança da Conta para criar uma nova credencial.'
    },
    {
      id: 5,
      categoria: 'geral',
      pergunta: 'Os meus dados e históricos de estudo ficam salvos?',
      resposta: 'Atualmente, os dados locais (como a lista de restrições) ficam salvos de forma segura no cache do seu navegador (LocalStorage). Ao migrar para o plano Premium, seus dados são salvos na nuvem de forma criptografada.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setAbertoId(abertoId === id ? null : id);
  };

  // Filtrar perguntas de acordo com o que o usuário digita
  const faqsFiltradas = faqs.filter(faq =>
    faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
    faq.resposta.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container-ajuda">
      <div className="ajuda-wrapper">
        
        {/* CABEÇALHO COM BUSCA */}
        <header className="ajuda-header">
          <h1>Central de Ajuda</h1>
          
          <div className="busca-box">
            <Search size={20} className="busca-icon" />
            <input 
              type="text" 
              placeholder="Ex: Como mudar o tempo do Pomodoro..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </header>

        {/* CARDS DE CATEGORIAS RÁPIDAS */}
        <section className="categorias-grid">
          <div className="categoria-card">
            <BookOpen size={24} className="cat-icon" />
            <h3>Primeiros Passos</h3>
            <p>Aprenda a configurar seu perfil e rotinas básicas.</p>
          </div>
          <div className="categoria-card">
            <HelpCircle size={24} className="cat-icon" />
            <h3>Uso dos Módulos</h3>
            <p>Dúvidas sobre Pomodoro, Metas e Calendário.</p>
          </div>
          <div className="categoria-card">
            <Key size={24} className="cat-icon" />
            <h3>Conta e Acesso</h3>
            <p>Gerencie senhas, planos e segurança do perfil.</p>
          </div>
        </section>

        {/* LISTA DE PERGUNTAS (ACCORDION) */}
        <section className="faq-section">
          <h2>Dúvidas Frequentes</h2>
          
          <div className="faq-list">
            {faqsFiltradas.length > 0 ? (
              faqsFiltradas.map((faq) => (
                <div 
                  key={faq.id} 
                  className={`faq-item ${abertoId === faq.id ? 'open' : ''}`}
                >
                  <button className="faq-trigger" onClick={() => toggleFAQ(faq.id)}>
                    <span>{faq.pergunta}</span>
                    {abertoId === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  <div className="faq-content">
                    <p>{faq.resposta}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">Nenhuma dúvida encontrada para "{busca}".</p>
            )}
          </div>
        </section>

        {/* SUPORTE ADICIONAL */}
        <footer className="ajuda-footer">
          <div className="suporte-card">
            <MessageSquare size={20} />
            <div>
              <h4>Ainda precisa de ajuda?</h4>
              <p>Nosso time de suporte responde em até 24h úteis.</p>
            </div>
            <button className="btn-suporte" onClick={() => alert('Abrindo chat de suporte...')}>
              Falar com Suporte
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Ajuda;