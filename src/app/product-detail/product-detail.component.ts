import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Item {
  id: string;
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
  item: Item | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, private cartService: CartService, private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestoreService.getItem('productos', id).subscribe({
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

  // Método addToCart con notificación
  addToCart(item: Item) {
    this.cartService.addToCart(item);
    this.snackBar.open(`${item.name} ha sido agregado al carrito!`, 'Cerrar', {
      duration: 3000, // Tiempo que la notificación permanecerá visible (en milisegundos)
    });
  }
}
