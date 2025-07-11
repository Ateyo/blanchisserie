import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'lao-admin',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any | null = null;
  displayDialog: boolean = false;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error fetching all orders:', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les commandes.' });
      }
    });
  }

  showOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  validateOrder(order: any): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir valider cette commande ?',
      header: 'Confirmation de validation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.http.put(`${environment.apiUrl}/orders/${order.id}/validate`, {}).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commande validée avec succès.' });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error validating order:', err);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la validation de la commande.' });
          }
        });
      }
    });
  }

  refuseOrder(order: any): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir refuser cette commande ?',
      header: 'Confirmation de refus',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.put(`${environment.apiUrl}/orders/${order.id}/refuse`, {}).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commande refusée avec succès.' });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error refusing order:', err);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du refus de la commande.' });
          }
        });
      }
    });
  }
}