{/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";*/}
{/*import Login from "./pages/Login";*/}
{/*import Cadastro from "./pages/Cadastro";*/}
{/*import { Tela_inicial } from "./pages/Tela_inicial";*/}
import RoutesApp from './routes';
import { TarefaProvider } from './context/TarefaContext';

function App() {
  return (
    <TarefaProvider>
      <RoutesApp/>
    </TarefaProvider>
  )
}

export default App;