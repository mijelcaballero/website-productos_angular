import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para la página principal (Home)
  { path: 'productos', component: ProductGalleryComponent }, // Ruta para la galería de productos
  { path: 'productos/:id', component: ProductDetailComponent }, // Ruta para el detalle de un producto específico
  { path: 'nosotros', component: NosotrosComponent }, // Ruta para la página de nosotros
  { path: '**', component: NotFoundComponent }, // Ruta para la página 404 (not found)
];
