import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tela_inicial } from './pages/Tela_inicial';
import Layout from './components/Layout'; // Sem as chaves {}

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<Layout />}>
          <Route path="/" element={<Tela_inicial />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default RoutesApp;