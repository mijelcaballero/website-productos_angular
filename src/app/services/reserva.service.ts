import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly collectionName = 'reservas';

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  // Obtener butacas ya reservadas para una película
  async getButacasReservadas(peliculaId: string): Promise<string[]> {
    const reservas = await this.firestoreService.getItemsByField<Reserva>(this.collectionName, 'peliculaId', peliculaId);
    const todasButacas = reservas.flatMap(r => r.butacas);
    console.log(`Butacas reservadas para película ${peliculaId}:`, todasButacas); //Prueba por consola
    return todasButacas;
  }

  // Verificar si las butacas seleccionadas están disponibles
  async butacasDisponibles(peliculaId: string, seleccionadas: string[]): Promise<boolean> {
    const ocupadas = await this.getButacasReservadas(peliculaId);
    return !seleccionadas.some(b => ocupadas.includes(b)); // Si alguna ya está reservada => false
  }

  // Crear reserva validando disponibilidad
  async crearReserva(reserva: Omit<Reserva, 'uidUsuario' | 'fechaReserva'>): Promise<void> {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');

    const disponibles = await this.butacasDisponibles(reserva.peliculaId, reserva.butacas);
    if (!disponibles) {
      throw new Error('Una o más butacas ya están reservadas');
    }

    const nuevaReserva: Reserva = {
      ...reserva,
      uidUsuario: user.uid,
      fechaReserva: Timestamp.fromDate(new Date())
    };

    await this.firestoreService.createItem(this.collectionName, nuevaReserva);
  }

  //Obtener reservas del usuario
  async getReservasDelUsuario(): Promise<Reserva[]> {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
  
    return this.firestoreService.getItemsByField<Reserva>(this.collectionName, 'uidUsuario', user.uid);
  }

  //Eliminar Reservaa
  async eliminarReserva(id: string): Promise<void> {
    return this.firestoreService.deleteItem(this.collectionName, id);
  }

  //Editar (Actualizar) reserva
  async actualizarReserva(id: string, nuevosDatos: Partial<Reserva>): Promise<void> {
    return this.firestoreService.updateItem(this.collectionName, id, nuevosDatos);
  }
  
  


}
