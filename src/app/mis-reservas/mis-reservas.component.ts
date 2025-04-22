import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../services/reserva.service';
import { Reserva } from '../models/reserva.model';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css'],
  imports: [FormsModule, CommonModule]
})
export class MisReservasComponent implements OnInit {
  reservas: (Reserva & { id?: string })[] = [];
  peliculas: any[] = [];
  todasLasButacas: string[] = [];
  butacasOcupadas: string[] = [];
  cargando = true;
  errorMsg = '';
  nuevaReserva: Partial<Reserva> = {
    tituloPelicula: '',
    peliculaId: '',
    butacas: [],
    ticketCount: 1,
    fechaReserva: Timestamp.fromDate(new Date())
  };

  reservaEditandoId: string | null = null;
  edicionReserva: Partial<Reserva> = {};
  firestore = inject(Firestore);

  constructor(private reservaService: ReservaService) {}

  async ngOnInit() {
    await this.cargarReservas(), 
    this.todasLasButacas = this.generarMapaButacas();

    const peliculasRef = collection(this.firestore, 'peliculas');
    collectionData(peliculasRef, { idField: 'id' }).subscribe((peliculas: any[]) => {
      this.peliculas = peliculas;
    });
  }

  async cargarReservas() {
    this.cargando = true;
    try {
      this.reservas = await this.reservaService.getReservasDelUsuario();
    } catch (error: any) {
      this.errorMsg = error.message || 'Error al cargar las reservas';
    } finally {
      this.cargando = false;
    }
  }

  generarMapaButacas(): string[] {
    const filas = ['A', 'B', 'C', 'D'];
    const columnas = [1, 2, 3, 4, 5];
    const todas: string[] = [];
    for (let fila of filas) {
      for (let col of columnas) {
        todas.push(`${fila}${col}`);
      }
    }
    return todas;
  }

  toggleButaca(butaca: string) {
    if (this.butacasOcupadas.includes(butaca)) return; // No permitir selección
  
    if (!this.edicionReserva.butacas) {
      this.edicionReserva.butacas = [];
    }
  
    const index = this.edicionReserva.butacas.indexOf(butaca);
    if (index > -1) {
      this.edicionReserva.butacas.splice(index, 1);
    } else {
      this.edicionReserva.butacas.push(butaca);
    }
  
    this.edicionReserva.ticketCount = this.edicionReserva.butacas.length;
    this.actualizarPrecio();
  }

  actualizarPrecio() {
    const base = 10;
    const iva = 0.15;
    const ticketCount = this.edicionReserva.ticketCount ?? 0;
    const subtotal =  ticketCount * base;
    this.edicionReserva.precio = +(subtotal * (1 + iva)).toFixed(2);
  }

  obtenerImagenPelicula(peliculaId: string): string {
    const pelicula = this.peliculas.find(p => p.id === peliculaId);
    return pelicula?.imagenUrl;
  }

  async seleccionarParaEditar(reserva: Reserva & { id?: string }) {
    this.reservaEditandoId = reserva.id!;
    this.edicionReserva = { ...reserva }; // Copia para editar sin afectar original
  
    if (reserva.peliculaId) {
      const todasReservadas = await this.reservaService.getButacasReservadas(reserva.peliculaId);
      // Excluir las butacas de esta misma reserva del usuario para no bloquearlas
      const propias = reserva.butacas ?? [];
      this.butacasOcupadas = todasReservadas.filter(b => !propias.includes(b));
    }
  }

  cancelarEdicion() {
    this.reservaEditandoId = null;
    this.edicionReserva = {};
  }

  async guardarCambios() {
    if (!this.reservaEditandoId) return;
    await this.reservaService.actualizarReserva(this.reservaEditandoId, this.edicionReserva);
    this.cancelarEdicion();
    await this.cargarReservas();
  }

  async eliminarReserva(id: string) {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      await this.reservaService.eliminarReserva(id);
      await this.cargarReservas();
    }
  }

  async crearNuevaReserva() {
    try {
      if (!this.nuevaReserva.peliculaId || !this.nuevaReserva.tituloPelicula || !this.nuevaReserva.butacas?.length) {
        alert('Por favor llena todos los campos.');
        return;
      }
      await this.reservaService.crearReserva(this.nuevaReserva as any);
      this.nuevaReserva = {
        tituloPelicula: '',
        peliculaId: '',
        butacas: [],
        ticketCount: 1,
        fechaReserva: Timestamp.fromDate(new Date())
      };
      await this.cargarReservas();
    } catch (error: any) {
      alert('Error al crear reserva: ' + error.message);
    }
  }
}
