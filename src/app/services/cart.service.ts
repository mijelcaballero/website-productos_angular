import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(item: any) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentItems, item]);
  }

  removeFromCart(item: any) {
    const currentItems = this.cartItemsSubject.value.filter(cartItem => cartItem.id !== item.id);
    this.cartItemsSubject.next(currentItems);
  }

  getCartItems(): Observable<any[]> {
    return this.cartItems$;
  }
}
