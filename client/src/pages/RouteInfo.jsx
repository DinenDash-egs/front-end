import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteMap from '../pages/RouteMap';

const RouteInfo = () => {
  const [start, setStart] = useState({ latitude: 40.633106, longitude: -8.658746 });
  const [end, setEnd] = useState({ latitude: 40.627, longitude: -8.645 });
  const [route, setRoute] = useState(null);
  const [dragPosition, setDragPosition] = useState(100); // Posição inicial da aba
  const navigate = useNavigate();
  const dragRef = useRef(null);

  const maxDragPosition = window.innerHeight * 0.5; // A aba vai até 50% da altura da tela

  const handleDragStart = (e) => {
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = startY;
  };

  const handleDragMove = (e) => {
    if (dragRef.current !== null) {
      const currentY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = currentY - dragRef.current;
      setDragPosition((prev) => Math.max(100, Math.min(maxDragPosition, prev - deltaY))); // Limita entre 100px e 50% da altura da tela
      dragRef.current = currentY;
    }
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setDragPosition((prev) => (prev > maxDragPosition / 2 ? maxDragPosition : 100)); // Expande ou recolhe com base na posição
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <RouteMap start={start} end={end} route={route} setRoute={setRoute} />

      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'white',
          color: 'black',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        ←
      </button>

      {/* Aba expansível */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${dragPosition}px`, // Controla a altura da aba
          backgroundColor: 'white', // Fundo preto
          color: 'black', // Texto branco para contraste
          boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.2)', // Sombra para destacar
          borderTopLeftRadius: '20px', // Bordas arredondadas
          borderTopRightRadius: '20px',
          transition: dragRef.current ? 'none' : 'height 0.3s ease', // Suaviza quando não está arrastando
          overflow: 'hidden', // Garante que o conteúdo não ultrapasse a aba
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Indicador de arrastar */}
        <div
          style={{
            height: '8px',
            width: '50px',
            backgroundColor: '#ddd',
            borderRadius: '10px',
            margin: '10px auto',
          }}
        ></div>

        {/* Conteúdo rolável dentro da aba */}
        <div
          style={{
            height: `calc(${dragPosition}px - 40px)`, // Altura ajustada para o conteúdo
            overflowY: 'auto', // Permite rolagem dentro da aba
            padding: '20px',
            paddingTop: '0px',
          }}
        >
          {route ? (
          <div style={{ padding: '20px' }}>
            <p><strong>Distance:</strong> {route.total_distance_km.toFixed(2)} km</p>
            <p><strong>Estimated time:</strong> {route.estimated_time_min.toFixed(1)} minutes</p>
            <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #555' }} />
            <div>
              <strong>Instructions:</strong>
              <ol>
                {route.route_path.map((step, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    {step.instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', margin: '20px 0' }}>Loading route...</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;