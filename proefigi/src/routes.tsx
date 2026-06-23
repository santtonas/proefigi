import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import RecuperarSenha from './pages/RecuperarSenha';

import { useNavigate } from 'react-router-dom';

function AuthLayout() {
  const navigate = useNavigate();
  return (
    <div className="page-auth-wrapper">
      <nav className="nav-autenticacao">
        <div className="nav-auth-container">
       
          <div className="nav-auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span>Proefigi</span>
          </div>
          <div className="nav-auth-links">
            <button className="nav-auth-btn-primario" onClick={() => navigate('/')}>
              Entrar
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

function RoutesApp() {
  return (
    <BrowserRouter>
    
        <MonitorDeHorarios />
        <Routes>
          
          <Route path="/" element={<Login/>}/>

          {/* ROTAS COM A NAVBAR DE AUTENTICAÇÃO COMPARTILHADA */}
          <Route element={<AuthLayout />}>
            <Route path="/cadastro" element={<Cadastro/>}/>
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          </Route>

          {/* ROTAS PRIVADAS (Com a Navbar interna do sistema) */}
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
     
    </BrowserRouter>
  );
}

export default RoutesApp;