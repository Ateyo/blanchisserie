
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface OrderStats {
  total: number;
  pending: number;
  validated: number;
}

@Component({
  selector: 'lao-order-stats',
  standalone: true,
  imports: [CommonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './order-stats.component.html',
})
export class OrderStatsComponent implements OnInit {
  stats: OrderStats | null = null;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<OrderStats>(`${environment.apiUrl}/orders/stats`).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error fetching order stats:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les statistiques des commandes.',
        });
      },
    });
  }
}
