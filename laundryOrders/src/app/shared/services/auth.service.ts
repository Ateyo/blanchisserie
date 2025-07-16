import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly tokenKey = 'jwt_token';
    private readonly roleKey = 'user_role';

    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(
            `${environment.apiUrl}/auth/login`,
            { username, password }
        );
    }

    saveToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
        const role = this.getRoleFromToken(token);
        localStorage.setItem(this.roleKey, role);
    }

    private getRoleFromToken(token: string): string {
        if (!token) {
            return 'User';
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || 'User';
        } catch (e) {
            console.error('Error decoding token', e);
            return 'User';
        }
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.roleKey);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    getRole() {
        return localStorage.getItem(this.roleKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    verifyToken() {
        const token = this.getToken();
        if (!token) {
            this.logout();
            return;
        }

        this.http.get(`${environment.apiUrl}/auth/verify-token`).subscribe({
            next: (res: any) => {
                if (!res.valid) {
                    this.logout();
                }
            },
            error: () => {
                this.logout();
            }
        });
    }
}