import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('adminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should return true if user is Admin', () => {
    authService.getRole.and.returnValue('Admin');
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /unauthorized and return false if user is not Admin', () => {
    authService.getRole.and.returnValue('User');
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should navigate to /unauthorized and return false if role is null', () => {
    authService.getRole.and.returnValue(null);
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
