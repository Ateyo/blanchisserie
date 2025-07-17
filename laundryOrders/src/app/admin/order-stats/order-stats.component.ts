import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface RawOrderStats {
  total: number;
  pending: number;
  validated: number;
  completed: number;
  refused: number;
}

interface OrderStats {
  total: number;
  pending: number;
  validated: number;
  finished: number;
}

@Component({
  selector: 'app-order-stats',
  standalone: true,
  imports: [CommonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './order-stats.component.html',
})
export class OrderStatsComponent implements OnInit {
  stats: OrderStats | null = null;
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<RawOrderStats>(`${environment.apiUrl}/orders/stats`).subscribe({
      next: (data) => {
        this.stats = {
          total: data.total,
          pending: data.pending,
          validated: data.validated,
          finished: data.completed + data.refused,
        };
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
