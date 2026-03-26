import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro"; // O nome deve ser igual ao do arquivo

function App() {
  return (
    <Router>
      <Routes>
        {/* O path "/" é a página inicial (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* O path "/cadastro" é onde sua nova tela vai morar */}
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
}

export default App;