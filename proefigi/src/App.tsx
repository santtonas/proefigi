import { useState, useEffect } from 'react'; 
import RoutesApp from './routes';
import { TarefaProvider } from './context/TarefaContext';
import { MetaProvider } from './context/MetaContext';
import { RestricaoProvider } from './context/RestricaoContext';
import { Loading } from './components/Loading'; 

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

 
  if (loading) {
    return <Loading />;
  }

 
  return (
    <TarefaProvider>
      <MetaProvider>
        <RestricaoProvider>
          <RoutesApp />
        </RestricaoProvider>
      </MetaProvider>
    </TarefaProvider>
  );
}

export default App;