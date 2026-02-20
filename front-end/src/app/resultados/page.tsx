'use client';

import { useEffect, useState } from 'react';
import { Partido } from '@/types';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Resultados() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'Todos' | 'Local' | 'Visitante'>('Todos');

  const BOCA_BLUE = '#00305D';
  const BOCA_GOLD = '#F3B229';

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
                
                const esLocal = partido.condicion === 'Local';
                const equipoIzquierda = esLocal ? 'Boca' : partido.rival;
                const equipoDerecha = esLocal ? partido.rival : 'Boca';
                const esLibertadores = partido.competicion.toLowerCase().includes('libertadores');
                
                const escudoBoca = '/escudos/Argentinos/boca.png';
                const escudoRival = partido.escudoRival || '/escudos/Argentinos/default.png';
                
                const escudoIzquierda = esLocal ? escudoBoca : escudoRival;
                const escudoDerecha = esLocal ? escudoRival : escudoBoca;

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
                  >
                    <Link 
                      href={`/resultados/${partido.id}`}
                      className={`group relative block overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all duration-500 ease-out md:px-6 md:py-5 ${
                        esLibertadores 
                          ? 'border-[#D4AF37]/30 bg-black/60 hover:-translate-y-1 hover:border-[#D4AF37] hover:bg-[#000511] hover:shadow-[0_15px_40px_rgba(212,175,55,0.3)]' 
                          : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                      }`}
                    >
                      
                      {/* ===========================================================================
                          🏆 ANIMACIÓN ESTILO ECLIPSE (Solo Libertadores)
                      =========================================================================== */}
                      {esLibertadores && (
                        <>
                          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37] opacity-0 blur-[40px] transition-all duration-700 ease-out group-hover:scale-[4] group-hover:opacity-20"></div>
                          <div className="pointer-events-none absolute left-0 top-0 z-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:scale-x-100 group-hover:opacity-100"></div>
                          <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:scale-x-100 group-hover:opacity-100"></div>
                        </>
                      )}

                      <div className={`absolute left-0 top-0 h-full w-1 origin-left scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 ${
                        esLibertadores ? 'bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]' : 'bg-yellow-500'
                      }`}></div>

                      {/* Contenido (relative z-10) */}
                      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 md:grid-cols-12">
                        
                        {/* 1. Fecha y Competición */}
                        <div className="flex flex-col text-center md:col-span-2 md:text-left">
                          <span className={`mb-1 text-sm font-bold tracking-widest transition-all duration-500 ${esLibertadores ? 'text-[#D4AF37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-yellow-500'}`}>
                            {partido.fecha}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/60 leading-tight">
                            {partido.competicion}
                          </span>
                        </div>

                        {/* 2. El Partido */}
                        <div className="grid items-center gap-2 md:gap-4 md:col-span-8 grid-cols-[1fr_auto_1fr]">
                          
                          {/* Equipo Izquierda + Escudo */}
                          <div className="flex items-center justify-end gap-3 md:gap-4 overflow-hidden">
                            <span className={`truncate text-right text-base font-black uppercase tracking-tight transition-all duration-500 md:text-2xl ${esLocal ? claseBoca : claseRival} ${esLibertadores ? 'group-hover:tracking-widest group-hover:text-white' : ''}`}>
                              {equipoIzquierda}
                            </span>
                            {/* ACÁ ESTÁ EL FIX: Agregué p-0.5 md:p-1 para normalizar tamaños */}
                            <div className="relative h-8 w-8 shrink-0 p-0.5 md:h-12 md:w-12 md:p-1 transition-transform duration-500 group-hover:scale-110">
                              <Image src={escudoIzquierda} alt={equipoIzquierda} fill className="object-contain drop-shadow-lg" />
                            </div>
                          </div>
                          
                          {/* Marcador Central */}
                          <div className="flex flex-col items-center justify-center px-2">
                            <div className={`flex items-center justify-center rounded-xl border px-3 py-1.5 md:px-4 md:py-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-110 ${
                              esLibertadores
                                ? 'border-[#D4AF37]/40 bg-black/80 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                                : 'border-yellow-500/30 bg-[#001A3D]/80'
                            }`}>
                              <span className={`text-2xl md:text-3xl font-black tracking-widest transition-all duration-500 ${esLibertadores ? 'text-[#D4AF37] group-hover:text-white group-hover:drop-shadow-[0_0_8px_#D4AF37]' : 'text-yellow-400'}`}>
                                {partido.resultado}
                              </span>
                            </div>
                            <span className="mt-1 md:mt-2 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/80">
                              {partido.condicion}
                            </span>
                          </div>

                          {/* Escudo + Equipo Derecha */}
                          <div className="flex items-center justify-start gap-3 md:gap-4 overflow-hidden">
                            {/* ACÁ ESTÁ EL FIX: Agregué p-0.5 md:p-1 para normalizar tamaños */}
                            <div className="relative h-8 w-8 shrink-0 p-0.5 md:h-12 md:w-12 md:p-1 transition-transform duration-500 group-hover:scale-110">
                              <Image src={escudoDerecha} alt={equipoDerecha} fill className="object-contain drop-shadow-lg" />
                            </div>
                            <span className={`truncate text-left text-base font-black uppercase tracking-tight transition-all duration-500 md:text-2xl ${!esLocal ? claseBoca : claseRival} ${esLibertadores ? 'group-hover:tracking-widest group-hover:text-white' : ''}`}>
                              {equipoDerecha}
                            </span>
                          </div>
                        </div>

                        {/* 3. Goleadores */}
                        <div className="flex flex-wrap justify-center gap-1.5 md:col-span-2 md:justify-end">
                          {partido.goleadores.length > 0 ? (
                            partido.goleadores.map((jugador, index) => (
                              <span
                                key={index}
                                className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] md:text-xs font-medium backdrop-blur-md transition-all duration-500 ${
                                  esLibertadores
                                    ? 'border-[#D4AF37]/20 bg-black/40 text-[#D4AF37]/80 group-hover:-translate-y-0.5 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37]'
                                    : 'border-white/10 bg-black/20 text-blue-100/70'
                                }`}
                              >
                                <span className={esLibertadores ? "text-[#D4AF37]" : "text-yellow-500/70"}>⚽</span> {jugador}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] md:text-xs font-medium italic text-white/30">Sin goles</span>
                          )}
                        </div>

                      </div>
                    </Link>
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