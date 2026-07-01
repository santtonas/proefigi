import React, { useState } from 'react';
import { Search, BookOpen, Key, ChevronDown, ChevronUp, AlertCircle, RefreshCw, } from 'lucide-react';
import "./ajuda.css";

interface FAQItem {
  id: number;
  categoria: 'geral' | 'pomodoro' | 'restricao' | 'conta' | 'erros';
  pergunta: string;
  resposta: string;
}

const Ajuda: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
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
      resposta: 'Sim! Quando a lista de restrições está ativa, qualquer tentativa de acessar os sites listados será bloqueada, ajudando você a vencer a procrastinação durante seus ciclos de foco.'
    },
    {
      id: 4,
      categoria: 'conta',
      pergunta: 'Como posso redefinir a minha senha?',
      resposta: 'Caso tenha esquecido sua senha, clique em "Esqueci minha senha" direto na tela de login para ir à página de recuperação. Se já estiver logado, acesse Configurações > Segurança da Conta para gerar uma nova credencial.'
    },
    {
      id: 5,
      categoria: 'erros',
      pergunta: 'Por que o bloqueio de sites não está funcionando?',
      resposta: 'Certifique-se de que o Proefigi está rodando em segundo plano e que você não desativou as permissões do aplicativo. Além disso, verifique se os sites que você deseja bloquear estão corretamente listados na seção de Restrições.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setAbertoId(abertoId === id ? null : id);
  };

  const normalizarTexto = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const faqsFiltradas = faqs.filter(faq => {
    const termoBusca = normalizarTexto(busca.trim());
    const matchTexto = normalizarTexto(faq.pergunta).includes(termoBusca) || normalizarTexto(faq.resposta).includes(termoBusca);
    const matchCategoria = categoriaAtiva === 'todas' || faq.categoria === categoriaAtiva;
    return matchTexto && matchCategoria;
  });

  // 🚀 Funções de Navegação para cima e para baixo
 
  return (
    <div className="container-ajuda">
      
  
      <div className="ajuda-wrapper">
        <header className="ajuda-header">
          <h1>Central de Ajuda</h1>
          <p className="ajuda-subtitle">Como podemos ajudar você hoje?</p>
          
          <div className="busca-box">
            <Search size={20} className="busca-icon" />
            <input 
              type="text" 
              placeholder="Ex: Como redefinir senha..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </header>

        <section className="categorias-grid">
          <div className={`categoria-card ${categoriaAtiva === 'todas' ? 'active' : ''}`} onClick={() => setCategoriaAtiva('todas')}>
            <BookOpen size={24} className="cat-icon" />
            <h3>Ver Tudo</h3>
          </div>
          <div className={`categoria-card ${categoriaAtiva === 'pomodoro' ? 'active' : ''}`} onClick={() => setCategoriaAtiva('pomodoro')}>
            <RefreshCw size={24} className="cat-icon" />
            <h3>Módulos e Foco</h3>
          </div>
          <div className={`categoria-card ${categoriaAtiva === 'conta' ? 'active' : ''}`} onClick={() => setCategoriaAtiva('conta')}>
            <Key size={24} className="cat-icon" />
            <h3>Conta e Acesso</h3>
          </div>
          <div className={`categoria-card ${categoriaAtiva === 'erros' ? 'active' : ''}`} onClick={() => setCategoriaAtiva('erros')}>
            <AlertCircle size={24} className="cat-icon" />
            <h3>Erros e Suporte</h3>
          </div>
        </section>

        <section className="faq-section">
          <h2>Dúvidas Frequentes</h2>
          <div className="faq-list">
            {faqsFiltradas.length > 0 ? (
              faqsFiltradas.map((faq) => (
                <div key={faq.id} className={`faq-item ${abertoId === faq.id ? 'open' : ''}`}>
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
              <p className="no-results">Nenhuma dúvida encontrada.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Ajuda;