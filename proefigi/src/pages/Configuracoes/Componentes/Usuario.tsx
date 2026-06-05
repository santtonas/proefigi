import { useRef, useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import {ArrowLeft, Camera, MoreVertical, Crop, ZoomIn ,ZoomOut} from "lucide-react";
import { useCallback } from "react"; 
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";
import { AlertaCustomizado } from "../../../utils/sweetAlert";
import { request } from "../../../services/api";
import "./Usuario.css";

interface UsuarioProps {
  aoVoltar: () => void;
}

export default function Usuario({ aoVoltar }: UsuarioProps) {
  const {
    nome,
    setNome,
    email,
    setEmail,
    foto,
    membroDesde,
    salvarNoBanco,
    salvarFotoNoBanco,
  } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [erroSenha, setErroSenha] = useState(false);
  const [senhaEmFoco, setSenhaEmFoco] = useState(false);

  // ==========================================
  // ESTADOS PARA O RECORTE DE FOTO
  // ==========================================
  const [modalCorteAberto, setModalCorteAberto] = useState(false);
  const [imagemParaCortar, setImagemParaCortar] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const cancelarAlteracao = () => {
    
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");

   
    setErroSenha(false);

   
    setMostrarSenhaAtual(false);
    setMostrarNovaSenha(false);
    setMostrarConfirmarSenha(false);
    setModalSenhaAberto(false);
  };

  const confirmarAlteracaoSenha = async () => {
    // 1. Verifica se o usuário não deixou nada em branco
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      AlertaCustomizado.fire({
        icon: "warning",
        title: "Atenção",
        text: "Por favor, preencha todos os campos.",
        width: "350px",
        padding: "20px",
        color: "#334155",
        background: "#ffffff",
        iconColor: "#f59e0b",
        confirmButtonColor: "#007eb5",
        confirmButtonText: "OK",
      });
      return;
    }

    // 2. Lógica de força da senha
    const temOitoCaracteres = novaSenha.length >= 8;
    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha);

    if (!temOitoCaracteres || !temSimbolo) {
      setErroSenha(true);
      return;
    }
    setErroSenha(false);

    // 3. Verifica se a nova senha e a confirmação batem
    if (novaSenha !== confirmarSenha) {
      AlertaCustomizado.fire({
        icon: "error",
        title: "Senhas Diferentes",
        text: "A nova senha e a confirmação não batem. Tente novamente.",
        width: "350px",
        padding: "20px",
        color: "#334155",
        background: "#ffffff",
        iconColor: "#ef4444",
        confirmButtonColor: "#007eb5",
        confirmButtonText: "OK",
      });
      return;
    }

    // ====================================================================
    // 4. INTEGRAÇÃO COM A API (USANDO O REQUEST DO PROJETO)
    // ====================================================================
    try {
      // Lembre-se de substituir "NOME_DA_ROTA_AQUI" pelo caminho do backend (ex: "usuarios/alterar-senha")
      await request("NOME_DA_ROTA_AQUI", {
        method: "POST",
        body: JSON.stringify({
          senhaAtual: senhaAtual,
          novaSenha: novaSenha,
        }),
      });

    
      AlertaCustomizado.fire({
        icon: "success",
        title: "Tudo Certo!",
        text: "Sua senha foi alterada com sucesso!",
        width: "350px",
        padding: "20px",
        color: "#334155",
        background: "#ffffff",
        iconColor: "#10b981",
        confirmButtonColor: "#007eb5",
        confirmButtonText: "Concluir",
      });

      // Limpa os campos e fecha o modal automaticamente
      cancelarAlteracao();
    } catch (erro) {
      console.error("Erro na requisição:", erro);

      
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível alterar a senha no momento.";

      AlertaCustomizado.fire({
        icon: "error",
        title: "Atenção",
        text: mensagemErro,
        width: "350px",
        padding: "20px",
        confirmButtonColor: "#007eb5",
        confirmButtonText: "Tentar Novamente",
      });
    }
  }; 
 
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    function clicarFora(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", clicarFora);
    return () => document.removeEventListener("mousedown", clicarFora);
  }, []);

  const lidarComMudancaDeFoto = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        
        setImagemParaCortar(reader.result as string);
        setZoom(1);
        setModalCorteAberto(true);
      };
      reader.readAsDataURL(arquivo);
    }
  };

  
  type AreaCorte = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

 
  const onCropComplete = useCallback(
    (_croppedArea: AreaCorte, croppedAreaPixels: AreaCorte) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  
  const confirmarCorte = async () => {
    if (!imagemParaCortar || !croppedAreaPixels) return;

    try {
      
      const imagemCortadaBase64 = await getCroppedImg(
        imagemParaCortar,
        croppedAreaPixels,
      );

    
      await salvarFotoNoBanco(imagemCortadaBase64);

      setModalCorteAberto(false); 
      setImagemParaCortar(null); 
    } catch (erro) {
      console.error("Erro ao cortar a imagem:", erro);
      alert("Não foi possível processar o recorte da imagem.");
    }
  };

  
  const cancelarCorte = () => {
    setModalCorteAberto(false);
    setImagemParaCortar(null);
  };

  // ==========================================
  // 1. FUNÇÃO PARA EXCLUIR DADOS
  // ==========================================
  const acaoExcluirDados = async () => {
    setMenuAberto(false); 

    
    const resultado = await AlertaCustomizado.fire({
      title: "Tem certeza?",
      text: "Todos os seus dados de progresso serão apagados. Isso não pode ser desfeito!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", 
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
       
        await request("usuarios/limpar-dados", { method: "DELETE" });

        AlertaCustomizado.fire(
          "Tudo limpo!",
          "Seus dados foram excluídos com sucesso.",
          "success",
        );
      } catch (erro) {
       
        const mensagemErro =
          erro instanceof Error
            ? erro.message
            : "Não foi possível excluir os dados.";

        AlertaCustomizado.fire("Erro", mensagemErro, "error");
      }
    }
  };

  // ==========================================
  // 2. FUNÇÃO PARA EXCLUIR A CONTA
  // ==========================================
  const acaoExcluirConta = async () => {
    setMenuAberto(false);

    const resultado = await AlertaCustomizado.fire({
      title: "Excluir conta permanentemente?",
      text: "Você perderá seu acesso e todos os dados. Essa ação é irreversível!",
      icon: "error", 
      showCancelButton: true,
      confirmButtonColor: "#dc2626", 
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
       
        await request("usuarios/deletar-conta", { method: "DELETE" });

       
        localStorage.removeItem("token");
        window.location.href = "/"; 
      } catch (erro) {
        
        const mensagemErro =
          erro instanceof Error
            ? erro.message
            : "Não foi possível excluir a conta.";

        AlertaCustomizado.fire("Erro", mensagemErro, "error");
      }
    }
  };

  // ==========================================
  // 3. FUNÇÃO PARA SAIR DA CONTA (LOGOUT)
  // ==========================================
  const fazerLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/";
  };

  // Abre o SweetAlert para visualizar grande, alterar ou remover a foto
  const abrirVisualizacaoFoto = () => {
   
    if (!foto) {
      fileInputRef.current?.click();
      return;
    }

    
    AlertaCustomizado.fire({
      title: "Foto de Perfil",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <img src="${foto}" alt="Foto Ampliada" style="width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 4px solid #007eb5;" />
          <p style="margin: 0; color: #64748b; font-size: 14px;">O que deseja fazer com sua foto?</p>
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Alterar Foto",
      denyButtonText: "Remover Foto",
      cancelButtonText: "Fechar",
      confirmButtonColor: "#007eb5",
      denyButtonColor: "#ef4444", 
    }).then((result) => {
      if (result.isConfirmed) {
       
        fileInputRef.current?.click();
      } else if (result.isDenied) {
       
        salvarFotoNoBanco(null);

        AlertaCustomizado.fire({
          icon: "success",
          title: "Removida!",
          text: "Sua foto de perfil foi removida com sucesso.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      className="config-box-vertical animacao-tela-nova"
      style={{ position: "relative" }}
    >
      {/* CABEÇALHO COM BOTÃO VOLTAR E TRÊS PONTINHOS  */}
      <div
        style={{
          width: "100%",
          height: "32px",
          marginBottom: "24px",
          position: "relative",
        }}
      >
        
        <button
          className="btn-voltar"
          onClick={aoVoltar}
          style={{ margin: 0, position: "absolute", left: 0, top: 0 }}
        >
          <ArrowLeft size={18} /> Voltar para Configurações
        </button>

        
        <div
          className="dropdown-container"
          ref={menuRef}
          style={{ position: "absolute", right: 0, top: 0 }}
        >
          <button
            className="btn-tres-pontinhos"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <MoreVertical size={20} />
          </button>

          {menuAberto && (
            <div className="dropdown-menu-suspenso">
              <button
                onClick={acaoExcluirDados}
                className="dropdown-item texto-perigo"
              >
                Excluir dados
              </button>
              <button
                onClick={acaoExcluirConta}
                className="dropdown-item texto-perigo"
              >
                Excluir conta
              </button>
              <div className="dropdown-divisor"></div>
              <button
                onClick={() => setMenuAberto(false)}
                className="dropdown-item texto-cancelar"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="painel-titulo">Informações da Conta</h1>
      <p className="painel-subtitulo">
        Gerencie seus dados de perfil e e-mail.
      </p>

      {/* SEÇÃO DA FOTO */}
      <div className="perfil-foto-container">
        <div
          className="avatar-container-relativo"
          onClick={abrirVisualizacaoFoto}
        >
          <div className="avatar-wrapper">
            {foto ? (
              <img src={foto} alt="Foto de Perfil" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {nome ? nome.charAt(0).toUpperCase() : "P"}
              </div>
            )}
          </div>
          <div className="camera-badge">
            <Camera size={14} />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={lidarComMudancaDeFoto}
          key={imagemParaCortar || "input-foto"}
        />
      </div>

      {/* FORMULÁRIO DE DADOS */}
      <div className="form-secao">
        <div className="form-grupo">
          <label>Nome de Exibição</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-padrao"
          />
        </div>
        <div className="form-grupo">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-padrao"
          />
        </div>
      </div>

      {/* 1. ÁREA DOS BOTÕES (ALTERAR E SALVAR) */}
     
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          className="botao-alterar"
          onClick={() => setModalSenhaAberto(true)}
        >
          Alterar senha
        </button>

        <button className="btn-primario" onClick={salvarNoBanco}>
          Salvar Alterações
        </button>
      </div>

      

      <hr className="divisor" style={{ margin: "32px 0" }} />

      {/* 3. SEÇÃO  (MEMBRO) */}
      <div
        className="plano-info-box"
        style={{ width: "100%", marginBottom: "24px" }}
      >
        <p style={{ fontSize: "14px", margin: 0, color: "#475569" }}>
          <strong>Membro desde:</strong> {membroDesde}
        </p>
      </div>

      {/* 4. BOTÃO SAIR DA CONTA */}
      <button
        className="btn-secundario"
        style={{ width: "100%" }}
        onClick={fazerLogout}
      >
        Sair da conta
      </button>

      {/* MODAL DE ALTERAR SENHA */}
      {modalSenhaAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h3>Alterar Senha</h3>
            <p>Digite sua senha atual e a nova senha que deseja utilizar.</p>

            {/* SENHA ATUAL */}
            <div className="input-group">
              <label>Senha Atual</label>
              <div className="input-wrapper">
                <input
                  type={mostrarSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-mostrar-senha"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                  aria-label={
                    mostrarSenhaAtual ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  
                  {mostrarSenhaAtual ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* NOVA SENHA */}
            <div className="input-group">
              <label>Nova Senha</label>
              <div className="input-wrapper">
                <input
                  type={mostrarNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  onFocus={() => setSenhaEmFoco(true)}
                  onBlur={() => setSenhaEmFoco(false)}
                />
                <button
                  type="button"
                  className="btn-mostrar-senha"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  aria-label={
                    mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {mostrarNovaSenha ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  )}
                </button>
              </div>

              {/* MENSAGEM DE AJUDA / ERRO */}
              {(senhaEmFoco || erroSenha) && (
                <span
                  className={`texto-ajuda-senha ${erroSenha ? "tem-erro" : ""}`}
                >
                  A senha deve ter pelo menos 8 caracteres e 1 símbolo especial
                  (ex: @, #, !).
                </span>
              )}
            </div>

            {/* CONFIRMAR NOVA SENHA */}
            <div className="input-group">
              <label>Confirmar Nova Senha</label>
              <div className="input-wrapper">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-mostrar-senha"
                  onClick={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                  aria-label={
                    mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {mostrarConfirmarSenha ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="modal-botoes">
              <button
                type="button"
                className="btn-modal-cancelar"
                onClick={cancelarAlteracao}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-confirmar"
                onClick={confirmarAlteracaoSenha}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE RECORTE DE FOTO DE PERFIL           */}
      {/* ========================================== */}
      {modalCorteAberto && imagemParaCortar && (
        <div className="modal-overlay corte-overlay">
          <div className="modal-conteudo corte-conteudo">
            {/* Título do Modal */}
            <div className="corte-header">
              <Crop size={22} color="#007eb5" />
              <h3>Ajustar Foto</h3>
            </div>

            {/*  ÁREA DE RECORTE */}
            <div className="corte-container-cropper">
              <Cropper
                image={imagemParaCortar}
                crop={crop}
                zoom={zoom}
                aspect={1} 
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round" 
                showGrid={false}
              />
            </div>

            {/*  CONTROLES DE ZOOM */}
            <div className="corte-controles-zoom">
              <ZoomOut size={16} color="#64748b" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="corte-slider-zoom"
              />
              <ZoomIn size={16} color="#64748b" />
            </div>

            {/*  BOTÕES DE AÇÃO */}
            <div className="modal-botoes corte-botoes">
              <button
                type="button"
                className="btn-modal-cancelar"
                onClick={cancelarCorte}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-confirmar"
                onClick={confirmarCorte}
              >
                Aplicar Recorte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
