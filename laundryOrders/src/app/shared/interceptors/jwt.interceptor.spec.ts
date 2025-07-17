import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('jwtInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add Authorization header if token exists', () => {
    authService.getToken.and.returnValue('test_token');
    const req = new HttpRequest('GET', '/api/data');
    let modifiedReq: HttpRequest<unknown> | undefined;

    const nextSpy: HttpHandlerFn = (r: HttpRequest<unknown>) => {
      modifiedReq = r;
      return of({} as HttpEvent<unknown>);
    };

    TestBed.runInInjectionContext(() => jwtInterceptor(req, nextSpy));

    expect(modifiedReq?.headers.has('Authorization')).toBeTrue();
    expect(modifiedReq?.headers.get('Authorization')).toBe('Bearer test_token');
  });

  it('should not add Authorization header if token does not exist', () => {
    authService.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/api/data');
    let modifiedReq: HttpRequest<unknown> | undefined;

    const nextSpy: HttpHandlerFn = (r: HttpRequest<unknown>) => {
      modifiedReq = r;
      return of({} as HttpEvent<unknown>);
    };

    TestBed.runInInjectionContext(() => jwtInterceptor(req, nextSpy));

    expect(modifiedReq?.headers.has('Authorization')).toBeFalse();
  });
});
