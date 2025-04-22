import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // Obtener todos los datos basado en el tipo de colección
  getItems(collectionName: string): Observable<any[]> {
    const itemCollection = collection(this.firestore, collectionName);
    return collectionData(itemCollection, { idField: 'id' }) as Observable<any[]>;
  }

  // Obtener un coleccion por ID
  getItembyID(collectionName: string, id: string): Observable<any> {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return docData(itemDoc, { idField: 'id' }) as Observable<any>;
  }

  // Crear un nuevo item
  createItem(collectionName: string, item: any) {
    const itemCollection = collection(this.firestore, collectionName);
    return addDoc(itemCollection, item);
  }

  // Actualizar item existente
  updateItem(collectionName: string, id: string, item: any) {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(itemDoc, item);
  }

  // Eliminar un item
  deleteItem(collectionName: string, id: string) {
    const itemDoc = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(itemDoc);
  }


  // Obtener todos los items que cumplan con una condición
async getItemsByField<T>(collectionName: string, field: string, value: any): Promise<T[]> {
  const ref = collection(this.firestore, collectionName);
  const q = query(ref, where(field, '==', value));
  const snapshot = await getDocs(q);

  const items: T[] = [];
  snapshot.forEach(doc => {
    const data = doc.data() as T;
    items.push({ ...data, id: doc.id });
  });

  return items;
}

}
