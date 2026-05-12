import './style.css';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { BarraDiasSeguidos } from '../../components/BarraDiasSeguidos';
import { CardProgresso } from '../../components/CardProgresso';
import { useTarefas } from '../../context/TarefaContext'; 

function useContador(valorFinal: number, duracao: number = 1000) {
  const [valor, setValor] = useState<number>(0);
  useEffect(() => {
    let inicio = 0;
    if (valorFinal === 0) {
      setValor(0);
      return;
    }
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


function calcularDuracaoMinutos(inicio: string, termino: string): number {
  if (!inicio || !termino) return 0;
  
  const [hInicio, mInicio] = inicio.split(':').map(Number);
  const [hTermino, mTermino] = termino.split(':').map(Number);
  
  const totalInicioMinutos = (hInicio * 60) + mInicio;
  const totalTerminoMinutos = (hTermino * 60) + mTermino;
  
  
  return Math.max(0, totalTerminoMinutos - totalInicioMinutos);
}

export default function Progresso() {
  const { tarefas } = useTarefas(); 

  // --- 1. LÓGICA DO PROGRESSO DE HOJE ---
  const dataHoje = new Date();
  const ano = dataHoje.getFullYear();
  const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
  const dia = String(dataHoje.getDate()).padStart(2, '0');
  const dataHojeString = new Date(ano, Number(mes) - 1, Number(dia)).toDateString();

  const todasAsTarefasDeHoje = tarefas.filter(t => t.data === dataHojeString);
  const totalHoje = todasAsTarefasDeHoje.length;
  const concluidasHoje = todasAsTarefasDeHoje.filter(t => t.concluida).length;
  const temTarefasHoje = totalHoje > 0;

  const porcentagem = temTarefasHoje
    ? Math.round((concluidasHoje / totalHoje) * 100)
    : 0;

  const minutosTotaisHoje = todasAsTarefasDeHoje
    .filter(t => t.concluida)
    .reduce((total, tarefa) => total + calcularDuracaoMinutos(tarefa.inicio, tarefa.termino), 0);

  const horasEstudadas = Math.floor(minutosTotaisHoje / 60);
  const minutosEstudados = minutosTotaisHoje % 60;
  const tempoFormatado = minutosTotaisHoje > 0 
    ? `${String(horasEstudadas).padStart(2, '0')}h ${String(minutosEstudados).padStart(2, '0')}m`
    : '00h 00m';

  // --- 2. LÓGICA DO TOTAL DA SEMANA (Domingo a Sábado) ---
  const agora = new Date();
  const diaDaSemana = agora.getDay(); 
  
  const dataDomingo = new Date(agora);
  dataDomingo.setDate(agora.getDate() - diaDaSemana);
  dataDomingo.setHours(0, 0, 0, 0);

  const dataSabado = new Date(dataDomingo);
  dataSabado.setDate(dataDomingo.getDate() + 6);
  dataSabado.setHours(23, 59, 59, 999);

  const minutosTotaisSemana = tarefas
    .filter(t => t.concluida)
    .filter(t => {
      const dataDaTarefa = new Date(t.data); 
      return dataDaTarefa >= dataDomingo && dataDaTarefa <= dataSabado;
    })
    .reduce((total, tarefa) => total + calcularDuracaoMinutos(tarefa.inicio, tarefa.termino), 0); 

  const horasTotaisSemana = parseFloat((minutosTotaisSemana / 60).toFixed(1));

  // --- 3. LÓGICA DO GRÁFICO (Dias da Semana) ---
  const diasDaSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const dadosGrafico = diasDaSemanaNomes.map((nomeDia, index) => {
    const dataDoDia = new Date(dataDomingo);
    dataDoDia.setDate(dataDomingo.getDate() + index);

    const minutosNesseDia = tarefas
      .filter(t => t.concluida)
      .filter(t => {
        const dataTarefa = new Date(t.data);
        return dataTarefa.toDateString() === dataDoDia.toDateString();
      })
      .reduce((total, tarefa) => total + calcularDuracaoMinutos(tarefa.inicio, tarefa.termino), 0);

    return {
      dia: nomeDia,
      horas: parseFloat((minutosNesseDia / 60).toFixed(1))
    };
  });

  // --- 4. ANIMAÇÕES DOS NÚMEROS ---
  const semanaAnimada = useContador(horasTotaisSemana);
  const tarefasAnimadas = useContador(concluidasHoje); 
  const porcentagemAnimada = useContador(porcentagem);

  let corDoProgresso = '#45B9FB'; 
  if (porcentagem === 100 && temTarefasHoje) {
    corDoProgresso = '#10b981'; 
  } else if (porcentagem < 30 && temTarefasHoje) {
    corDoProgresso = '#a2d9ff'; 
  }

  return (
    <div className="progresso-pagina">
      <div className="caixa-header">
        <h2>Meu Progresso</h2>
        <BarraDiasSeguidos />
      </div>

      <div className="progresso-main-layout">
        
        {/* Lado Esquerdo: Gráfico */}
        <div className="progresso-grafico">
          <h3>Horas estudadas na semana</h3>
          <div className="grafico-container-flex">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={dadosGrafico} barSize={55} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
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
            <span className="card-valor">{tempoFormatado}</span> 
          </div>
          <div className="progresso-card">
            <span className="card-label">Essa semana</span>
            <span className="card-valor">{semanaAnimada}h</span>
          </div>
          <div className="progresso-card">
            <span className="card-label">Tarefas concluídas</span>
            <span className="card-valor">{tarefasAnimadas}</span>
          </div>

          <CardProgresso 
            temTarefasHoje={temTarefasHoje}
            progressoPorcentagem={porcentagemAnimada} 
            tarefasConcluidasHoje={concluidasHoje}
            totalTarefasHoje={totalHoje}
            corDoProgresso={corDoProgresso} 
            mostrarHoras={false} 
          />
        </div>

      </div>
    </div>
  );
}