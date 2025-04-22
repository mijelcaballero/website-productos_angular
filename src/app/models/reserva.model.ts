import { Timestamp } from "firebase/firestore";

export interface Reserva {
  id?: string;
  uidUsuario: string;               // Usuario que hace la reserva
  peliculaId: string;        // Película reservada
  tituloPelicula: string;   // Opcional: para mostrar más fácilmente
  butacas: string[];         // Ej: ["A1", "A2", "A3"]
  ticketCount: number;       // Total de entradas
  fechaReserva: Timestamp;   // Fecha reserva
  precio: number;           // Precio de la reserva
}