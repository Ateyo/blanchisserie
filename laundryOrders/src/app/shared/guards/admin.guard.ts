import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getRole();
    if (role === 'Admin') {
        return true;
    }

    router.navigate(['/unauthorized']); // Or redirect elsewhere
    return false;
};