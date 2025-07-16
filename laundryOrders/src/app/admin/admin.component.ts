import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatsComponent } from './order-stats/order-stats.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';

@Component({
  selector: 'lao-admin',
  standalone: true,
  imports: [
    CommonModule,
    OrderStatsComponent,
    ManageOrderComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

}
