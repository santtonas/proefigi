import React, { useState, useEffect } from 'react';
import {Rocket} from 'lucide-react';

// import './style.css'; 

export function BarraDiasSeguidos() {
  const [dias, setDias] = useState(0);



  useEffect(() => {
    
    const carregarDias = () => {
      const diasSalvos = localStorage.getItem('@proefigi:diasSeguidos');
      if (diasSalvos) {
        setDias(Number(diasSalvos));
      }
    };

  
    carregarDias();

   
    window.addEventListener('atualizouDiasSeguidos', carregarDias);

    
    return () => {
      window.removeEventListener('atualizouDiasSeguidos', carregarDias);
    };
  }, []);

  return (
    <div className="barra-dias-seguidos">
      <Rocket size={25}/>
      <p><strong>{dias}</strong> dias seguidos estudando!</p>
    </div>
  );
}