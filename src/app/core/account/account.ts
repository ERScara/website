import { Component, inject } from '@angular/core';
import { ContactForm } from '../../models/contact-form.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, AbstractControl, ValidationErrors, ValidatorFn , FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { FeatureService } from '../../service/feature.service'; 
import { AuthService } from '../../service/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const repeatpass = control.get('repeatpass');

  return password &&  repeatpass && password.value !== repeatpass.value ? { passwordMismatch: true} : null;
};
@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
  providers: [FeatureService]
})
export class Account { 
   private fb = inject(FormBuilder);
   private router = inject(Router);
   private  authService = inject(AuthService);
   formModel = {
    username: '',
    email: '',
    password: '',
    repeatpass: '',
   } as ContactForm;

   private readonly fs = inject(FeatureService);
   count = new FormControl(0)

   public registerForm: FormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9_]+$')]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      repeatpass: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
   }, { validators: passwordMatchValidator});

   get f() { return this.registerForm.controls; }
      
  onRegister() {
    if (this.registerForm.valid) {
      const{ username, password, email } = this.registerForm.value;
      const dataToDjango = { username, password, email }

      this.authService.register(dataToDjango).subscribe({
        next: (res) => {
          console.log("Creación exitosa, Django responde: ", res)
          this.router.navigate(['/'])
        },
        error: (err) => {
          console.log("Error: ", err)
           alert("¡Error al registrar!")
        }
      })
    }
  }
}
