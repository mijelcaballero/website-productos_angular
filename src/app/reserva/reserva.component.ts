import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../services/reserva.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pelicula } from '../models/pelicula.model';
import { firstValueFrom } from 'rxjs';
import { PeliculasService } from '../services/pelicula.service';

@Component({
  standalone: true,
  selector: 'app-reserva',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})

export class ReservaComponent implements OnInit {

  peliculaId: string = '';
  tituloPelicula: string = ''; // opcional para mostrar nombre de la peli
  butacasDisponibles: string[] = [];
  butacasSeleccionadas: string[] = [];
  errorMsg: string = '';
  successMsg: string = '';
  isSubmitting: boolean = false;

  filas = ['A', 'B', 'C', 'D'];
  columnas = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private router: Router,
    private peliculasService: PeliculasService,
  ) {}

  async ngOnInit() {

    this.peliculaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tituloPelicula = history.state?.titulo || 'Película';

    const tituloFromState = history.state?.titulo;
      if (tituloFromState) {
        this.tituloPelicula = tituloFromState;
    } else {
        try {
          const pelicula = await firstValueFrom(this.peliculasService.getPeliculaById(this.peliculaId));
          if (pelicula) {
            this.tituloPelicula = pelicula.titulo;
          } else {
            this.tituloPelicula = 'Película no encontrada';
          }
    } catch (error) {
      console.error('Error al obtener la película por ID:', error);
      this.tituloPelicula = 'Película no encontrada';
    }
  }

    const reservadas = await this.reservaService.getButacasReservadas(this.peliculaId);
    this.butacasDisponibles = this.generarMapaButacas().filter(b => !reservadas.includes(b));
  }

  generarMapaButacas(): string[] {
    const todas: string[] = [];
    for (let fila of this.filas) {
      for (let col of this.columnas) {
        todas.push(`${fila}${col}`);
      }
    }
    return todas;
  }

  toggleButaca(butaca: string) {
    if (this.butacasSeleccionadas.includes(butaca)) {
      this.butacasSeleccionadas = this.butacasSeleccionadas.filter(b => b !== butaca);
    } else {
      this.butacasSeleccionadas.push(butaca);
    }
  }

  async reservar() {
    this.errorMsg = '';
    this.successMsg = '';
    this.isSubmitting = true;
  
    const base = 10;
    const iva = 0.15;
    const subtotal = this.ticketCount * base;
    const precioFinal = +(subtotal * (1 + iva)).toFixed(2);
  
    try {
      await this.reservaService.crearReserva({
        peliculaId: this.peliculaId,
        tituloPelicula: this.tituloPelicula,
        butacas: this.butacasSeleccionadas,
        ticketCount: this.ticketCount,
        precio: precioFinal
      });
  
      this.successMsg = '¡Reserva realizada con éxito!';
      this.butacasSeleccionadas = [];
  
      // Esperar 1.5 segundos y redirigir a "Mis Reservas"
      setTimeout(() => {
        this.router.navigate(['/mis-reservas']);
      }, 1500);
  
    } catch (error: any) {
      this.errorMsg = error.message || 'Error al realizar la reserva';
    }
  
    this.isSubmitting = false;
  }
  

  get ticketCount(): number {
    return this.butacasSeleccionadas.length;
  }
}
