import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewOrderComponent } from './new-order.component';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

  beforeEach(async () => {
    messageServiceSpy.add.calls.reset();
    await TestBed.configureTestingModule({
      imports: [NewOrderComponent, ReactiveFormsModule],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(NewOrderComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    messageServiceSpy.add.calls.reset();
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit a new order successfully', fakeAsync(() => {
    spyOn(router, 'navigate');

    const dummyOrder = {
      date: new Date(),
      articles: 'Test Articles',
      motif: 'Test Motif',
      commentaire: 'Test Commentaire',
    };

    component.orderForm.setValue(dummyOrder);
    component.onSubmit();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toBe('POST');
    req.flush({});
    tick();

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Succès',
      detail: 'Commande passée avec succès!',
    });

    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  }));

  it('should show error message if form is invalid', fakeAsync(() => {
    component.orderForm.setValue({
      date: null,
      articles: '',
      motif: '',
      commentaire: '',
    });

    component.onSubmit();
    tick();

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Veuillez remplir tous les champs obligatoires.',
    });
  }));
});
