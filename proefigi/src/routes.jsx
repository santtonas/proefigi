import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tela_inicial } from './pages/Tela_inicial';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cadastro from "./pages/Cadastro";
import Pomodoro from "./pages/Pomodoro";

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>

        <Route element={<Layout />}>
          <Route path="/inicio" element={<Tela_inicial />} />
          <Route path="/pomodoro" element={<Pomodoro/> }/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default RoutesApp;