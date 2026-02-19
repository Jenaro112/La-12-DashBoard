export interface Estadisticas {
  TotalRematesBoca: number; 
  TotalRematesRival: number; 
  RematesAlArcoBoca: number;
  RematesAlArcoRival: number;
  PosesionBoca: number; 
  PosesionRival: number; 
  AtaquesBoca: number;
  AtaquesRival: number;
  SaquesDeFaltaBoca: number;
  SaquesDeFaltaRival: number;
  SaquesDeEsquinaBoca: number;
  SaquesDeEsquinaRival: number;
  FueraDeJuegoBoca: number;
  FueraDeJuegoRival: number;
  FaltasBoca: number;
  FaltasRival: number;
  TarjetasAmarillasBoca: number;
  TarjetasAmarillasRival: number;
  TarjetasRojasBoca: number;
  TarjetasRojasRival: number;
}

export interface Formacion {
  esquema: string; 
  titulares: string[]; 
  suplentes: string[];
}

export interface Partido {
  id: string;
  rival: string;
  fecha: string;
  resultado: string;
  condicion: 'Local' | 'Visitante';
  goleadores: string[];
  competicion: string;
  estado: 'Victoria' | 'Derrota' | 'Empate';
  
  // ESTO ES LO QUE FALTABA PARA QUE SE VAYA EL ERROR:
  estadisticas?: Estadisticas;
  formacion?: Formacion;
}