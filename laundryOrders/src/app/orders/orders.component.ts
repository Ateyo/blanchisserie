import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lao-orders',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  selectedOrder: any | null = null;
  displayDialog: boolean = false;
  private routerSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/orders')
    ).subscribe(() => {
      this.loadOrders();
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadOrders(): void {
    this.http.get<any[]>(`${environment.apiUrl}/orders/mine`).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les commandes.' });
      }
    });
  }

  showOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  createNewOrder(): void {
    this.router.navigate(['/orders/new']);
  }
}