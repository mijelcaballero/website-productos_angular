import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Definimos las interfaces para productos y servicios
interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
}

interface Service {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  products: Product[] = [];
  services: Service[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('/assets/products.json')
      .subscribe(
        data => {
          // Filtrar productos y servicios
          this.products = data.products;
          this.services = data.services;
          this.loading = false;
        },
        error => {
          console.error('Error al cargar los datos:', error);
          this.loading = false;
        }
      );
  }
}
