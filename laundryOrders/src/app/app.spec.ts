import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './shared/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'logout',
      'getRole',
      'verifyToken',
    ]);
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('User');
    authServiceSpy.verifyToken.and.returnValue(undefined);

    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule,
        ToolbarModule,
        ButtonModule,
        CommonModule,
        ToggleButtonModule,
        FormsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.p-button b')?.textContent).toContain('Blanchisserie');
  });

  it('should call logout on authService when logout is called', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should return true for isAdmin if role is Admin', () => {
    authServiceSpy.getRole.and.returnValue('Admin');
    expect(component.isAdmin()).toBeTrue();
  });

  it('should return false for isAdmin if role is not Admin', () => {
    authServiceSpy.getRole.and.returnValue('User');
    expect(component.isAdmin()).toBeFalse();
  });

  it('should call verifyToken on authService on ngOnInit', () => {
    expect(authServiceSpy.verifyToken).toHaveBeenCalled();
  });
});
