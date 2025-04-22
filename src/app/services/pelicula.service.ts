import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Pelicula } from '../models/pelicula.model';
import { collection, collectionData, docData, Firestore } from '@angular/fire/firestore';
import { Timestamp, DocumentData, doc } from 'firebase/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private readonly collectionName = 'peliculas';

  constructor(
    private firestoreService: FirestoreService,
    private firestore: Firestore) {}

    getPeliculas(): Observable<Pelicula[]> {
      const ref = collection(this.firestore, 'peliculas');
  
      return collectionData(ref, { idField: 'id' }).pipe(
        map((docs: DocumentData[]) =>
          docs.map((doc) => ({
            ...doc,
            fechaEstreno: doc['fechaEstreno'] instanceof Timestamp
            ? (doc['fechaEstreno'] as Timestamp).toDate(): doc['fechaEstreno'] ?? null
          }))
        )
      );
    }

    getPeliculaById(id: string): Observable<Pelicula | undefined> {
      const docRef = doc(this.firestore, `peliculas/${id}`);
      return docData(docRef, { idField: 'id' }).pipe(
        map((doc: DocumentData | undefined) => {
          if (!doc) return undefined;
    
          return {
            ...doc,
            fechaEstreno: doc['fechaEstreno'] instanceof Timestamp
              ? (doc['fechaEstreno'] as Timestamp).toDate()
              : doc['fechaEstreno'] ?? null
          } as Pelicula;
        })
      );
    }

  createPelicula(pelicula: Pelicula) {
    return this.firestoreService.createItem(this.collectionName, pelicula);
  }

  updatePelicula(id: string, pelicula: Pelicula) {
    return this.firestoreService.updateItem(this.collectionName, id, pelicula);
  }

  deletePelicula(id: string) {
    return this.firestoreService.deleteItem(this.collectionName, id);
  }

  // lógica personalizada para obtener solo películas en cartelera
  getPeliculasEnCartelera(): Observable<Pelicula[]> {
    return new Observable(observer => {
      this.getPeliculas().subscribe(peliculas => {
        const filtradas = peliculas.filter(p => p.enCartelera);
        observer.next(filtradas);
      });
    });
  }

  

  




}
