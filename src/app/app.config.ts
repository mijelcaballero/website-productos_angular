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
  apiKey: "AIzaSyBG4s2ZdgKjpZrZ1-2ZU12J7t7yaLAWOlA",
  authDomain: "website-cine-angular.firebaseapp.com",
  projectId: "website-cine-angular",
  storageBucket: "website-cine-angular.firebasestorage.app",
  messagingSenderId: "136000042635",
  appId: "1:136000042635:web:570497eb30bdcda0bf068e",
  measurementId: "G-FG6JZC993W"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    RouterModule,
    // Inicialización de Firebase y servicios
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    NavigationBarComponent, provideAnimationsAsync()
  ],
};
