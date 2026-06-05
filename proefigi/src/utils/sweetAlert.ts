import Swal from 'sweetalert2';
import './style.css';


export const AlertaCustomizado = Swal.mixin({
  width: '460px', 
  padding: '24px', 
  confirmButtonColor: '#007eb5',
  cancelButtonColor: '#e0e0e0',
  customClass: {
    popup: 'ajuste-alerta-global',
  },

  scrollbarPadding: false
});