'use client';

import { useEffect, useState } from 'react';
import { Partido } from '@/types';

export default function Home() {
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
    <main className="min-h-screen bg-gray-100 p-8 font-sans">
      {/* Encabezado */}
      <header 
        className="mb-8 rounded-lg p-6 text-center shadow-lg"
        style={{ backgroundColor: BOCA_BLUE, color: BOCA_GOLD }}
      >
        <h1 className="text-4xl font-bold uppercase tracking-wider">
          Campaña Boca Juniors
        </h1>
        <p className="mt-2 text-white opacity-90">Últimos resultados del Xeneize</p>
      </header>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center p-10">
          <p className="text-xl font-semibold text-gray-600">Cargando la pasión...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partidos.map((partido) => (
            <div
              key={partido.id}
              className="overflow-hidden rounded-xl border-2 bg-white shadow-md transition-transform hover:scale-105"
              style={{ borderColor: BOCA_GOLD }}
            >
              {/* Cabecera de la tarjeta */}
              <div 
                className="p-4 text-center"
                style={{ backgroundColor: BOCA_BLUE }}
              >
                <h2 
                  className="text-xl font-bold"
                  style={{ color: BOCA_GOLD }}
                >
                  vs {partido.rival}
                </h2>
                <span className="text-sm text-white opacity-80">
                  {partido.fecha} | {partido.condicion}
                </span>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div className="p-6 text-center">
                <div className="mb-4 text-5xl font-bold text-gray-800">
                  {partido.resultado}
                </div>
                
                <div className="border-t pt-4">
                  <p className="mb-2 text-xs font-bold uppercase text-gray-500">
                    Goleadores
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {partido.goleadores.length > 0 ? (
                      partido.goleadores.map((jugador, index) => (
                        <span
                          key={index}
                          className="rounded-full px-3 py-1 text-sm font-medium text-white"
                          style={{ backgroundColor: BOCA_BLUE }}
                        >
                          {jugador}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
