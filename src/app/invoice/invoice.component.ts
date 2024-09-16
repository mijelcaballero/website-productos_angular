import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { InvoiceService } from '../services/invoice.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  stockSufficient: boolean = true;

  constructor(
    private cartService: CartService,
    private invoiceService: InvoiceService,
    private http: HttpClient,
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

  verificarStock(): void {
    // Creamos un array de observables para verificar el stock de cada producto
    let stockChecks = this.cartItems.map(item => {
      return this.http.get<any>(`http://localhost:8080/api/v1/inventario/verificar/${item.id}/${item.quantity}`);
    });
  
    // Usamos forkJoin para esperar que todos los observables finalicen
    forkJoin(stockChecks).subscribe(responses => {
      // Comparamos las respuestas después de que todos los observables se hayan completado
      const allInStock = responses.every(response => response === "Stock disponible");
  
      if (allInStock) {
        this.stockSufficient = true;
        this.procesarPago(); // Llamamos a procesarPago si el stock es suficiente
      } else {
        this.stockSufficient = false;
        alert('Uno o más productos no tienen suficiente stock.');
      }
    }, error => {
      console.error('Error al verificar stock:', error);
      alert('Ocurrió un error al verificar el stock.');
    });
  }

  procesarPago(): void {
    const return_url = 'http://localhost:4200/success'; // URL a la que redirige PayPal después del pago
    const cancel_url = 'http://localhost:4200/cancel'; // URL de cancelación de pago

    // Llamamos al servicio de PayPal para procesar el pago
    this.invoiceService.pagarConPaypal(this.cartItems, return_url, cancel_url).subscribe(response => {
      // Buscamos la URL de aprobación en la respuesta de PayPal
      const approvalUrl = response.links.find((link: { rel: string; }) => link.rel === 'approval_url').href;
      
      if (approvalUrl) {
        window.location.href = approvalUrl; // Redirigimos a PayPal para completar el pago
      } else {
        alert('Error al procesar el pago con PayPal.');
      }
    }, error => {
      console.error('Error al procesar el pago con PayPal:', error);
      alert('Ocurrió un error al procesar el pago.');
    });
  }

  actualizarStock(): void {
    let stockUpdates = this.cartItems.map(item => {
      return this.http.post<any>(`http://localhost:8080/api/v1/inventario/vender/${item.id}/${item.quantity}`, {});
    });

    Promise.all(stockUpdates).then(() => {
      alert('Compra realizada con éxito. El stock ha sido actualizado.');
      this.router.navigate(['/success']);
    }).catch(error => {
      console.error('Error al actualizar stock:', error);
      alert('Ocurrió un error al actualizar el stock.');
    });
  }
}
