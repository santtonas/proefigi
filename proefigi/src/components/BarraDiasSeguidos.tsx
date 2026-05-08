import React, { useState, useEffect } from 'react';
// Lembre-se de importar o CSS aqui, ou deixar no style.css global
// import './style.css'; 

export function BarraDiasSeguidos() {
  const [dias, setDias] = useState(0);


// O useEffect agora puxa os dados e também fica escutando atualizações!
  useEffect(() => {
    // Função que puxa os dados do localStorage
    const carregarDias = () => {
      const diasSalvos = localStorage.getItem('@proefigi:diasSeguidos');
      if (diasSalvos) {
        setDias(Number(diasSalvos));
      }
    };

    // Roda a primeira vez quando a tela abre
    carregarDias();

    // Fica escutando o evento que nós criamos no TarefaContext
    window.addEventListener('atualizouDiasSeguidos', carregarDias);

    // Limpa o evento quando sair da tela
    return () => {
      window.removeEventListener('atualizouDiasSeguidos', carregarDias);
    };
  }, []);

  return (
    <div className="barra-dias-seguidos">
      <span className="icone-estrela">⭐</span>
      <p><strong>{dias}</strong> dias seguidos estudando!</p>
    </div>
  );
}