import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Nav from '../Nav';

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="layout-global">
      <Header menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      <Nav menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      
      <main className="conteudo-da-pagina">
        <Outlet />
      </main>
    </div>
  );
}