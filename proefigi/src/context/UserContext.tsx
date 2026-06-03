import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  // Estados puxando o cache inicial do localStorage para não piscar a tela vazia
  const [nome, setNome] = useState(localStorage.getItem("proefigi_nome") || "");
  const [email, setEmail] = useState(localStorage.getItem("proefigi_email") || "");
  const [foto, setFoto] = useState<string | null>(localStorage.getItem("proefigi_avatar") || null);
  
  // Agora plano e membroDesde também são estados dinâmicos!
  const [plano, setPlano] = useState("Carregando...");
  const [membroDesde, setMembroDesde] = useState("...");

  // ==========================================
  // BUSCA OS DADOS DA API AO INICIAR O APP
  // ==========================================
  useEffect(() => {
    async function carregarPerfil() {
      try {
        // Substitua "usuarios/meu-perfil" pela rota de leitura do backend
        const resposta = await request("usuarios/meu-perfil", { 
          method: "GET" 
        });

        // Supondo que o backend responda com um objeto JSON contendo esses dados
        if (resposta) {
          setNome(resposta.nome);
          setEmail(resposta.email);
          setFoto(resposta.foto || null);
          setPlano(resposta.plano || "Básico"); // Puxa o plano real do banco
          setMembroDesde(resposta.membroDesde || "Data desconhecida");

          // Atualiza o cache local para o próximo carregamento ser instantâneo
          localStorage.setItem("proefigi_nome", resposta.nome);
          localStorage.setItem("proefigi_email", resposta.email);
          if (resposta.foto) {
            localStorage.setItem("proefigi_avatar", resposta.foto);
          }
        }
      } catch (erro) {
        console.error("Erro ao carregar os dados iniciais do usuário:", erro);
        // Opcional: Se der erro de token inválido (401), você pode forçar o logout aqui
      }
    }

    carregarPerfil();
  }, []); // A array vazia [] garante que isso rode apenas 1x quando o app abre

  // ==========================================
  // FUNÇÃO PARA SALVAR ALTERAÇÕES
  // ==========================================
  const salvarNoBanco = async () => {
    if (!nome || !email) {
      AlertaCustomizado.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "O nome de exibição e o e-mail não podem ficar vazios.",
        confirmButtonColor: "#007eb5",
      });
      return;
    }

    try {
      await request("usuarios/atualizar-perfil", {
        method: "PUT",
        body: JSON.stringify({
          nome: nome,
          email: email,
          foto: foto,
        }),
      });

      localStorage.setItem("proefigi_nome", nome);
      localStorage.setItem("proefigi_email", email);
      if (foto) {
        localStorage.setItem("proefigi_avatar", foto);
      } else {
        localStorage.removeItem("proefigi_avatar");
      }
      
      AlertaCustomizado.fire({
        icon: "success",
        title: "Perfil Atualizado",
        text: "Suas informações foram salvas com sucesso no banco de dados!",
        confirmButtonColor: "#007eb5",
      });
    } catch (erro: any) {
      console.error("Erro ao salvar perfil:", erro);
      AlertaCustomizado.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: erro.message || "Não foi possível atualizar suas informações no momento.",
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