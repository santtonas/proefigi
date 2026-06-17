import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/home";

import Layout from './components/Layout';
import Login from './pages/Login';
import Cadastro from "./pages/Cadastro";
import Pomodoro from "./pages/Pomodoro";
import Progresso from "./pages/Progresso";
import Metas from "./pages/Metas";
import Rotina from "./pages/Rotina"; 
import Restricao from "./pages/Restricao"; 
import Configuracoes from "./pages/Configuracoes";
import Ajuda from './pages/Ajuda';

import { Calendario } from "./pages/Calendario";
import { MonitorDeHorarios } from './components/MonitorDeHorarios';
{/*import { TarefaProvider } from './context/TarefaContext';*/}
import RecuperarSenha from './pages/RecuperarSenha';

function RoutesApp() {
  return (
    <BrowserRouter>
      {/*<TarefaProvider>*/}
        <MonitorDeHorarios />
        <Routes>
          
          
          <Route path="/" element={<Login/>}/>
          <Route path="/cadastro" element={<Cadastro/>}/>
          
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

          
          <Route element={<Layout />}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/pomodoro" element={<Pomodoro/> }/>
            <Route path="/progresso" element={<Progresso/>}/>
            <Route path="/metas" element={<Metas/>}/>
            <Route path="/rotina" element={<Rotina/>}/> 
            <Route path="/restricao" element={<Restricao/>}/> 
            <Route path="/configuracoes" element={<Configuracoes/>}/>
            <Route path="/ajuda" element={<Ajuda />} />
          </Route>

        </Routes>
      {/*</TarefaProvider>*/}
    </BrowserRouter>
  );
}

export default RoutesApp;