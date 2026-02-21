'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, SpotLight, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const BOCA_BLUE = '#00305D';
const BOCA_GOLD = '#F3B229';

const COPAS_DATA = [
  { 
    id: 1, year: '1977', rival: 'Cruzeiro', dt: 'Juan Carlos Lorenzo', hero: 'Hugo Gatti', 
    desc: 'La primera, por penales en Montevideo. El Loco Gatti se convirtió en leyenda.',
    formacion: {
        esquema: '1-4-3-3',
        jugadores: ['Gatti', 'Pernía', 'Sá', 'Mouzo', 'Tarantini', 'Benítez', 'Suñé', 'Zanabria', 'Mastrángelo', 'Veglio', 'Felman']
    }
  },
  { 
    id: 2, year: '1978', rival: 'Deportivo Cali', dt: 'Juan Carlos Lorenzo', hero: 'Ernesto Mastrángelo', 
    desc: 'Bicampeonato en casa. Baile 4-0 en la Bombonera para asegurar la segunda.',
    formacion: {
        esquema: '1-4-3-3',
        jugadores: ['Gatti', 'Pernía', 'Sá', 'Mouzo', 'Bordón', 'Benítez', 'Suñé', 'Zanabria', 'Mastrángelo', 'Salinas', 'Perotti']
    }
  },
  { 
    id: 3, year: '2000', rival: 'Palmeiras', dt: 'Carlos Bianchi', hero: 'Óscar Córdoba', 
    desc: 'El inicio de la era dorada. Épica definición por penales en el Morumbí.',
    formacion: {
        esquema: '1-4-3-1-2', 
        jugadores: ['Córdoba', 'Ibarra', 'Bermúdez', 'Samuel', 'Arruabarrena', 'Battaglia', 'Traverso', 'Basualdo', 'Riquelme', 'Delgado', 'Palermo']
    }
  },
  { 
    id: 4, year: '2001', rival: 'Cruz Azul', dt: 'Carlos Bianchi', hero: 'Juan Román Riquelme', 
    desc: 'Bicampeonato del Virrey. Román brilló y los penales volvieron a sonreír.',
    formacion: {
        esquema: '1-4-3-1-2',
        jugadores: ['Córdoba', 'Ibarra', 'Bermúdez', 'Burdisso', 'Clemente', 'Villarreal', 'Serna', 'Traverso', 'Riquelme', 'Delgado', 'Giménez']
    }
  },
  { 
    id: 5, year: '2003', rival: 'Santos', dt: 'Carlos Bianchi', hero: 'Carlos Tevez', 
    desc: 'La "Gallinita" de Tevez y paliza histórica al Santos de Robinho en Brasil.',
    formacion: {
        esquema: '1-4-3-1-2',
        jugadores: ['Abbondanzieri', 'Ibarra', 'Schiavi', 'Burdisso', 'Clemente', 'Battaglia', 'Cascini', 'Cagna', 'Tevez', 'Delgado', 'Schelotto']
    }
  },
  { 
    id: 6, year: '2007', rival: 'Grêmio', dt: 'Miguel Ángel Russo', hero: 'Juan Román Riquelme', 
    desc: 'La Copa de Román. Actuación individual legendaria para un global de 5-0.',
    formacion: {
        esquema: '1-4-3-1-2',
        jugadores: ['Caranta', 'Ibarra', 'Díaz', 'Morel', 'Rodríguez', 'Ledesma', 'Banega', 'Cardozo', 'Riquelme', 'Palacio', 'Palermo']
    }
  },
];

const getLineasFormacion = (formacion: any) => {
    const esquema = formacion.esquema;
    const titulares = formacion.jugadores;
    const lineas: string[][] = []; 
    const numerosEsquema = esquema.split('-').map(Number);
    let index = 0;
    numerosEsquema.forEach((cantidad: number) => {
      lineas.push(titulares.slice(index, index + cantidad));
      index += cantidad;
    });
    return lineas; 
};

