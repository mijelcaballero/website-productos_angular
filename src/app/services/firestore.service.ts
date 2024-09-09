import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // Obtener todos los productos/servicios basado en el tipo de colección
  getItems(collectionName: string): Observable<any[]> {
    const itemCollection = collection(this.firestore, collectionName);
    return collectionData(itemCollection, { idField: 'id' }) as Observable<any[]>;
  }

  // Obtener un producto/servicio por ID
  getItem(collectionName: string, id: string): Observable<any> {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' }) as Observable<any>;
  }

  // Crear un nuevo producto/servicio
  createItem(collectionName: string, item: any) {
    const itemCollection = collection(this.firestore, collectionName);
    return addDoc(itemCollection, item);
  }

  // Actualizar un producto/servicio existente
  updateItem(collectionName: string, id: string, item: any) {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(itemDoc, item);
  }

  // Eliminar un producto/servicio
  deleteItem(collectionName: string, id: string) {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(itemDoc);
  }
}
