import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-service',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-service.component.html',
  styleUrls: ['./form-service.component.css']
})
export class FormServiceComponent implements OnInit {
  item: any = { name: '', description: '', price: 0, image: '' };
  isEditMode = false;
  itemId: string | null = null;
  collectionName: string = 'servicios'; // Fixed collection name

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
      this.itemId = params['id'] || null;

      if (action === 'edit' && this.itemId) {
        this.isEditMode = true;

        this.firestoreService.getItem(this.collectionName, this.itemId).subscribe(data => {
          if (data) {
            this.item = { ...data };
          } else {
            console.error('Item no encontrado');
            this.snackBar.open('Item no encontrado', 'Cerrar', { duration: 3000 });
          }
        }, error => {
          console.error('Error al cargar el item:', error);
          this.snackBar.open('Error al cargar el item', 'Cerrar', { duration: 3000 });
        });
      } else if (action === 'create') {
        this.isEditMode = false;
        this.item = { name: '', description: '', price: 0, image: '' };
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.itemId) {
      this.firestoreService.updateItem(this.collectionName, this.itemId, this.item).then(() => {
        this.snackBar.open('Servicio actualizado exitosamente!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/galeria', this.collectionName]);
      }).catch(error => {
        this.snackBar.open('Error al actualizar el servicio', 'Cerrar', { duration: 3000 });
        console.error('Error al actualizar el servicio:', error);
      });
    } else {
      this.firestoreService.createItem(this.collectionName, this.item).then(() => {
        this.snackBar.open('Nuevo servicio creado exitosamente!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/galeria', this.collectionName]);
      }).catch(error => {
        this.snackBar.open('Error al crear el servicio', 'Cerrar', { duration: 3000 });
        console.error('Error al crear el servicio:', error);
      });
    }
  }
}
