import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStatsComponent } from './order-stats.component';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('OrderStatsComponent', () => {
  let component: OrderStatsComponent;
  let fixture: ComponentFixture<OrderStatsComponent>;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatsComponent],
      providers: [MessageService, provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(OrderStatsComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderStatsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on ngOnInit', () => {
    fixture.detectChanges();
    const dummyStats = {
      total: 10,
      pending: 2,
      validated: 5,
      completed: 2,
      refused: 1,
    };

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders/stats`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStats);

    expect(component.stats).toEqual({
      total: 10,
      pending: 2,
      validated: 5,
      finished: 3,
    });
  });

  it('should show error message if stats loading fails', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders/stats`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les statistiques des commandes.',
    });
  });
});
