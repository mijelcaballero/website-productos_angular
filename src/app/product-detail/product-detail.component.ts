import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Producto {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string; // "product" o "service"
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  item: Producto | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.getProducto(+id).subscribe({
        next: (data) => {
          this.item = data || null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los detalles:', error);
          this.loading = false;
        }
      });
    } else {
      console.error('ID no encontrado');
      this.loading = false;
    }
  }

  addToCart(item: Producto): void {
    this.cartService.addToCart(item);
    this.snackBar.open(`${item.name} ha sido agregado al carrito!`, 'Cerrar', {
      duration: 3000, // Tiempo que la notificación permanecerá visible (en milisegundos)
    });
  }
}
