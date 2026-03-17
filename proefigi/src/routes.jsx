import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import {Tela_inicial} from './pages/Tela_inicial';


function RoutesApp(){
    return(
        <BrowserRouter>
        <Header/> 
         <Routes>
            <Route path="/" element={ <Tela_inicial/> }/>
         </Routes>
        </BrowserRouter>  

    )
} 

export default RoutesApp;