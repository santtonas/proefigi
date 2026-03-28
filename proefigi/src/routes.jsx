import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tela_inicial } from './pages/Tela_inicial';
import Layout from './components/Layout';
import Login from './pages/Login';

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        
        <Route element={<Layout />}>
          <Route path="/" element={<Tela_inicial />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default RoutesApp;