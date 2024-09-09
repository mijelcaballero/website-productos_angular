import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service'; // Importar el servicio
import { Observable } from 'rxjs';

interface Item {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string; // "product" o "service"
}

@Component({
  selector: 'app-service-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-gallery.component.html',
  styleUrls: ['./service-gallery.component.css']
})
export class ServiceGalleryComponent implements OnInit {
  services$: Observable<Item[]> = new Observable<Item[]>();
  loading = true;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener los servicios desde Firebase
    this.services$ = this.firestoreService.getItems('servicios');
    
    // Manejar el estado de carga
    this.loading = false; // Asume que la carga se completa cuando se obtienen los datos
  }

  editItem(id: string): void {
    this.router.navigate(['/form-service'], { queryParams: { action: 'edit', id } });
  }

  deleteItem(id: string): void {
    this.firestoreService.deleteItem('servicios', id).then(() => {
      console.log('Servicio eliminado');
      // Actualizar la vista después de eliminar el item
      this.ngOnInit();
    });
  }

  createNew(): void {
    this.router.navigate(['/form-service'], { queryParams: { action: 'create' } });
  }

  viewDetails(id: string): void {
    this.router.navigate([`/servicio/${id}`]);
  }
}
