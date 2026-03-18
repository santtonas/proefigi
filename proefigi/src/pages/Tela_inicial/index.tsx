import './style.css';
import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Tarefa {
  id: string;
  data: string; // Salvaremos como string ISO para comparar fácil
  titulo: string;
  inicio: string;
  termino: string;
  importancia: 'normal' | 'importante' | 'urgente';
  descricao: string;
}


export function Tela_inicial(){
    const [date, setDate] = useState<Value>(new Date());
    const [tarefas, setTarefas] = useState<Tarefa[]>([]); // Lista de tarefas
    const [modalAberto, setModalAberto] = useState(false); // Começa fechado (false)
    const [titulo, setTitulo] = useState('');
    const [inicio, setInicio] = useState('');
    const [termino, setTermino] = useState('');
    const [importancia, setImportancia] = useState<'normal' | 'importante' | 'urgente'>('normal');
    const [descricao, setDescricao] = useState('');
    const tarefasDoDiaSelecionado = tarefas.filter(t => t.data === date.toDateString());
    
    const verificarEabrirModal = () => {
    // Pega a data de hoje e zera as horas para comparar apenas o dia
    const dataDeHoje = new Date();
    dataDeHoje.setHours(0, 0, 0, 0);
    
    // Pega a data que o aluno selecionou no calendário e também zera as horas
    const dataSelecionada = new Date(date);
    dataSelecionada.setHours(0, 0, 0, 0);

    // Se a data selecionada for menor (antes) que hoje, exibe o aviso
    if (dataSelecionada < dataDeHoje) {
      alert("Ops! Você não pode adicionar tarefas em dias que já passaram. ⏳");
    } else {
      // Se for hoje ou no futuro, abre a janelinha normalmente
      setModalAberto(true);
    }
    };

    const salvarTarefa = () => {
    if (!titulo) {
      alert("Por favor, dê um título para a tarefa!");
      return;
    }

    const novaTarefa: Tarefa = {
      id: Math.random().toString(), // Gera um ID único aleatório
      data: date.toDateString(),    // Salva na data que está SELECIONADA no calendário
      titulo: titulo,
      inicio: inicio,
      termino: termino,
      importancia: importancia,
      descricao: descricao
    };

    // Adiciona a nova tarefa na lista que já existe
    setTarefas([...tarefas, novaTarefa]);

    // Limpa os campos para a próxima vez e fecha a janela
    setTitulo('');
    setInicio('');
    setTermino('');
    setImportancia('normal');
    setDescricao('');
    setModalAberto(false);
  };

   const renderTileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const tarefasDoDia = tarefas.filter(t => t.data === date.toDateString());
      
      // Pega apenas as 3 primeiras tarefas para virarem bolinhas
      const tarefasParaMostrar = tarefasDoDia.slice(0, 3);
      // Calcula quantas sobraram de fora
      const tarefasEscondidas = tarefasDoDia.length - 3;

      return (
        <div className="container-bolinhas">
          {tarefasParaMostrar.map(t => (
            <span key={t.id} className={`bolinha bolinha-${t.importancia}`} />
          ))}
          {/* Se tiver mais de 3, mostra o numerozinho extra */}
          {tarefasEscondidas > 0 && (
            <span className="texto-mais-tarefas">+{tarefasEscondidas}</span>
          )}
        </div>
      );
    }
  };

    return (
        <>
        <main className="conteudo-principal">
            <div className="conteiner-calendario">
                

                <Calendar onChange={setDate} value={date} tileContent={renderTileContent} showFixedNumberOfWeeks={true} calendarType="iso8601" locale="pt-BR"/>

               
            </div>
            <div className="lista-tarefas">
        <h3>Tarefas do dia {date.toLocaleDateString('pt-BR')}</h3>
        
        {tarefasDoDiaSelecionado.length === 0 ? (
          <p className="sem-tarefas">Nenhuma tarefa marcada para hoje. Aproveite o descanso! 😴</p>
        ) : (
          <div className="cards-tarefas">
            {tarefasDoDiaSelecionado.map(tarefa => (
              <div key={tarefa.id} className={`card-tarefa borda-${tarefa.importancia}`}>
                <div className="card-cabecalho">
                  <strong>{tarefa.titulo}</strong>
                  <span>{tarefa.inicio} - {tarefa.termino}</span>
                </div>
                <p>{tarefa.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>

        </main>

        <div>
            <button className="botao-adicionar-tarefa" title="Adicionar Tarefa" onClick={verificarEabrirModal}>
               +
            </button>
        </div>

        {modalAberto && (
        <div className="modal-fundo">
          <div className="modal-caixa">
            <h2>Adicionar Nova Tarefa</h2>
            
            <div className="grupo-input">
              <label>Título da Tarefa</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Estudar Matemática" />
            </div>

            <div className="linha-horarios">
              <div className="grupo-input">
                <label>Início</label>
                <input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} />
              </div>
              <div className="grupo-input">
                <label>Término</label>
                <input type="time" value={termino} onChange={(e) => setTermino(e.target.value)} />
              </div>
            </div>

            <div className="grupo-input">
              <label>Importância</label>
              <select value={importancia} onChange={(e) => setImportancia(e.target.value as any)}>
                <option value="normal">Normal (Verde)</option>
                <option value="importante">Importante (Amarelo)</option>
                <option value="urgente">Urgente (Vermelho)</option>
              </select>
            </div>

            <div className="grupo-input">
              <label>Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes da tarefa..." rows={3}></textarea>
            </div>

            <div className="botoes-modal">
              <button className="botao-salvar" onClick={salvarTarefa}>Salvar Tarefa</button>
              <button className="botao-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
            
            <button onClick={() => setModalAberto(false)}>Cancelar</button>
          </div>
        </div>
      )}
        </>
    )
}