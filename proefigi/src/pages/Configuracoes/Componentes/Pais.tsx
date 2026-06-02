import { ArrowLeft } from 'lucide-react';

interface PaisProps {
  aoVoltar: () => void;
}

export default function Pais({ aoVoltar }: PaisProps) {
  return (
    <div className="config-box-vertical animacao-tela-nova">
      <button className="btn-voltar" onClick={aoVoltar}>
        <ArrowLeft size={18} /> Voltar para Configurações
      </button>

      <h1 className="painel-titulo">Controle dos Pais</h1>
      <p className="painel-subtitulo">Gerencie restrições de tempo e bloqueios de segurança.</p>
      
      <div className="form-secao">
        <div className="form-grupo">
          <label>Definir PIN de Segurança (4 dígitos)</label>
          <input type="password" maxLength={4} placeholder="••••" className="input-padrao" style={{ width: '120px' }} />
        </div>
        <div className="form-grupo">
          <label>Tempo máximo de estudo diário</label>
          <select className="input-padrao">
            <option>Sem limite</option>
            <option>2 horas</option>
            <option>4 horas</option>
          </select>
        </div>
      </div>
      
      <button className="btn-primario">Ativar Restrições</button>
    </div>
  );
}