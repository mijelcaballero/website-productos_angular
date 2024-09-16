import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service'; // Servicio para la base de datos MySQL
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit {
  item: any = { name: '', description: '', price: 0, image: '', category: 'product' }; // Categoría predeterminada
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService, // Servicio para MySQL
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
      this.itemId = params['id'] ? Number(params['id']) : null;

      if (action === 'edit' && this.itemId) {
        this.isEditMode = true;
        this.productoService.getProducto(this.itemId).subscribe({
          next: (data) => {
            this.item = data;
          },
          error: (error) => {
            console.error('Error al cargar el producto:', error);
            this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
          }
        });
      } else if (action === 'create') {
        this.isEditMode = false;
        this.item = { name: '', description: '', price: 0, image: '', category: 'product' }; // Valores por defecto
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.itemId) {
      this.productoService.updateProducto(this.itemId, this.item).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado exitosamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/galeria']);
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
          this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.productoService.createProducto(this.item).subscribe({
        next: () => {
          this.snackBar.open('Producto creado exitosamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/galeria']);
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          this.snackBar.open('Error al crear el producto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
