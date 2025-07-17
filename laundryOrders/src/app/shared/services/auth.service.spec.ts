import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    const dummyToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    service.saveToken(dummyToken);
    expect(service.getToken()).toBe(dummyToken);
  });

  it('should return true for isLoggedIn if token exists', () => {
    service.saveToken('some_token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn if no token', () => {
    localStorage.removeItem('jwt_token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should logout and clear token', () => {
    service.saveToken('some_token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should get role from token', () => {
    const adminToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.some_admin_signature';
    service.saveToken(adminToken);
    expect(service.getRole()).toBe('Admin');

    const userToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzZXIiLCJyb2xlIjoiVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.some_user_signature';
    service.saveToken(userToken);
    expect(service.getRole()).toBe('User');
  });

  it('should call verify-token endpoint on verifyToken', () => {
    service.saveToken('test_token');
    service.verifyToken();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/verify-token`);
    expect(req.request.method).toBe('GET');
    req.flush({ valid: true });
  });

  it('should logout if verify-token returns invalid', () => {
    spyOn(service, 'logout');
    service.saveToken('test_token');
    service.verifyToken();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/verify-token`);
    req.flush({ valid: false });
    expect(service.logout).toHaveBeenCalled();
  });

  it('should logout if verify-token errors', () => {
    spyOn(service, 'logout');
    service.saveToken('test_token');
    service.verifyToken();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/verify-token`);
    req.error(new ErrorEvent('Network error'));
    expect(service.logout).toHaveBeenCalled();
  });
});
