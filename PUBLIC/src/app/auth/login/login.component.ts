
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bmk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginConfig: any = ['user', 'password'];
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.authService.getFormConfig().subscribe(config => {
      this.loginConfig = config.login;
      const group: any = {};
      this.loginConfig.forEach((field: string) => {
        group[field] = ['', [Validators.required]]; // Assuming all fields are required
      });
      this.loginForm = this.fb.group(group);
    });
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
