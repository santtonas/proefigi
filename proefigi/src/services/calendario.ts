import { request } from "./api";

export type Importancia = 'normal' | 'importante' | 'urgente';

const importanciaParaPriority: Record<Importancia, number> = {
  normal: 0,
  importante: 1,
  urgente: 2,
};

const priorityParaImportancia: Record<number, Importancia> = {
  0: 'normal',
  1: 'importante',
  2: 'urgente',
};

export function converterTarefaDoBackend(t: any) {
    const starTime = new Date(t.starTime);
    const endTime = new Date(t.endTime);
  return {
    id: String(t.id),
    titulo: t.title,
    descricao: t.description ?? '',
    data: starTime.toDateString(),
    inicio: starTime.toLocaleTimeString('pt-BR', {  
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    termino: endTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    importancia: priorityParaImportancia[t.priority] ?? 'normal',
    concluida: t.isDone,
  };
}

function toLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function converterTarefaParaBackend(tarefa: {
  titulo: string;
  descricao: string;
  data: string;
  inicio: string;
  termino: string;
  importancia: Importancia;
  concluida?: boolean;
}) {
  const data = new Date(tarefa.data);
  const inicioStr = tarefa.inicio || "00:00";
  const terminoStr = tarefa.termino || "00:00";

  const [inicioH, inicioM] = inicioStr.split(':').map(Number);
  const [terminoH, terminoM] = terminoStr.split(':').map(Number);

  if (isNaN(data.getTime())) {
    throw new Error(`Data inválida: ${tarefa.data}`);
  }

  const starTime = new Date(data);
  starTime.setHours(inicioH, inicioM, 0, 0);

  const endTime = new Date(data);
  endTime.setHours(terminoH, terminoM, 0, 0);

  return {
    title: tarefa.titulo,
    description: tarefa.descricao,
    starTime: toLocalISO(starTime),
    endTime: toLocalISO(endTime),
    priority: importanciaParaPriority[tarefa.importancia],
    isDone: tarefa.concluida ?? false,
  };
}

// Buscar tarefas
export async function buscarTarefas() {
  const response = await request("/tasks");
  return (response.taskJsons ?? []).map((t: any) => converterTarefaDoBackend(t));
}

// Criar nova tarefa
export async function criarTarefa(tarefa: Parameters<typeof converterTarefaParaBackend>[0]) {
  const body = converterTarefaParaBackend(tarefa);
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Atualizar tarefa
export async function atualizarTarefa(id: string, tarefa: Parameters<typeof converterTarefaParaBackend>[0]) {
  const body = converterTarefaParaBackend(tarefa);
  console.log("PUT /tasks/" + id, body);
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// Excluir tarefa
export async function excluirTarefa(id: string) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}