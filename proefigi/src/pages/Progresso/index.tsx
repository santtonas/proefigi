import './style.css';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const dadosSemana = [
  { dia: 'Seg', horas: 2.5 },
  { dia: 'Ter', horas: 1.8 },
  { dia: 'Qua', horas: 3.2 },
  { dia: 'Qui', horas: 0.5 },
  { dia: 'Sex', horas: 2.0 },
  { dia: 'Sáb', horas: 4.0 },
  { dia: 'Dom', horas: 1.2 },
];

const hojesHoras = dadosSemana[dadosSemana.length - 1].horas;
const totalSemana = dadosSemana.reduce((acc, d) => acc + d.horas, 0).toFixed(1);

function useContador(valorFinal: number, duracao: number = 1000) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    let inicio = 0;
    const incremento = valorFinal / (duracao / 16);
    const timer = setInterval(() => {
      inicio += incremento;
      if (inicio >= valorFinal) {
        setValor(valorFinal);
        clearInterval(timer);
      } else {
        setValor(parseFloat(inicio.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [valorFinal]);
  return valor;
}

export default function Progresso() {
  const hojeAnimado = useContador(hojesHoras);
  const semanaAnimada = useContador(parseFloat(totalSemana));
  const tarefasAnimadas = useContador(12);

  const concluidasHoje = 9;
  const totalHoje = 12;
  const porcentagem = Math.round((concluidasHoje / totalHoje) * 100);
  const porcentagemAnimada = useContador(porcentagem);

  return (
    <div className="progresso-pagina">
      <div className="caixa-header">
        <h2>Meu Progresso</h2>
      </div>

      <div className="progresso-main-layout">
        
        {/* Lado Esquerdo: Gráfico */}
        <div className="progresso-grafico">
          <h3>Horas estudadas na semana</h3>
          
          {/* Wrapper que força o gráfico a ocupar o espaço vertical restante */}
          <div className="grafico-container-flex">
            <ResponsiveContainer width="100%" height={500}>
                  {/* Aumentamos a margem bottom para 40 para garantir o espaço do texto */}
              <BarChart data={dadosSemana} barSize={55} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
    
                  {/* Limpamos os atributos dy e height que podiam estar empurrando o texto pra fora do SVG */}
                <XAxis 
                 dataKey="dia" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ dy: 10 }} 
                />
    
                <Tooltip
                 cursor={false}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 formatter={(value) => [`${value}h`, 'Horas']}
                />
                <Bar 
                 dataKey="horas" 
                 fill="#45B9FB" 
                 radius={[10, 10, 0, 0]} 
                 isAnimationActive={true} 
                 animationDuration={800} 
                />
              </BarChart>
           </ResponsiveContainer>
          </div>
        </div>

        {/* Lado Direito: Grid de Cards */}
        <div className="progresso-cards">
          <div className="progresso-card">
            <span className="card-label">Hoje</span>
            <span className="card-valor">{hojeAnimado}h</span>
          </div>
          <div className="progresso-card">
            <span className="card-label">Essa semana</span>
            <span className="card-valor">{semanaAnimada}h</span>
          </div>
          <div className="progresso-card">
            <span className="card-label">Tarefas concluídas</span>
            <span className="card-valor">{tarefasAnimadas}</span>
          </div>

          <div className="progresso-card card-meta">
            <span className="card-label">Progresso Hoje</span>
            <div className="anel-wrapper">
              <svg width="180" height="180" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#45B9FB"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 38 * porcentagemAnimada / 100} ${2 * Math.PI * 38}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className="anel-texto">
                <span className="anel-porcentagem">{porcentagemAnimada}%</span>
              </div>
            </div>
            <span className="card-sublabel">{concluidasHoje}/{totalHoje} tarefas</span>
          </div>
        </div>

      </div>

      <div className="progresso-streak">
        <Star size={28} color="#45B9FB" fill="#45B9FB" />
        <div>
          <span className="streak-numero">7</span>
          <span className="streak-label"> dias seguidos estudando!</span>
        </div>
      </div>

    </div>
  );
}
