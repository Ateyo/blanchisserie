import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Order } from '../shared/models/order.interface';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        MessageService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(OrdersComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
    fixture.detectChanges();
    // Handle the initial loadOrders call in ngOnInit
    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders/mine`);
    req.flush([]); // Flush with an empty array or dummy data
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on ngOnInit', () => {
    const dummyOrders: Order[] = [
      {
        id: 1,
        userId: 1,
        articles: 'Shirt',
        status: 'En attente',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        articles: 'Pants',
        status: 'Validée',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    component.ngOnInit();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders/mine`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrders);

    expect(component.orders).toEqual(dummyOrders);
  });

  it('should show order details', () => {
    const dummyOrder: Order = {
      id: 1,
      userId: 1,
      articles: 'Shirt',
      status: 'En attente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    component.showOrderDetails(dummyOrder);
    expect(component.selectedOrder).toEqual(dummyOrder);
    expect(component.displayDialog).toBeTrue();
  });

  it('should navigate to new order page', () => {
    spyOn(router, 'navigate');
    component.createNewOrder();
    expect(router.navigate).toHaveBeenCalledWith(['/orders/new']);
  });

  it('should unsubscribe from routerSubscription on ngOnDestroy', () => {
    spyOn(component['routerSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['routerSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
