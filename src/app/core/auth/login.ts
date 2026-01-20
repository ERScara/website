import { Component, inject } from '@angular/core';
import { ContactForm } from '../../models/contact-form.model';
import { AuthService } from '../../service/auth.service'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { FeatureService } from '../../service/feature.service'; 
@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [FeatureService]
})
export class Login {
   private authService = inject(AuthService);
   private fb = inject(FormBuilder);
   private router = inject(Router);
   formModel = {
    username: '',
    password: '',
   } as ContactForm;

   private readonly fs = inject(FeatureService);
   count = new FormControl(0)

   public loginForm: FormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
   });

   get f() { return this.loginForm.controls; }
      
  onLogin() {
    if (this.loginForm.invalid) { alert("Por favor, revisa los campos."); return; }

    const rawValues = {
      username: this.loginForm.value.username?.trim(),
      password: this.loginForm.value.password?.trim()
    }
 
    console.log("Enviando a  Django...", this.loginForm.value)
      this.authService.login(rawValues).subscribe({
        next: (res) => {
          console.log("Django responde así: ", res)
          if (res.token) {
            localStorage.setItem('token', res.token);
          } else {
            console.error("Django no envió el token.")
          }
        },
         error: (err) => {
          console.log("Detalles del error", err)
          alert('Usuario o contraseña incorrectos en la base de datos.')
         }
      })
  }
}


