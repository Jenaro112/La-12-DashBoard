'use client';

import { useEffect, useState } from 'react';
import { Partido } from '@/types';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BOCA_BLUE, BOCA_GOLD } from '@/lib/constants';

export default function Resultados() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'Todos' | 'Local' | 'Visitante'>('Todos');

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await fetch('/api/partidos');
        if (!response.ok) throw new Error('Error al obtener los partidos');
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

  const partidosFiltrados = partidos.filter((partido) => {
    if (filtro === 'Todos') return true;
    return partido.condicion === filtro;
  });

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <main 
      className="min-h-screen font-sans text-white selection:bg-yellow-500 selection:text-blue-900"
      style={{ background: `radial-gradient(circle at top, #002F6C 0%, #001A3D 100%)` }}
    >
      {/* Header / Navegación */}
      <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container relative z-10 mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="group inline-flex items-center text-sm font-bold uppercase tracking-wider text-blue-200 transition-colors hover:text-yellow-400">
              <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
              Volver a La 12
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight md:text-6xl" style={{ color: BOCA_GOLD }}>
                Fixture y Resultados
              </h1>
              <p className="mt-2 text-lg font-medium text-blue-200/70">
                Temporada Oficial
              </p>
            </div>

            {/* Botonera de Filtros */}
            <div className="flex rounded-lg border border-white/10 bg-black/30 p-1 backdrop-blur-md">
              {['Todos', 'Local', 'Visitante'].map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => setFiltro(opcion as any)}
                  className={`relative px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                    filtro === opcion ? 'text-blue-900' : 'text-white hover:text-yellow-400'
                  }`}
                >
                  {filtro === opcion && (
                    <motion.div
                      layoutId="pill"
                      className="absolute inset-0 rounded-md shadow-lg"
                      style={{ backgroundColor: BOCA_GOLD }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{opcion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenedor Principal (Lista) */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4">
            <motion.div className="flex space-x-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: i === 1 ? BOCA_GOLD : BOCA_BLUE }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay }} />
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col gap-4"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {partidosFiltrados.map((partido) => {
                
                // LÓGICA DE POSICIONES
                const esLocal = partido.condicion === 'Local';
                const equipoIzquierda = esLocal ? 'Boca' : partido.rival;
                const equipoDerecha = esLocal ? partido.rival : 'Boca';
                
                // Clases de texto para resaltar a Boca siempre
                const claseBoca = "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]";
                const claseRival = "text-white/60";

                return (
                  <motion.div 
                    key={partido.id} 
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 md:px-8 md:py-6"
                  >
                    {/* Resplandor lateral dorado */}
                    <div className="absolute left-0 top-0 h-full w-1 origin-left scale-y-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-y-100"></div>

                    {/* USO DE GRID PARA ALINEACIÓN PERFECTA (NO MÁS CHUECO) */}
                    <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-12">
                      
                      {/* 1. Fecha y Competición (Ocupa 3 columnas) */}
                      <div className="flex flex-col text-center md:col-span-3 md:text-left">
                        <span className="mb-1 text-sm font-bold tracking-widest text-yellow-500">
                          {partido.fecha}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-200/60">
                          {partido.competicion}
                        </span>
                      </div>

                      {/* 2. El Partido (Ocupa 6 columnas en el centro) */}
                      <div className="grid items-center gap-4 md:col-span-6 md:grid-cols-[1fr_auto_1fr]">
                        
                        {/* Equipo Izquierda */}
                        <div className={`truncate text-right text-lg font-black uppercase tracking-tight md:text-2xl ${esLocal ? claseBoca : claseRival}`}>
                          {equipoIzquierda}
                        </div>
                        
                        {/* Marcador Central Clavado */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center rounded-xl border border-yellow-500/30 bg-[#001A3D]/80 px-4 py-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <span className="text-3xl font-black tracking-widest text-yellow-400">
                              {partido.resultado}
                            </span>
                          </div>
                          <span className="mt-2 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                            {partido.condicion}
                          </span>
                        </div>

                        {/* Equipo Derecha */}
                        <div className={`truncate text-left text-lg font-black uppercase tracking-tight md:text-2xl ${!esLocal ? claseBoca : claseRival}`}>
                          {equipoDerecha}
                        </div>
                      </div>

                      {/* 3. Goleadores (Ocupa 3 columnas) */}
                      <div className="flex flex-wrap justify-center gap-2 md:col-span-3 md:justify-end">
                        {partido.goleadores.length > 0 ? (
                          partido.goleadores.map((jugador, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-medium text-blue-100 backdrop-blur-md"
                            >
                              <span className="text-yellow-500">⚽</span> {jugador}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-medium italic text-white/30">Sin goles</span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {partidosFiltrados.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-12 text-center text-blue-200/50"
              >
                No hay partidos para mostrar con este filtro.
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}