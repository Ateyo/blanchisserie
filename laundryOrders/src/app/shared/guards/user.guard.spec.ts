import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { userGuard } from './user.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('userGuard', () => {
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

  it('should return true if user is not Admin', () => {
    authService.getRole.and.returnValue('User');
    const result = TestBed.runInInjectionContext(() => userGuard({} as any, {} as any));
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /admin and return false if user is Admin', () => {
    authService.getRole.and.returnValue('Admin');
    const result = TestBed.runInInjectionContext(() => userGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should return true if role is null (default to user behavior)', () => {
    authService.getRole.and.returnValue(null);
    const result = TestBed.runInInjectionContext(() => userGuard({} as any, {} as any));
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