// ==========================================
// ⚽ COMPONENTE CANCHA (Alineación Perfecta)
// ==========================================
const HistoricalPitch = ({ formacion }: { formacion: any }) => {
    const lineas = getLineasFormacion(formacion);

    return (
        <div className="relative w-full aspect-[3/4] bg-[#0A3D20] border-2 border-[#F3B229]/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(243,178,41,0.15)] flex flex-col justify-between py-6">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, #fff 10%, #fff 20%)' }}></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30 pointer-events-none -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-1/2 w-[40%] h-[12%] border-x border-b border-white/30 pointer-events-none -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-[40%] h-[12%] border-x border-t border-white/30 pointer-events-none -translate-x-1/2"></div>

            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm border border-[#F3B229]/30 text-[#F3B229] text-[10px] font-black tracking-widest z-20">
                {formacion.esquema.substring(2)}
            </div>

            <div className="relative z-10 flex flex-col-reverse justify-around h-full mt-4 pb-4">
                {lineas.map((linea, rowIndex) => (
                    // Mantenemos items-center en la fila
                    <div key={rowIndex} className="flex flex-row justify-around items-center w-full px-2">
                        {linea.map((jugadorNombre, index) => {
                            return (
                                <motion.div 
                                    key={jugadorNombre}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 + (rowIndex * 0.1) + (index * 0.05), type: 'spring', stiffness: 200 }}
                                    // FIX: Hacemos que la caja sea relativa pero que no le importe el ancho del texto
                                    className="relative flex flex-col items-center justify-center z-20"
                                >
                                    {/* El Círculo Dorado */}
                                    <div className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#F3B229] border-2 border-[#000511] shadow-[0_0_10px_#F3B229] z-20"></div>
                                    
                                    {/* FIX: El Nombre ahora es ABSOLUTO. Se centra en su propio eje y "cuelga" sin empujar los costados */}
                                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] md:text-xs font-bold text-white tracking-widest border border-white/10 shadow-lg text-center whitespace-nowrap z-30 pointer-events-none">
                                        {jugadorNombre}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================

function CopaModel(props: any) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/copa/scene.gltf');
  useFrame((state, delta) => { if (meshRef.current) { meshRef.current.rotation.y += delta * 0.15; }});
  return (
    <group ref={meshRef} {...props} dispose={null}>
      <primitive object={scene} scale={1.4} position={[0, -4.5, 0]} />
    </group>
  );
}

export default function HistoriaPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-[#000511] font-sans selection:bg-yellow-500 selection:text-blue-900">
      
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00305D_0%,_#000511_80%)] opacity-60 z-0 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
            <Link href="/" className="pointer-events-auto inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-300 transition hover:text-yellow-400 backdrop-blur-md bg-black/30 px-4 py-2 rounded-full border border-white/10">
            <span className="mr-1">←</span> Volver al Templo
            </Link>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-right">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F3B229] to-[#8C6E1F] drop-shadow-[0_5px_15px_rgba(243,178,41,0.4)]">Sala de Gloria</h1>
            <p className="text-blue-200/70 text-sm uppercase tracking-widest font-bold">El tesoro de la mitad más uno</p>
            </motion.div>
        </div>
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [0, 2, 20], fov: 45 }}>
                <ambientLight intensity={0.5} color={BOCA_BLUE} />
                <Environment preset="city" />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={300} scale={[20, 20, 20]} size={4} speed={0.4} color={BOCA_GOLD} opacity={0.5} />
                <SpotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={200} color={BOCA_GOLD} castShadow distance={50} />
                <CopaModel />
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.1} maxPolarAngle={Math.PI / 2.1} autoRotate={false} />
            </Canvas>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#F3B229] drop-shadow-[0_0_20px_rgba(243,178,41,0.6)] mb-2">Copa Libertadores</h2>
            <p className="text-white/50 text-xs md:text-sm uppercase tracking-widest animate-pulse bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">Girá la copa o scrolleá para ver la historia ↓</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000511] to-transparent z-30 pointer-events-none"></div>
      </section>

      <section className="relative z-20 w-full bg-[#000511] py-24 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-1/2 hidden md:block z-0"></div>

            <div className="flex flex-col gap-24 relative z-10">
                {COPAS_DATA.map((copa, index) => {
                    const isLeft = index % 2 === 0;
                    const isHovered = hoveredId === copa.id;
                    const isActive = activeId === copa.id;

                    return (
                        <motion.div 
                            key={copa.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className={`flex flex-col md:flex-row items-center justify-between w-full min-h-[400px] ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            <div 
                                className="w-full md:w-[45%] group relative"
                                onMouseEnter={() => setHoveredId(copa.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className={`relative p-6 md:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 overflow-hidden ${isHovered || isActive ? 'bg-[#002F6C]/80 border-[#F3B229] shadow-[0_0_40px_rgba(243,178,41,0.2)] -translate-y-2' : 'bg-[#001A3D]/40 border-white/10 hover:bg-[#002F6C]/60 hover:border-[#F3B229]/50'}`}>
                                    
                                    <div className="absolute -top-6 -right-2 text-7xl font-black text-white/5 pointer-events-none transition-all duration-500 group-hover:text-[#F3B229]/10">
                                        {copa.year}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xl shadow-[0_0_15px_rgba(243,178,41,0.2)]">🏆</span>
                                            <h3 className="text-3xl font-black uppercase text-white tracking-tight drop-shadow-md">{copa.year}</h3>
                                        </div>
                                        
                                        <p className="text-blue-100/80 text-sm leading-relaxed mb-6">{copa.desc}</p>

                                        <div className="space-y-2 border-t border-white/10 pt-4">
                                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                                                <span className="text-white/40">Rival Final</span><span className="text-yellow-400 text-right">{copa.rival}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                                                <span className="text-white/40">DT</span><span className="text-white text-right">{copa.dt}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                                                <span className="text-white/40">Figura</span><span className="text-white text-right">{copa.hero}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            {!isActive ? (
                                                <button 
                                                    onClick={() => setActiveId(copa.id)}
                                                    className={`w-full py-2.5 rounded-lg border text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isHovered ? 'border-[#F3B229] bg-[#F3B229]/10 text-[#F3B229] shadow-[0_0_15px_rgba(243,178,41,0.2)]' : 'border-white/5 bg-white/5 text-white/30'}`}
                                                >
                                                    {isHovered ? '⚽ Mostrar Formación' : 'Formación Histórica'}
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => setActiveId(null)}
                                                    className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors"
                                                >
                                                    Cerrar Formación ✕
                                                </button>
                                            )}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex w-[10%] justify-center relative z-10">
                                <div className={`w-4 h-4 rounded-full border-2 border-[#000511] transition-all duration-500 ${isActive ? 'bg-[#F3B229] shadow-[0_0_25px_#F3B229] scale-125' : 'bg-[#F3B229]/50 shadow-[0_0_15px_#F3B229]'}`}></div>
                            </div>

                            <div className="hidden md:flex w-[45%] items-center justify-center relative min-h-[400px]">
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, x: isLeft ? -20 : 20 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, x: isLeft ? -20 : 20, transition: { duration: 0.3 } }}
                                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                            className="w-full"
                                        >
                                            <div className="text-center mb-4">
                                                <span className="text-[#F3B229] text-xs font-black uppercase tracking-widest drop-shadow-lg bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-[#F3B229]/30">
                                                    El 11 de la Gloria
                                                </span>
                                            </div>
                                            <HistoricalPitch formacion={copa.formacion} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </motion.div>
                    )
                })}
            </div>
        </div>
      </section>
      
    </main>
  );
}