import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'bmk-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
 registerForm: FormGroup;
  registerConfig: any = ['name', 'email', 'accountNumber', 'password', 'confirmPassword'];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({});
  }

  ngOnInit(): void {
   this.authService.getFormConfig().subscribe(config => {
      this.registerConfig = config.register;
      const group: any = {};
      this.registerConfig.forEach((field: string) => {
        group[field] = ['', [Validators.required]]; // Assuming all fields are required
      });
      this.registerForm = this.fb.group(group);
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.login(this.registerForm.value['name'], this.registerForm.value['password']);
    }
  }
}
