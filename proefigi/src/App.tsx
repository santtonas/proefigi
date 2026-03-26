import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota de Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
}

export default App;