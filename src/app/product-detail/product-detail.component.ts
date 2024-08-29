import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Product[]>('/assets/products.json').subscribe({
        next: (data) => {
          const foundProduct = data.find(item => item.id === parseInt(id));
          this.product = foundProduct || null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los detalles del producto:', error);
          this.loading = false;
        }
      });
    } else {
      console.error('ID del producto no encontrado');
      this.loading = false;
    }
  }
}
