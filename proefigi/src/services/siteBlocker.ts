import { request } from "./api";

interface SiteBlockedBackend {
    id: number;
    url: string;
    isBlocked: boolean;
}


export async function buscarSitesBloqueados() {
  const response = await request("/siteblocked");
  console.log("response GET siteblocked:", response);
  return (response?.siteBlocked ?? []).map((s: SiteBlockedBackend) => ({
    id: s.id,
    nome: s.url,
    ativo: s.isBlocked,
  }));
}

export async function criarSiteBloqueado(url: string) {
    return request("/siteblocked", {
        method: "POST",
        body: JSON.stringify({ url, isBlocked: true}),
    });
}

export async function excluirSiteBloqueado(id: number){
    return request(`/siteblocked/${id}`, {
        method: "DELETE",
    });
}

