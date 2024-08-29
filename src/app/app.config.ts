import { ApplicationConfig } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    RouterModule,
    // Asegúrate de agregar el componente aquí
    NavigationBarComponent
  ],
};
