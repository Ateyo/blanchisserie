import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lao-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule
    ],
})
export class LoginComponent {

    error = '';
    form: FormGroup;

    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        const { username, password } = this.form.value;

        this.auth.login(username!, password!).subscribe({
            next: (res) => {
                this.auth.saveToken(res.token);
                if (this.auth.getRole() === 'Admin') {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/orders']);
                }
            },
            error: () => {
                this.error = 'Invalid credentials';
            }
        });
    }
}