import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  iva: number = 0;
  finalAmount: number = 0;

  constructor(
    private cartService: CartService, 
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    const { total, iva, finalAmount } = this.invoiceService.calculateInvoice(this.cartItems);
    this.total = total;
    this.iva = iva;
    this.finalAmount = finalAmount;
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
    this.calculateTotals();
  }

  generateInvoice() {
    // Navega al componente de la factura
    this.router.navigate(['/invoice']);
  }
}
