import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component'; 
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactosComponent } from './contactos/contactos.component'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductGalleryComponent },
  { path: 'productos/:id', component: ProductDetailComponent },
  { path: 'servicios', component: ProductGalleryComponent },
  { path: 'servicios/:id', component: ServiceDetailComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactos', component: ContactosComponent }, 
  { path: '**', component: NotFoundComponent },
];
