import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface WebProfile {
  id: string;
  name: string;
  temporary: boolean;
  presentation: {
    logo_image: string;
  },
  input_fields: {
    no_shipping: boolean;
    address_override: boolean;
  },
  flow_config: {
    landing_page_type: string;
    bank_txn_pending_url: string;
  }
}

export interface Payment {
  id: string;
  create_time: string;
  update_time: string;
  intent: string;
  payer: {
    payment_method: string;
    payer_info: {
      shipping_address: {

      }
    }
  }
  transactions: {
    amount: {
      total: string;
      currency: string;
      details: {
        subtotal: string;
        tax: string;
        shipping: string;
      }
    }
    description: string;
    item_list: {
      items: {
        name: string;
        sku: string;
        price: string;
        currency: string;
        quantity: string;
      },
      shipping_address: {
        recipient_name: string;
        line1: string;
        line2: string;
        city: string;
        state: string;
        postal_code: string;
        country_code: string;
        phone: string;
      }
    }
  }[],
  links: {
    href: string;
    rel: string;
    method: string;
  }[],
}

@Injectable({
    providedIn: 'root'
  })
  export class PaypalService {
  
    urlToken = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    urlPaymentExperience = 'https://api-m.sandbox.paypal.com/v1/payment-experience/web-profiles/';
    urlPayment = 'https://api-m.sandbox.paypal.com/v1/payments/payment';
    private clientId = "TU_CLIENT_ID";
    private secret = "TU_SECRET";
  
    constructor(private http: HttpClient) {}
  
    // Obtener token de acceso
    getAccessToken(): Observable<AccessToken> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.secret}`)
      });
      const body = new URLSearchParams();
      body.set('grant_type', 'client_credentials');
      return this.http.post<AccessToken>(this.urlToken, body.toString(), { headers });
    }
  
    // Crear perfil de pago en PayPal
    createWebProfile(accessToken: string, name: string): Observable<WebProfile> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
      const body = {
        name,
        presentation: { logo_image: 'https://www.paypal.com' },
        input_fields: { no_shipping: 1, address_override: 1 },
        flow_config: { landing_page_type: 'billing', bank_txn_pending_url: 'https://www.paypal.com' }
      };
      return this.http.post<WebProfile>(this.urlPaymentExperience, body, { headers });
    }
  
    // Crear un pago
    createPayment(
      accessToken: string,
      experience_profile_id: string,
      return_url: string,
      cancel_url: string,
      total: number
    ): Observable<Payment> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
  
      const totalString = total.toFixed(2); // Convertimos el total a un string con 2 decimales
  
      const body = {
        intent: 'authorize',
        experience_profile_id,
        payer: { payment_method: 'paypal' },
        transactions: [{
          amount: {
            total: totalString,
            currency: 'USD',
            details: { shipping: '0', subtotal: totalString, tax: '0' }
          },
          description: 'Compra en mi tienda',
          item_list: {
            items: [{
              name: 'Producto',
              quantity: '1',
              price: totalString,
              sku: '12345',
              currency: 'USD'
            }],
            shipping_address: {
              recipient_name: 'Cliente',
              line1: 'Calle falsa 123',
              city: 'Ciudad',
              country_code: 'US',
              postal_code: '12345',
              phone: '1234567890',
              state: 'Estado'
            }
          }
        }],
        redirect_urls: { return_url, cancel_url }
      };
  
      return this.http.post<Payment>(this.urlPayment, body, { headers });
    }
  }