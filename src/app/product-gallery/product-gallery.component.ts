import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

interface Item {
  id: number;
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
  products: Item[] = [];
  services: Item[] = [];
  loading = true;
  category: 'products' | 'services' = 'products'; // default to products

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el parámetro de categoría de la ruta
    this.category = this.route.snapshot.paramMap.get('category') as 'products' | 'services' || 'products';

    this.http.get<{ products: Item[], services: Item[] }>('/assets/products.json')
      .subscribe(
        data => {
          this.products = data.products;
          this.services = data.services;
          console.log('Productos:', data.products); // Verificar productos
          console.log('Servicios:', data.services); // Verificar servicios
          this.loading = false;
        },
        error => {
          console.error('Error al cargar los datos:', error);
          this.loading = false;
        }
      );
  }

  get items(): Item[] {
    return this.category === 'products' ? this.products : this.services;
  }
}
