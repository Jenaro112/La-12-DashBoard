"use client";

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BOCA_BLUE, BOCA_GOLD } from '@/lib/constants';

export default function Home() {
  const [confetti, setConfetti] = useState<any[]>([]);

  // Generamos los papelitos solo del lado del cliente
  useEffect(() => {
    const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      width: Math.random() * 15 + 5,
      height: Math.random() * 8 + 4,
      backgroundColor: Math.random() > 0.5 ? BOCA_BLUE : BOCA_GOLD,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
    }));
    setConfetti(newConfetti);
  }, []);

  // Variantes para el texto (ya estaban ok)
  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.5 },
    },
  };

  const textChildVariants: Variants = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };

  // --- NUEVAS VARIANTES PARA EL BOTÓN (La solución al problema) ---
  const buttonVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      // Esta transición lenta con delay es SOLO para la entrada inicial
      transition: { delay: 1, type: "spring", stiffness: 200, damping: 20 }
    },
    hover: { 
        scale: 1.05, 
        backgroundColor: BOCA_GOLD, 
        color: BOCA_BLUE,
        borderColor: BOCA_GOLD,
        boxShadow: `0 0 50px ${BOCA_GOLD}, 0 0 20px ${BOCA_GOLD} inset`,
        // Esta transición rápida es SOLO para el hover (entra y sale rápido)
        transition: { type: "spring", stiffness: 400, damping: 10, delay: 0 }
    },
    tap: { scale: 0.95 }
  };


  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 text-center font-sans"
      style={{ background: `radial-gradient(circle at center, #002F6C 0%, #001A3D 100%)` }}
    >
      
      {/* --- FONDO: Lluvia de Papelitos --- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute rounded-sm opacity-70"
            style={{ 
              backgroundColor: c.backgroundColor, 
              left: `${c.x}%`, 
              top: `-10%`, 
              width: c.width,
              height: c.height,
              rotateZ: c.rotation
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotateZ: [c.rotation, c.rotation + 360 + Math.random() * 360],
              rotateX: [0, Math.random() * 360],
            }}
            transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
         <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
      </div>

      {/* --- EL ESCUDO CENTRAL --- */}
      <motion.div 
        className="relative z-20 mb-10"
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, duration: 1 }}
      >
        <motion.div
           className="rounded-[40px] border-4 p-12"
           style={{ backgroundColor: BOCA_BLUE, borderColor: BOCA_GOLD }}
           animate={{
             boxShadow: [`0 0 20px ${BOCA_GOLD}60`, `0 0 60px ${BOCA_GOLD}90`, `0 0 20px ${BOCA_GOLD}60`],
             scale: [1, 1.03, 1]
           }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 
            className="text-7xl font-black uppercase tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] md:text-9xl"
            style={{ color: BOCA_GOLD }}
          >
            La 12
          </h1>
        </motion.div>
      </motion.div>
      
      {/* --- TEXTO ANIMADO POR PALABRAS --- */}
      <motion.div
        className="relative z-20 mb-14 overflow-hidden"
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {["Bienvenido", "a", "la", "pasión", "del", "pueblo"].map((word, index) => (
          <motion.span
            key={index}
            variants={textChildVariants}
            className="mx-1 inline-block text-3xl font-bold text-white md:text-4xl"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {word === "pasión" ? <span style={{color: BOCA_GOLD}}>{word}</span> : word}
          </motion.span>
        ))}
      </motion.div>

      {/* --- BOTÓN FINAL (Ahora usa variants para ser rápido) --- */}
      <Link href="/resultados" className="relative z-20 inline-block">
        <motion.div
            className="cursor-pointer overflow-hidden rounded-xl border-2 px-12 py-5 text-2xl font-black uppercase tracking-widest"
            // Estilos base iniciales
            style={{ 
                backgroundColor: BOCA_BLUE, 
                color: BOCA_GOLD,
                borderColor: BOCA_GOLD,
                boxShadow: `0 10px 30px -10px ${BOCA_BLUE}`
            }}
            // Conectamos las variantes que definimos arriba
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
        >
          Ver Resultados
        </motion.div>
      </Link>
    </main>
  );
}