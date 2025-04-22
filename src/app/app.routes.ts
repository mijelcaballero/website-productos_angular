import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DetallesPeliculaComponent } from './detalles-pelicula/detalles-pelicula.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactosComponent } from './contactos/contactos.component';
import { AuthGuard } from './guards/auth.guard'; // Importa el guardián de autenticación
import { InvoiceComponent } from './invoice/invoice.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pelicula/:id', component: DetallesPeliculaComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  {
    path: 'reserva/:id',
    loadComponent: () => import('./reserva/reserva.component').then(m => m.ReservaComponent),
    canActivate: [AuthGuard] // 🔒 Solo usuarios autenticados pueden reservar
  },

  {
    path: 'mis-reservas',
    loadComponent: () => import('./mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent),
    canActivate: [AuthGuard] // 🔒 Solo usuarios autenticados pueden ver sus reservas
  },
  
  // Otras rutas
  { path: 'invoice', component: InvoiceComponent},
  { path: 'cart', component: CartComponent},
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: '**', component: NotFoundComponent },
];
