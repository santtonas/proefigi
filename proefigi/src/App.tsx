{/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";*/}
{/*import Login from "./pages/Login";*/}
{/*import Cadastro from "./pages/Cadastro";*/}
{/*import { Tela_inicial } from "./pages/Tela_inicial";*/}
import RoutesApp from './routes';
import { TarefaProvider } from './context/TarefaContext';
import { MetaProvider } from './context/MetaContext';

function App() {
  return (
    <TarefaProvider>
      <MetaProvider>
        <RoutesApp/>
      </MetaProvider>
    </TarefaProvider>
  )
}

export default App;