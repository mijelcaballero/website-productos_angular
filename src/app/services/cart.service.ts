import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: any) {
    let currentCart = this.cartItemsSubject.value;
    const productInCart = currentCart.find(item => item.id === product.id);

    if (productInCart) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      productInCart.quantity += 1;
    } else {
      // Si el producto no está en el carrito, lo añadimos con cantidad 1
      product.quantity = 1;
      currentCart.push(product);
    }

    this.cartItemsSubject.next(currentCart);
  }

  removeFromCart(product: any) {
    let currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(item => item.id !== product.id);
    this.cartItemsSubject.next(updatedCart);
  }

  getCartItems(): Observable<any[]> {
    return this.cartItems$;
  }
}
