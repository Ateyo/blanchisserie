import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ManageOrderComponent } from './manage-order.component';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { Order } from '../../shared/models/order.interface';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { core } from '@angular/compiler';

describe('ManageOrderComponent', () => {
  let component: ManageOrderComponent;
  let fixture: ComponentFixture<ManageOrderComponent>;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageOrderComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(ManageOrderComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ManageOrderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on ngOnInit', () => {
    fixture.detectChanges();
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

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrders);

    expect(component.orders).toEqual(dummyOrders);
    expect(component.completedOrders).toEqual([]);
    expect(component.refusedOrders).toEqual([]);
  });

  it('should show order details', () => {
    fixture.detectChanges();
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

  it('should validate order', fakeAsync(() => {
    fixture.detectChanges();

    const reqInit = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
    reqInit.flush([]);

    spyOn(messageService, 'add');
    spyOn(component, 'loadOrders');

    const confirmSpy = spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      options.accept();
      return confirmationService;
    });

    const dummyOrder: Order = {
      id: 1,
      userId: 1,
      articles: 'Shirt',
      status: 'En attente',
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'user.name',
      date: '07/07/2025',
    };

    component.validateOrder(dummyOrder);
    tick(); // Process the confirmation and the HTTP request
    fixture.detectChanges(); // Ensure component view is updated

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders/1/validate`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    tick();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Succès',
      detail: 'Commande validée avec succès.',
    });
    expect(component.loadOrders).toHaveBeenCalled();
  }));

  it('should refuse order', () => {
    fixture.detectChanges();
    const reqInit = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
    reqInit.flush([]);

    spyOn(messageService, 'add');
    spyOn(component, 'loadOrders');
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => options.accept());

    const dummyOrder: Order = {
      id: 1,
      userId: 1,
      articles: 'Shirt',
      status: 'En attente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    component.refuseOrder(dummyOrder);

    const reqPut = httpTestingController.expectOne(
      `${environment.apiUrl}/orders/${dummyOrder.id}/refuse`
    );
    expect(reqPut.request.method).toBe('PUT');
    reqPut.flush({});

    const reqReload = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
    reqReload.flush([]);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Succès',
      detail: 'Commande refusée avec succès.',
    });
    expect(component.loadOrders).toHaveBeenCalled();
  });

  it('should complete order', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    spyOn(component, 'loadOrders');
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => options.accept());

    const dummyOrder: Order = {
      id: 1,
      userId: 1,
      articles: 'Shirt',
      status: 'Validée',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    component.completeOrder(dummyOrder);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/orders/${dummyOrder.id}/complete`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Succès',
      detail: 'Commande terminée avec succès.',
    });
    expect(component.loadOrders).toHaveBeenCalled();
  });
});
