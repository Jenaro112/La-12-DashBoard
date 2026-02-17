import { NextResponse } from 'next/server';
import { Partido } from '@/types'; // Asegúrate de que la ruta de importación sea correcta

export async function GET() {
  // Simulamos una base de datos con los últimos 3 partidos
  const partidos: Partido[] = [
    {
      id: '1',
      rival: 'Millonarios',
      fecha: '2026-01-14',
      resultado: '0-0',
      condicion: 'Local', // Jugado en Córdoba, pero técnicamente neutral/visitante administrativo
      goleadores: [],
      competicion: 'Amistoso',
    },
    {
      id: '2',
      rival: 'Olimpia',
      fecha: '2026-01-18',
      resultado: '2-1',
      condicion: 'Local',
      goleadores: ['Velasco', 'Belmonte'],
      competicion: 'Amistoso',
    },
    {
      id: '3',
      rival: 'Dep. Riestra',
      fecha: '2026-01-25',
      resultado: '1-0',
      condicion: 'Local',
      goleadores: ['Di Lollo'],
      competicion: 'Liga Profesional de Futbol',
    },
    {
      id: '4',
      rival: 'Estudiantes dLP',
      fecha: '2026-01-28',
      resultado: '2-1',
      condicion: 'Visitante',
      goleadores: ['Zeballos'],
      competicion: 'Liga Profesional de Futbol',
    },
    {
      id: '5',
      rival: 'Newell\'s Old Boys',
      fecha: '2026-02-01',
      resultado: '2-0',
      condicion: 'Local',
      goleadores: ['Blanco', 'Paredes (p)'],
      competicion: 'Liga Profesional de Futbol',
    },
    {
      id: '6',
      rival: 'Vélez Sarsfield',
      fecha: '2026-02-08',
      resultado: '2-1',
      condicion: 'Visitante',
      goleadores: ['Zufiaurre'],
      competicion: 'Liga Profesional de Futbol',
    },
    {
      id: '7',
      rival: 'Platense',
      fecha: '2026-02-15',
      resultado: '0-0',
      condicion: 'Local',
      goleadores: [],
      competicion: 'Liga Profesional de Futbol',
    }
  ];

  return NextResponse.json(partidos);
}
