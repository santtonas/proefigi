import { Clock } from 'lucide-react';

// Definimos o que esse componente espera receber (TypeScript)
interface CardProgressoProps {
  temTarefasHoje: boolean;
  progressoPorcentagem: number;
  tarefasConcluidasHoje: number;
  totalTarefasHoje: number;
  corDoProgresso: string;
  tempoFormatado?: string; // Opcional, pois na tela de Progresso não vamos usar
  mostrarHoras: boolean;   // A nossa chave mágica!
  onClick?: () => void;    // Passamos o clique como prop também
}

export function CardProgresso({
  temTarefasHoje,
  progressoPorcentagem,
  tarefasConcluidasHoje,
  totalTarefasHoje,
  corDoProgresso,
  tempoFormatado = '0h',
  mostrarHoras,
  onClick
}: CardProgressoProps) {
  
  return (
    <div 
      // Se tiver onClick, adiciona a classe que dá o efeito de hover
      className={`home-card-resumo ${onClick ? 'card-clicavel' : ''} card-meta`} 
      onClick={onClick}
    >
      <h3>Progresso Hoje</h3>
      
      {!temTarefasHoje ? (
        <div className="estado-vazio-progresso">
          <p>☕</p>
          <span>Nenhuma tarefa para hoje.<br />Pronto para começar?</span>
        </div>
      ) : (
        <div className="progresso-layout">
          <div className="bloco-grafico">
            <div className="progresso-anel-container">
              <svg className="progresso-svg" viewBox="0 0 36 36">
                <path className="circulo-fundo" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circulo-barra"
                  style={{ stroke: corDoProgresso, strokeDasharray: `${progressoPorcentagem}, 100` }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              
              <div className="progresso-texto-central">
                {progressoPorcentagem === 100 ? (
                  <span className="icone-concluido">🏆</span>
                ) : (
                  <>
                    <span className="porcentagem-valor">{progressoPorcentagem}%</span>
                    <span className="fracao-valor">{tarefasConcluidasHoje} / {totalTarefasHoje}</span>
                  </>
                )}
              </div>
            </div>
            {/* Opcional: Se quiser esconder o "Tarefa concluída" na tela de Progresso, pode atrelar isso ao mostrarHoras também */}
            <h3 className="texto-anel">Tarefa concluída</h3>
          </div>

          {/* ✨ A MÁGICA ACONTECE AQUI ✨ */}
          {mostrarHoras && (
            <>
              <div className="divisor-vertical"></div>

              <div className="progresso-horas">
                <Clock size={28} color={corDoProgresso} />
                <span className="horas-valor">{tempoFormatado}</span>
                <span className="horas-label">Estudadas hoje</span>
              </div>
            </>
          )}
          
        </div>
      )}
    </div>
  );
}