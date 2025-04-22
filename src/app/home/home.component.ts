import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PeliculasService } from '../services/pelicula.service';
import { Pelicula } from '../models/pelicula.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  peliculasEnCartelera: Pelicula[] = [];
  proximosEstrenos: Pelicula[] = [];
  loading = true;

  constructor(private peliculasService: PeliculasService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.peliculasService.getPeliculas().subscribe(
      peliculas => {
        const hoy = new Date();
        this.peliculasEnCartelera = peliculas.filter(p => p.enCartelera);
        this.proximosEstrenos = peliculas.filter(p => new Date(p.fechaEstreno) > hoy)
        .sort((a, b) => a.fechaEstreno.getTime() - b.fechaEstreno.getTime());
        this.loading = false;
      },
      error => {
        console.error('Error cargando películas:', error);
        this.loading = false;
      }
    );
  }

  verDetalles(id: string) {
    this.router.navigate(['/pelicula', id]);
  }

  sanitizarUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.convertirUrlYoutube(url));
  }

  convertirUrlYoutube(url: string): string {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  formatFechaEstreno(fecha: Date | undefined): string {
    return fecha ? fecha.toLocaleDateString() : 'Fecha no disponible';
  }
}
