import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
})
export class NewOrderComponent {
  orderForm: FormGroup;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    this.orderForm = this.fb.group({
      date: [null, Validators.required],
      articles: ['', Validators.required],
      motif: [''],
      commentaire: [''],
    });
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs obligatoires.',
      });
      return;
    }

    const orderData: Order = {
      ...(this.orderForm.value as Order),
      date: (this.orderForm.value.date as Date).toISOString(), // Format date for backend
    };

    this.http.post(`${environment.apiUrl}/orders`, orderData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Commande passée avec succès!',
        });
        this.orderForm.reset();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de la création de la commande.',
        });
      },
    });
  }
}
