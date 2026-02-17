'use client';

import { useEffect, useState } from 'react';
import { Partido } from '@/types';

export default function Resultados() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  // Colores de Boca definidos en constantes para reutilización
  const BOCA_BLUE = '#00305D';
  const BOCA_GOLD = '#F3B229';

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await fetch('/api/partidos');
        if (!response.ok) {
          throw new Error('Error al obtener los partidos');
        }
        const data = await response.json();
        setPartidos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Section */}
      <div 
        className="w-full py-16 shadow-lg"
        style={{ backgroundColor: BOCA_BLUE, color: BOCA_GOLD }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 
            className="mb-2 text-5xl font-black uppercase tracking-tight md:text-6xl"
            style={{ color: BOCA_GOLD }}
          >
            Boca Juniors
          </h1>
          <p className="text-lg font-medium text-blue-100 opacity-90">
            Resultados y Estadísticas de la Temporada
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div 
              className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" 
              style={{ borderColor: BOCA_GOLD, borderTopColor: 'transparent' }}
            ></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {partidos.map((partido) => (
              <div
                key={partido.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Cabecera de la tarjeta: Competición y Condición */}
                <div className="flex items-center justify-between bg-gray-100 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="truncate pr-2">{partido.competicion}</span>
                  <span 
                    className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                      partido.condicion === 'Local' ? 'bg-blue-600' : 'bg-gray-500'
                    }`}
                  >
                    {partido.condicion}
                  </span>
                </div>

                {/* Cuerpo del partido */}
                <div className="flex flex-col items-center p-6">
                  <div className="mb-3 text-sm font-semibold text-gray-400">
                    {partido.fecha}
                  </div>
                  
                  <div className="mb-6 flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center">
                      <span className="text-xl font-bold text-gray-800">Boca</span>
                    </div>
                    
                    <div 
                      className="mx-2 flex h-14 w-20 items-center justify-center rounded-lg text-2xl font-black tracking-widest shadow-inner"
                      style={{ backgroundColor: '#f1f5f9', color: BOCA_BLUE }}
                    >
                      {partido.resultado}
                    </div>
                    
                    <div className="flex flex-1 flex-col items-center text-center">
                      <span className="text-xl font-bold text-gray-800">{partido.rival}</span>
                    </div>
                  </div>

                  {/* Goleadores */}
                  <div className="w-full">
                    {partido.goleadores.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {partido.goleadores.map((jugador, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(243, 178, 41, 0.15)', color: '#9a6b00' }}
                          >
                            ⚽ {jugador}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="h-5 text-center text-xs italic text-gray-300">Sin goles</div>
                    )}
                  </div>
                </div>
                
                {/* Decoración inferior */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${BOCA_BLUE} 50%, ${BOCA_GOLD} 50%)` }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}