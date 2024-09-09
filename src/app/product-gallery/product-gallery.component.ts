import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service'; // Importar el servicio
import { Observable } from 'rxjs';

interface Item {
  id: string; // Cambiado a string para que coincida con los IDs de Firestore
  name: string;
  image: string;
  price: number;
  description: string;
  category: string; // "product" o "service"
}

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})

export class ProductGalleryComponent implements OnInit {
  products$: Observable<Item[]> = new Observable<Item[]>();
  services$: Observable<Item[]> = new Observable<Item[]>();
  loading = true;
  category: 'product' | 'service' = 'product'; // Default to product

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro de categoría de la ruta
    this.category = this.route.snapshot.paramMap.get('category') as 'product' | 'service' || 'product';

    // Obtener los productos y servicios desde Firebase
    this.products$ = this.firestoreService.getItems('productos');
    this.services$ = this.firestoreService.getItems('servicios');
    
    // Manejar el estado de carga
    this.loading = false; // Asume que la carga se completa cuando se obtienen los datos
  }

  get items$(): Observable<Item[]> {
    return this.category === 'product' ? this.products$ : this.services$;
  }

  editItem(id: string): void {
    this.router.navigate(['/form-product'], { queryParams: { action: 'edit', type: this.category, id } });
  }

  deleteItem(id: string): void {
    const collectionName = this.category === 'product' ? 'productos' : 'servicios';
    this.firestoreService.deleteItem(collectionName, id).then(() => {
      console.log('Item eliminado');
      // Actualizar la vista después de eliminar el item
      this.ngOnInit();
    });
  }

  createNew(): void {
    this.router.navigate(['/form-product'], { queryParams: { action: 'create', type: this.category } });
  }

  viewDetails(id: string, category: 'product' | 'service'): void {
    const routePath = category === 'product' ? `/producto/${id}` : `/servicio/${id}`;
    this.router.navigate([routePath]);
  }
}