import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from '../services/pelicula.service';
import { Pelicula } from '../models/pelicula.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  standalone: true,
  selector: 'app-detalles-pelicula',
  templateUrl: './detalles-pelicula.component.html',
  styleUrls: ['./detalles-pelicula.component.css'],
  imports: [CommonModule]  
})

export class DetallesPeliculaComponent implements OnInit, OnDestroy {
  @Input() pelicula!: Pelicula;
  peliculaId: string = '';     
  tituloPelicula: string = ''; 
  private peliculaSub?: Subscription;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      this.peliculaId = id; // ✅ guardar el id desde la ruta
      this.peliculaSub = this.peliculasService.getPeliculaById(id).subscribe({
        next: (pelicula) => {
          if (pelicula) {
            this.pelicula = pelicula;
            this.tituloPelicula = pelicula.titulo;
          } else {
            this.error = 'Película no encontrada';
          }
        },
        error: (err) => {
          console.error('Error obteniendo la película:', err);
          this.error = 'Hubo un problema al cargar la película';
        }
      });
    } else {
      this.error = 'ID de película no proporcionado';
    }
  }
  

  ngOnDestroy(): void {
    this.peliculaSub?.unsubscribe();
  }

  sanitizarUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.convertirUrlYoutube(url));
  }

  convertirUrlYoutube(url: string): string {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  formatFechaEstreno(): string {
    return this.pelicula?.fechaEstreno
      ? this.pelicula.fechaEstreno.toLocaleDateString()
      : 'Fecha no disponible';
  }

  async reservar() {
    const user = await this.authService.getCurrentUser();
  
    if (user) {
      console.log('Navegando a reserva con:', this.peliculaId, this.tituloPelicula);
      this.router.navigate(['/reserva', this.peliculaId], {
        state: { titulo: this.tituloPelicula }
      });
    } else {
      // Guarda los datos en localStorage
      localStorage.setItem('reservaPendiente', JSON.stringify({
        peliculaId: this.peliculaId,
        titulo: this.tituloPelicula
      }));
  
      this.router.navigate(['/login']);
    }
  }
}
