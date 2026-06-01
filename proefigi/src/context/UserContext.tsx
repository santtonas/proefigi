import { createContext, useContext, useState, ReactNode } from "react";
import { AlertaCustomizado } from "../utils/sweetAlert";
import { request } from "../services/api";

interface UserContextType {
  nome: string;
  email: string;
  foto: string | null;
  plano: string;
  membroDesde: string;
  setNome: (nome: string) => void;
  setEmail: (email: string) => void;
  setFoto: (foto: string | null) => void;
  salvarNoBanco: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Carrega os valores iniciais do localStorage (mockando o banco de dados por enquanto)
  const [nome, setNome] = useState(
    localStorage.getItem("proefigi_nome") || "Paulo",
  );
  const [email, setEmail] = useState(
    localStorage.getItem("proefigi_email") || "paulo@exemplo.com",
  );
  const [foto, setFoto] = useState<string | null>(
    localStorage.getItem("proefigi_avatar") || null,
  );

  // Metadados fixos do Tópico 3
  const plano = "Ativado";
  const membroDesde = "Janeiro de 2026";

  // Função simulando a conexão/salvamento no Banco de Dados
  const salvarNoBanco = async () => {
    // 1. Validação simples para não enviar dados vazios
    if (!nome || !email) {
      AlertaCustomizado.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "O nome de exibição e o e-mail não podem ficar vazios.",
        confirmButtonColor: "#007eb5",
      });
      return;
    }

    // 2. Integração com o Backend
    try {
      // Substitua "usuarios/atualizar-perfil" pela rota correta do seu colega
      await request("usuarios/atualizar-perfil", {
        method: "PUT", // Geralmente usamos PUT ou PATCH para atualizar dados
        body: JSON.stringify({
          nome: nome,
          email: email,
          foto: foto, // Como você usou readAsDataURL, a foto já está em Base64 (texto)
        }),
      });

      localStorage.setItem("proefigi_nome", nome);
      localStorage.setItem("proefigi_email", email);
      if (foto) {
        localStorage.setItem("proefigi_avatar", foto);
      } else {
        localStorage.removeItem("proefigi_avatar");
      }
      // 3. Sucesso!
      AlertaCustomizado.fire({
        icon: "success",
        title: "Perfil Atualizado",
        text: "Suas informações foram salvas com sucesso no banco de dados!",
        confirmButtonColor: "#007eb5",
      });
    } catch (erro: any) {
      console.error("Erro ao salvar perfil:", erro);

      // 4. Erro!
      AlertaCustomizado.fire({
        icon: "error",
        title: "Erro ao salvar",
        text:
          erro.message ||
          "Não foi possível atualizar suas informações no momento.",
        confirmButtonColor: "#007eb5",
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        nome,
        email,
        foto,
        plano,
        membroDesde,
        setNome,
        setEmail,
        setFoto,
        salvarNoBanco,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}
