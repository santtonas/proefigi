import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f8fafc', 
      gap: '16px'
    }}>
      
      <Loader2 
        size={48} 
        style={{ 
          color: '#0ea5e9', 
          animation: 'spin 1s linear infinite' 
        }} 
      />
      
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <p style={{ 
        fontSize: '16px', 
        color: '#64748b', 
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500 
      }}>
        Preparando seu ambiente...
      </p>
    </div>
  );
}