import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {
  calculateInvoice(items: any[]) {
    const total = items.reduce((acc, item) => acc + item.price, 0);
    const iva = total * 0.15; // 15% IVA
    const finalAmount = total + iva;
    return { total, iva, finalAmount };
  }
}
