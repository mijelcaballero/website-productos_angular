import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { ServiceGalleryComponent } from './service-gallery/service-gallery.component';
import { FormProductComponent } from './form-product/form-product.component';
import { FormServiceComponent } from './form-service/form-service.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component'; 
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactosComponent } from './contactos/contactos.component';
import { AuthGuard } from './guards/auth.guard'; // Importa el guardián de autenticación
import { InvoiceComponent } from './invoice/invoice.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // Rutas para la galería de productos y servicios
  { path: 'productos', component: ProductGalleryComponent, data: { category: 'product' } },
  { path: 'servicios', component: ServiceGalleryComponent, data: { category: 'service' } },
  { path: 'form-product', component: FormProductComponent, canActivate: [AuthGuard] },
  { path: 'form-service', component: FormServiceComponent, canActivate: [AuthGuard] },

  // Rutas para detalles de productos y servicios
  { path: 'producto/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'servicio/:id', component: ServiceDetailComponent, canActivate: [AuthGuard] },

  // Otras rutas
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: '**', component: NotFoundComponent },
];
