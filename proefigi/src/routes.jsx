import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  {Home}  from "./pages/home";

import Layout from './components/Layout';
import Login from './pages/Login';
import Cadastro from "./pages/Cadastro";
import Pomodoro from "./pages/Pomodoro";
import Progresso from "./pages/Progresso";
import Metas from "./pages/Metas";
import {Calendario} from "./pages/Calendario";
import {TarefaProvider} from './context/TarefaContext';


function RoutesApp() {
  return (
    <BrowserRouter>
    <TarefaProvider>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>

        <Route element={<Layout />}>
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/pomodoro" element={<Pomodoro/> }/>
          <Route path="/progresso" element={<Progresso/>}/>
          <Route path="/metas" element={<Metas/>}/>
          <Route path="/home" element={<Home/>}/>
        </Route>

      </Routes>
    </TarefaProvider>
    </BrowserRouter>
  );
}

export default RoutesApp;