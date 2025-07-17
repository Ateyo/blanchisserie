import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderStatsComponent } from './order-stats/order-stats.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { provideHttpClient } from '@angular/common/http';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent, OrderStatsComponent, ManageOrderComponent, TableModule],
      providers: [
        MessageService,
        ConfirmationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(AdminComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .overrideComponent(OrderStatsComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .overrideComponent(ManageOrderComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
