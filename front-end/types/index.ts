export interface Partido {
  id: string;
  rival: string;
  fecha: string;
  resultado: string;
  condicion: 'Local' | 'Visitante';
  goleadores: string[];
}
