import React, { useState } from 'react'; // Adicionado 'React' aqui
import "./rotina.css";

const Rotina: React.FC = () => {
  // Estados para capturar os dados
  const [atividade, setAtividade] = useState('');
  const [horario, setHorario] = useState('');
  const [repeticao, setRepeticao] = useState('Dia');
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);

  // Função para marcar/desmarcar os dias da semana
  const toggleDia = (index: number) => {
    if (diasSelecionados.includes(index)) {
      setDiasSelecionados(diasSelecionados.filter(i => i !== index));
    } else {
      setDiasSelecionados([...diasSelecionados, index]);
    }
  };
  return (
    <div className="container-rotina">
      
      
      <div className="rotina-card">
        <h1>Minha Rotina</h1>
        
        <div className="form-group">
          <label>O que você quer agendar?</label>
          <input 
            type="text" 
            placeholder="Ex: Treino na Academia..." 
            value={atividade}
            onChange={(e) => setAtividade(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Horário</label>
            <input 
              type="time" 
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Repetir a cada:</label>
            <select value={repeticao} onChange={(e) => setRepeticao(e.target.value)}>
              <option>Dia</option>
              <option>Semana</option>
              <option>Mês</option>
              <option>Ano</option>
            </select>
          </div>
        </div>

        <div className="days-selector">
          <label>Dias da semana:</label>
          <div className="days-buttons">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
              <button 
                key={i} 
                type="button"
                /* Adicionamos uma classe extra se o dia estiver selecionado */
                className={`day-btn ${diasSelecionados.includes(i) ? 'active' : ''}`}
                onClick={() => toggleDia(i)}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>

        <div className="buttons-rotina">
          <button className="btn-save" onClick={() => console.log({atividade, horario, repeticao, diasSelecionados})}>
            Salvar Rotina
          </button>
          <button className="btn-view">Ver Calendário</button>
        </div>
      </div>
    </div>
  );
};

export default Rotina;