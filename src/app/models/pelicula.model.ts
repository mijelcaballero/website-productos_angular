import { Timestamp } from "firebase/firestore";

export interface Pelicula {
    id: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    fechaEstreno: Date;
    enCartelera: boolean;

    //Nuevos datos guardados en fireestore
    trailerUrl?: string; // URL a YouTube 
    calificacion?: number; // (sobre 5)
    director?: string;
    generos?: string[]; // Ej: ["Acción", "Drama"]
    duracionMinutos?: number; // Cuanto dura la pelicula en minutos
    reparto?: string[]; // Lista de actores
  
  }