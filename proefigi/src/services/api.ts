
const BASE_URL = "http://localhost:5084/api";

export async function request(path: string, options?: RequestInit) {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${BASE_URL}${path}`, {
        headers:{
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });

    if (!res.ok){
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.mensagem || `Erro ${res.status}: ${path}`);
    }

    return res.json();
}
