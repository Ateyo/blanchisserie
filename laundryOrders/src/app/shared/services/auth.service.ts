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
        return this.http.post<{ token: string, role?: string }>(
            `${environment.apiUrl}/auth/login`,
            { username, password }
        );
    }

    saveToken(token: string, role: string = 'User') {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.roleKey, role);
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
}