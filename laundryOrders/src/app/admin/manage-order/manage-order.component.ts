import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../shared/models/order.interface';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonGroup,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  orders: Order[] = [];
  completedOrders: Order[] = [];
  refusedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  displayDialog = false;

  private http = inject(HttpClient);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  clear(table: Table): void {
    table.clear();
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (data) => {
        this.orders = data;
        this.completedOrders = data.filter((order) => order.status === 'Terminée');
        this.refusedOrders = data.filter((order) => order.status === 'Refusée');
      },
      error: (err) => {
        console.error('Error fetching all orders:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les commandes.',
        });
      },
    });
  }

  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  validateOrder(order: Order): void {
    const summary = `
      <p><b>Date:</b> ${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p>
      <p><b>Identité:</b> ${order.username}</p>
      <p><b>Articles:</b> ${order.articles}</p>
    `;

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir valider cette commande ?' + summary,
      header: 'Confirmation de validation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.http.put(`${environment.apiUrl}/orders/${order.id}/validate`, {}).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Commande validée avec succès.',
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error validating order:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la validation de la commande.',
            });
          },
        });
      },
    });
  }

  refuseOrder(order: Order): void {
    const summary = `
      <p><b>Date:</b> ${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p>
      <p><b>Identité:</b> ${order.username}</p>
      <p><b>Articles:</b> ${order.articles}</p>
    `;

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir refuser cette commande ?' + summary,
      header: 'Confirmation de refus',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.put(`${environment.apiUrl}/orders/${order.id}/refuse`, {}).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Commande refusée avec succès.',
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error refusing order:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec du refus de la commande.',
            });
          },
        });
      },
    });
  }

  completeOrder(order: Order): void {
    const summary = `
      <p><b>Date:</b> ${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p>
      <p><b>Identité:</b> ${order.username}</p>
      <p><b>Articles:</b> ${order.articles}</p>
    `;

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir terminer cette commande ?' + summary,
      header: 'Confirmation de finalisation',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.http.put(`${environment.apiUrl}/orders/${order.id}/complete`, {}).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Commande terminée avec succès.',
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error completing order:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la finalisation de la commande.',
            });
          },
        });
      },
    });
  }
}
