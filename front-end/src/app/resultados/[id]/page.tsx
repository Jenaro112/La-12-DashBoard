'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Partido } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PLANTEL_BOCA } from '@/lib/plantel';

const BOCA_BLUE = '#00305D';
const BOCA_GOLD = '#F3B229';

export default function DetallePartido() {
  const params = useParams();
  const id = params.id as string;
  
  const [partido, setPartido] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartido = async () => {
      try {
        const response = await fetch('/api/partidos');
        const data: Partido[] = await response.json();
        const partidoEncontrado = data.find((p) => p.id === id);
        setPartido(partidoEncontrado || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartido();
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#001A3D] text-blue-200 font-bold uppercase tracking-widest">Cargando estadísticas...</div>;
  if (!partido) return <div className="flex min-h-screen items-center justify-center bg-[#001A3D] text-red-400 font-bold uppercase">Partido no encontrado.</div>;

  const getJugadorInfo = (jugadorId: string) => {
    const jugador = PLANTEL_BOCA.find(j => j.id === jugadorId);
    return jugador || { nombre: jugadorId, numero: '?', posicion: '-' };
  };

  const esLocal = partido.condicion === 'Local';
  const equipoLocal = esLocal ? 'Boca Juniors' : partido.rival;
  const equipoVisitante = esLocal ? partido.rival : 'Boca Juniors';
  const golesLocal = partido.resultado.split('-')[0];
  const golesVisitante = partido.resultado.split('-')[1];

  // Lógica de Escudos
  // Si no le pusiste escudo al rival en la API, va a intentar no romperse (fallback)
  const escudoBoca = '/escudos/Argentinos/boca.png'; // <-- ¡Ruta actualizada!
  const escudoRival = partido.escudoRival || '/escudos/Argentinos/default.png';
  
  const escudoIzquierda = esLocal ? escudoBoca : escudoRival;
  const escudoDerecha = esLocal ? escudoRival : escudoBoca;

  // Lógica de Formación
  const getLineasFormacion = () => {
    if (!partido.formacion) return [];
    const esquema = partido.formacion.esquema;
    const titulares = partido.formacion.titulares;
    const lineas = [[titulares[0]]]; 
    const numerosEsquema = esquema.split('-').map(Number);
    let index = 1;
    numerosEsquema.forEach(cantidad => {
      lineas.push(titulares.slice(index, index + cantidad));
      index += cantidad;
    });
    return lineas; 
  };

  const lineasCancha = getLineasFormacion();

  // --- Componentes Internos ---
  const KeyStatRing = ({ label, valBoca, valRival, isPorcentaje = false }: { label: string, valBoca: number, valRival: number, isPorcentaje?: boolean }) => {
    const total = valBoca + valRival;
    const porcentajeBoca = total === 0 ? 50 : Math.round((valBoca / total) * 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (porcentajeBoca / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-blue-200 mb-3 text-center">{label}</h3>
            <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90 transform">
                    <circle cx="48" cy="48" r="40" stroke="#A0AEC0" strokeWidth="8" fill="transparent" className="opacity-30" />
                    <motion.circle 
                        cx="48" cy="48" r="40" stroke={BOCA_GOLD} strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-white" style={{ textShadow: `0 0 10px ${BOCA_GOLD}` }}>
                        {valBoca}{isPorcentaje ? '%' : ''}
                    </span>
                    <span className="text-[10px] font-bold text-blue-300">BOCA</span>
                </div>
            </div>
             <div className="mt-2 text-sm font-bold text-gray-400">{valRival}{isPorcentaje ? '%' : ''} Rival</div>
        </div>
    )
  }

  const StatBarModern = ({ label, valBoca, valRival }: { label: string, valBoca: number, valRival: number }) => {
    const total = valBoca + valRival;
    const porcentajeBoca = total === 0 ? 50 : (valBoca / total) * 100;
    
    return (
      <div className="mb-5 w-full">
        <div className="flex justify-between mb-2 text-xs font-bold uppercase tracking-wider px-1">
            <span className={valBoca >= valRival ? "text-yellow-400" : "text-blue-200"}>{valBoca}</span>
            <span className="text-white/60">{label}</span>
            <span className={valRival > valBoca ? "text-white" : "text-gray-500"}>{valRival}</span>
        </div>
        <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-gray-700/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${porcentajeBoca}%` }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            className="h-full relative z-10"
            style={{ backgroundColor: BOCA_GOLD, boxShadow: `0 0 10px ${BOCA_GOLD}80` }}
          />
           <div className="absolute inset-0 bg-gray-500/30 w-full h-full"></div>
           <div className="absolute left-1/2 top-0 h-full w-0.5 bg-black/50 z-20 -translate-x-1/2"></div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen pb-20 font-sans text-white overflow-x-hidden" style={{ background: `radial-gradient(ellipse at top, ${BOCA_BLUE} 0%, #000c1f 100%)` }}>
      
{/* --- HEADER HERO --- */}
      <div className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <Link href="/resultados" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-300 transition hover:text-yellow-400 mb-8">
            <span className="mr-1">←</span> Volver
          </Link>
          
          {/* FIX MAESTRO: relative flex con justify-between para separar los equipos */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 mt-4 w-full md:min-h-[200px]">
            
            {/* EQUIPO LOCAL (Izquierda - Ocupa máximo 40% para no pisar el centro) */}
            <div className="flex w-full md:w-[40%] justify-end z-10">
                <div className="flex flex-col md:flex-row items-center justify-end gap-4 md:gap-6 w-full">
                    <div className="flex flex-col items-center md:items-end flex-1 min-w-0">
                        {/* text-balance hace que las líneas queden parejitas */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-center md:text-right w-full text-balance" style={{ color: esLocal ? BOCA_GOLD : '#ffffff', textShadow: esLocal ? `0 0 15px rgba(243,178,41,0.6)` : 'none', opacity: esLocal ? 1 : 0.8 }}>
                            {equipoLocal}
                        </h1>
                        <span className="text-sm font-bold text-blue-300/60 uppercase tracking-widest mt-3 md:mt-2">Local</span>
                    </div>
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 shrink-0">
                        <Image src={escudoIzquierda} alt={equipoLocal} fill className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]" />
                    </motion.div>
                </div>
            </div>

            {/* MARCADOR (CENTRO ABSOLUTO: Clavado matemáticamente en el medio de la pantalla) */}
            <div className="static md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col items-center justify-center shrink-0 z-20">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight flex items-center justify-center whitespace-nowrap" style={{ color: BOCA_GOLD, textShadow: `0 0 30px ${BOCA_GOLD}50` }}>
                  <span className="w-[1ch] text-center">{golesLocal}</span>
                  <span className="text-white/20 -mt-2 md:-mt-4 mx-2 md:mx-4">:</span>
                  <span className="w-[1ch] text-center">{golesVisitante}</span>
                </motion.div>
                <div className="mt-3 md:mt-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70 whitespace-nowrap shadow-lg backdrop-blur-sm">
                    {partido.competicion} | {partido.fecha}
                </div>
            </div>

            {/* EQUIPO VISITANTE (Derecha - Ocupa máximo 40% para no pisar el centro) */}
            <div className="flex w-full md:w-[40%] justify-start z-10">
                <div className="flex flex-col md:flex-row items-center justify-start gap-4 md:gap-6 w-full">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 shrink-0">
                        <Image src={escudoDerecha} alt={equipoVisitante} fill className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]" />
                    </motion.div>
                    <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-center md:text-left w-full text-balance" style={{ color: !esLocal ? BOCA_GOLD : '#ffffff', textShadow: !esLocal ? `0 0 15px rgba(243,178,41,0.6)` : 'none', opacity: !esLocal ? 1 : 0.8 }}>
                            {equipoVisitante}
                        </h1>
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest mt-3 md:mt-2">Visitante</span>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
                
    {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container mx-auto max-w-7xl px-4 -mt-10 relative z-20">
        
        {partido.estadisticas ? (
            <>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <KeyStatRing label="Posesión" valBoca={partido.estadisticas.PosesionBoca} valRival={partido.estadisticas.PosesionRival} isPorcentaje={true} />
                    <KeyStatRing label="Tiros Totales" valBoca={partido.estadisticas.TotalRematesBoca} valRival={partido.estadisticas.TotalRematesRival} />
                    <KeyStatRing label="Faltas" valBoca={partido.estadisticas.FaltasBoca} valRival={partido.estadisticas.FaltasRival} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* 1. COLUMNA IZQUIERDA (4 espacios): ESTADÍSTICAS */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                            <h3 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-6 flex items-center gap-2">⚔️ Ataque y Peligro</h3>
                            <StatBarModern label="Remates al Arco" valBoca={partido.estadisticas.RematesAlArcoBoca} valRival={partido.estadisticas.RematesAlArcoRival} />
                            <StatBarModern label="Ataques Totales" valBoca={partido.estadisticas.AtaquesBoca} valRival={partido.estadisticas.AtaquesRival} />
                            <StatBarModern label="Saques de Esquina" valBoca={partido.estadisticas.SaquesDeEsquinaBoca} valRival={partido.estadisticas.SaquesDeEsquinaRival} />
                            <StatBarModern label="Fuera de Juego" valBoca={partido.estadisticas.FueraDeJuegoBoca} valRival={partido.estadisticas.FueraDeJuegoRival} />
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                            <h3 className="text-sm font-black uppercase tracking-widest text-red-400 mb-6 flex items-center gap-2">🛡️ Disciplina</h3>
                            <StatBarModern label="Faltas Cometidas" valBoca={partido.estadisticas.FaltasBoca} valRival={partido.estadisticas.FaltasRival} />
                            <StatBarModern label="Tarjetas Amarillas" valBoca={partido.estadisticas.TarjetasAmarillasBoca} valRival={partido.estadisticas.TarjetasAmarillasRival} />
                        </div>
                    </div>

                    {/* 2. COLUMNA CENTRAL (5 espacios): LA CANCHA TÁCTICA */}
                    <div className="lg:col-span-5">
                         <div className="rounded-2xl bg-[#00122A] border border-white/10 p-6 relative shadow-2xl sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Pizarra</h3>
                                </div>
                                {partido.formacion && (
                                    <span className="px-3 py-1 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-black tracking-widest shadow-[0_0_15px_rgba(243,178,41,0.2)]">
                                        {partido.formacion.esquema}
                                    </span>
                                )}
                            </div>

                            {!partido.formacion ? (
                                <div className="aspect-[4/5] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                    <p className="text-white/50 italic font-medium">Cargando táctica...</p>
                                </div>
                            ) : (
                                <div className="relative w-full aspect-[4/5] bg-[#0A3D20] border-2 border-white/40 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between py-6">
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, #fff 10%, #fff 20%)' }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/40 pointer-events-none -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/40 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
                                    
                                    <div className="absolute top-0 left-1/2 w-[50%] h-[15%] border-x-2 border-b-2 border-white/40 pointer-events-none -translate-x-1/2"></div>
                                    <div className="absolute top-0 left-1/2 w-[25%] h-[6%] border-x-2 border-b-2 border-white/40 pointer-events-none -translate-x-1/2"></div>
                                    <div className="absolute top-[15%] left-1/2 w-12 h-6 border-b-2 border-white/40 rounded-b-full pointer-events-none -translate-x-1/2"></div>
                                    
                                    <div className="absolute bottom-0 left-1/2 w-[50%] h-[15%] border-x-2 border-t-2 border-white/40 pointer-events-none -translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-1/2 w-[25%] h-[6%] border-x-2 border-t-2 border-white/40 pointer-events-none -translate-x-1/2"></div>
                                    <div className="absolute bottom-[15%] left-1/2 w-12 h-6 border-t-2 border-white/40 rounded-t-full pointer-events-none -translate-x-1/2"></div>

                                    <div className="absolute inset-0 z-10 flex flex-col-reverse justify-around py-4">
                                        {lineasCancha.map((linea, rowIndex) => (
                                            <div key={rowIndex} className="flex flex-row justify-around items-center w-full px-4">
                                                {linea.map((jugadorId, index) => {
                                                    const info = getJugadorInfo(jugadorId);
                                                    const apellido = info.nombre.split(' ').pop();
                                                    
                                                    return (
                                                        <motion.div 
                                                            key={index}
                                                            initial={{ scale: 0, y: 20 }}
                                                            animate={{ scale: 1, y: 0 }}
                                                            transition={{ delay: 0.2 + (rowIndex * 0.1) + (index * 0.05), type: 'spring', stiffness: 200 }}
                                                            className="relative flex flex-col items-center group cursor-pointer"
                                                        >
                                                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-black text-[#001A3D] border-2 border-[#001A3D] shadow-[0_4px_10px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-[1.5] group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-20">
                                                                {info.numero}
                                                            </div>

                                                            <div className="absolute top-full mt-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-wider border border-white/10 shadow-lg text-center transition-all duration-300 group-hover:bg-[#00305D] group-hover:scale-110 group-hover:border-yellow-500/50 z-30 pointer-events-none origin-top">
                                                                <span className="block group-hover:hidden max-w-[70px] truncate">
                                                                    {apellido}
                                                                </span>
                                                                <span className="hidden group-hover:block whitespace-nowrap px-1">
                                                                    {info.nombre}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. COLUMNA DERECHA (3 espacios): LA LISTA DEL PLANTEL */}
                    <div className="lg:col-span-3">
                         <div className="rounded-2xl bg-[#00122A] border border-white/10 p-6 relative shadow-2xl sticky top-8">
                            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">Plantel Titular</h3>
                            
                            {!partido.formacion ? (
                                <p className="text-center text-white/50 italic py-8">Lista no disponible.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {partido.formacion.titulares.map((jugadorId, index) => {
                                        const info = getJugadorInfo(jugadorId);
                                        return (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + (index * 0.05) }}
                                                className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-white/10 group cursor-default border border-transparent hover:border-white/5"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#002F6C] border border-yellow-500/30 font-black text-yellow-500 shadow-inner transition-colors group-hover:bg-yellow-500 group-hover:text-[#001A3D]">
                                                    {info.numero}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-bold tracking-wide text-white truncate transition-colors group-hover:text-yellow-300">
                                                        {info.nombre}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">
                                                        {info.posicion}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                         </div>
                    </div>

                </div>
            </>
        ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center text-white/50 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white/70 mb-2">Sin datos disponibles</h2>
                <p>Aún no se han cargado las estadísticas para este encuentro.</p>
            </div>
        )}
      </div>
    </main>
  );
}