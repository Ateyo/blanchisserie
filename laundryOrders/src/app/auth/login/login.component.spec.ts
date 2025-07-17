import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken', 'getRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
      ],
    })
      .overrideComponent(LoginComponent, {
        set: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.form.get('username')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should mark fields as invalid when empty', () => {
    expect(component.form.get('username')?.valid).toBeFalse();
    expect(component.form.get('password')?.valid).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('should call authService.login and navigate to /admin if role is Admin', () => {
    authService.login.and.returnValue(of({ token: 'admin_token' }));
    authService.getRole.and.returnValue('Admin');

    component.form.setValue({ username: 'admin', password: 'password' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('admin', 'password');
    expect(authService.saveToken).toHaveBeenCalledWith('admin_token');
    expect(authService.getRole).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    expect(component.error).toBe('');
  });

  it('should call authService.login and navigate to /orders if role is User', () => {
    authService.login.and.returnValue(of({ token: 'user_token' }));
    authService.getRole.and.returnValue('User');

    component.form.setValue({ username: 'user', password: 'password' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('user', 'password');
    expect(authService.saveToken).toHaveBeenCalledWith('user_token');
    expect(authService.getRole).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
    expect(component.error).toBe('');
  });

  it('should set error message on login failure', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.form.setValue({ username: 'invalid', password: 'invalid' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('invalid', 'invalid');
    expect(authService.saveToken).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe('Invalid credentials');
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });
});
