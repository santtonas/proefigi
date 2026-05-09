import { request } from "./api";


export async function login(email: string, password: string) {
    return request("/login",{
        method:"POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function cadastro(name: string, email: string, password: string) {
    return request("/user", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),   
    });
}