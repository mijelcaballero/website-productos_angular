import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductoService } from '../services/producto.service'; // Servicio para cargar los productos desde el API REST Spring Boot

interface Item {
  id: number; // Cambiado a number para que coincida con los IDs de la base de datos
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
  productos$: Observable<Item[]> = new Observable<Item[]>();
  loading = true;
  category: 'product' | 'service' = 'product'; // Default to product

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro de categoría de la ruta
    this.category = this.route.snapshot.paramMap.get('category') as 'product' | 'service' || 'product';

    // Obtener los productos desde la API
    this.productos$ = this.productoService.getProductos();
    
    // Manejar el estado de carga
    this.loading = false; // Asume que la carga se completa cuando se obtienen los datos
  }

  get items$(): Observable<Item[]> {
    // Filtrar los productos por categoría
    return this.productos$; // Aquí filtra por categoría si es necesario
  }

  editItem(id: number): void {
    this.router.navigate(['/form-product'], { queryParams: { action: 'edit', type: this.category, id } });
  }

  deleteItem(id: number): void {
    this.productoService.deleteProducto(id).subscribe(() => {
      console.log('Item eliminado');
      // Actualizar la vista después de eliminar el item
      this.ngOnInit();
    });
  }

  createNew(): void {
    this.router.navigate(['/form-product'], { queryParams: { action: 'create', type: this.category } });
  }

  viewDetails(id: number, category: 'product' | 'service'): void {
    const routePath = category === 'product' ? `/producto/${id}` : `/servicio/${id}`;
    this.router.navigate([routePath]);
  }
}
