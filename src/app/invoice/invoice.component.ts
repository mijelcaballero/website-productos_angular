import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  iva: number = 0;
  finalAmount: number = 0;

  constructor(private cartService: CartService, private invoiceService: InvoiceService) {}

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
}
