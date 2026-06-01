import Swal from 'sweetalert2';
import './style.css';

// Criamos um "molde" com as suas configurações padrões
export const AlertaCustomizado = Swal.mixin({
  width: '460px', // 👈 Aumentando para 460px as frases ganham espaço para respirar
  padding: '24px', 
  confirmButtonColor: '#007eb5',
  cancelButtonColor: '#e0e0e0',
  customClass: {
    popup: 'ajuste-alerta-global', // 👈 Vamos criar essa classe no CSS para blindar o texto
  }
});