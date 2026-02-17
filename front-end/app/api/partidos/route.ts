import { NextResponse } from 'next/server';
import { Partido } from '@/types'; // Asegúrate de que la ruta de importación sea correcta

export async function GET() {
  // Simulamos una base de datos con los últimos 3 partidos
  const partidos: Partido[] = [
    {
      id: '1',
      rival: 'River Plate',
      fecha: '2024-04-21',
      resultado: '3-2',
      condicion: 'Visitante', // Jugado en Córdoba, pero técnicamente neutral/visitante administrativo
      goleadores: ['Merentiel', 'Cavani', 'Merentiel'],
    },
    {
      id: '2',
      rival: 'Sportivo Trinidense',
      fecha: '2024-05-08',
      resultado: '2-1',
      condicion: 'Visitante',
      goleadores: ['Figal', 'Cavani'],
    },
    {
      id: '3',
      rival: 'Fortaleza',
      fecha: '2024-05-15',
      resultado: '1-1',
      condicion: 'Local',
      goleadores: ['Cavani'],
    },
  ];

  return NextResponse.json(partidos);
}
