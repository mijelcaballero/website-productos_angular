import { ApplicationConfig } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Configuración de Firebase 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmtC8ELgt6wipdYryywJbMuLanteu4hD4",
  authDomain: "productos-web-68375.firebaseapp.com",
  projectId: "productos-web-68375",
  storageBucket: "productos-web-68375.appspot.com",
  messagingSenderId: "678355689440",
  appId: "1:678355689440:web:2515c257d76d8725ba9585",
  measurementId: "G-7LQ61G9ZL7"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    RouterModule,
    // Inicialización de Firebase y servicios
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    NavigationBarComponent, provideAnimationsAsync()
  ],
};
