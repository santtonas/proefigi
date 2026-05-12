
import { request } from "./api";

//Backend para o frontend

export function converterMetaDoBackend(m: any){
    const itens = (m.itens ?? []).map((i: any) => ({
        id: String(i.id),
        texto: i.descricao,
        concluido: i.concluido,
    }));

    return{
        id: String(m.id),
        titulo: m.titulo,
        tipo: m.tipo,
        cor: m.cor || '#45B9FB',
        fixada: m.fixada ?? false,
        itens,
        total: itens.lenght,
        concluidas: itens.filter((i: any) => i.concluido).lenght,
    };
}


// Frontend para o backend
function converterMetaParaBackend(meta: {
    titulo: string;
    tipo: string;
    cor: string;
    fixada?: boolean;
    concluida?: boolean;
    itens: {id?: string; texto: string; concluido: boolean}[];
}) {
    return {
        titulo: meta.titulo,
        tipo: meta.tipo,
        cor: meta.cor,
        fixada: meta.fixada ?? false,
        concluida: meta.concluida ?? false,
        itens: meta.itens.map(i => ({
            descricao: i.texto,
            concluido: i.concluido,
        })),
    };
}

// Get

export async function buscarMetas() {
    const response = await request("/goal");
    return (response.goals ?? []).map(converterMetaDoBackend);
}


// Post
export async function criarMetas(meta: Parameters<typeof converterMetaParaBackend>[0]) {
    const body = converterMetaParaBackend(meta);
    console.log("POST /goal", body);
    return request("/goal", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

//Put
export async function atualizarMetas(id: string, meta: Parameters<typeof converterMetaParaBackend>[0]) {
    const body =  converterMetaParaBackend(meta);
    return request(`/goal/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

//Delete

export async function excluirMeta(id: string) {
    return request(`/goal/${id}`, {
        method: "DELETE",
    });
}