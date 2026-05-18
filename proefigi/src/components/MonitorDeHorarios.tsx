import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarefas } from '../context/TarefaContext';

export function MonitorDeHorarios() {
  const { tarefas } = useTarefas();
  const navigate = useNavigate();
  const [ultimaDisparada, setUltimaDisparada] = useState<string | null>(null);

  useEffect(() => {
    const verificarRelogio = () => {
      const agora = new Date();
      const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
      
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const dia = String(agora.getDate()).padStart(2, '0');
      const hojeString = `${ano}-${mes}-${dia}`;

      const tarefaParaIniciar = tarefas.find(t => 
        t.data === hojeString &&
        t.pomodoroAutomatico &&
        !t.concluida &&
        t.inicio === horaAtual
      );

      if (tarefaParaIniciar && tarefaParaIniciar.id !== ultimaDisparada) {
        setUltimaDisparada(tarefaParaIniciar.id);
        // Só redireciona! A tela do Pomodoro cuida do resto
        navigate('/pomodoro');
      }
    };

    const intervalo = setInterval(verificarRelogio, 30000);
    verificarRelogio();

    return () => clearInterval(intervalo);
  }, [tarefas, navigate, ultimaDisparada]);

  return null;
}