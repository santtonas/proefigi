import './style.css';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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

  const [larguraGrafico, setLarguraGrafico] = useState(620);
  const refGrafico = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const largura = entries[0].contentRect.width;
      setLarguraGrafico(largura - 40);
    });
    if (refGrafico.current) observer.observe(refGrafico.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="progresso-pagina">

      {/* Cards de resumo */}
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

        {/* Card Progresso Hoje */}
        <div className="progresso-card card-meta">
          <span className="card-label">Progresso Hoje</span>
          <div className="anel-wrapper">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#45B9FB"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 38 * porcentagemAnimada / 100} ${2 * Math.PI * 38}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="anel-texto">
              <span className="anel-porcentagem">{porcentagemAnimada}%</span>
            </div>
          </div>
          <span className="card-sublabel">{concluidasHoje}/{totalHoje} tarefas</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="progresso-grafico" ref={refGrafico}>
        <h3>Horas estudadas na semana</h3>
        <BarChart width={larguraGrafico} height={250} data={dadosSemana} barSize={40} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="dia" axisLine={false} tickLine={false} interval={0} height={40} padding={{ left: 20, right: 20 }}
            tick={(props) => {
              const { x, y, payload } = props;
              const posY = isNaN(y) ? 240 : y;
              return (
                <text x={x} y={posY} textAnchor="middle" fill="#94a3b8" fontWeight={600} fontSize={13}>
                  {payload.value}
                </text>
              );
            }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(69,185,251,0.1)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value) => [`${value}h`, 'Horas']}
          />
          <Bar dataKey="horas" fill="#45B9FB" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={800} animationEasing="ease-out" />
        </BarChart>
      </div>

      {/* Streak */}
      <div className="progresso-streak">
        <Star size={28} color="#45B9FB" />
        <div>
          <span className="streak-numero">7</span>
          <span className="streak-label"> dias seguidos estudando!</span>
        </div>
      </div>

    </div>
  );
}