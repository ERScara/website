import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from '../../service/feature.service';
import { ResetForm } from '../../models/reset-form.model';


@Component({
  selector: 'app-new-pass',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-pass.html',
  styleUrl: './new-pass.scss',
  providers: [FeatureService]
})

export class NewPass implements OnInit {
    private fb = inject(FormBuilder);
    formModel = {
    username: '',
    email: '',
    } as ResetForm;

    private readonly fs = inject(FeatureService);
    count = new FormControl(0)

    public resetRequestForm: FormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9_]+$')]],
    });
  
    get f() { return this.resetRequestForm.controls; }
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private router = inject(Router);

    uid: string | null = null;
    token: string | null = null;
    new_password: ''
    message: string;

    ngOnInit() {
      this.uid = this.route.snapshot.paramMap.get('uid');
      this.token = this.route.snapshot.paramMap.get('token');
    }

    confirmReset() {
      const emailVal = this.resetRequestForm.get('email')?.value;
      const passVal = this.resetRequestForm.get('new_password')?.value;
      if (this.uid && this.token) {
      const body = {
        uid: this.uid,
        token: this.token,
        email: emailVal,
        new_password: passVal,
      };
      console.log("Enviando al servidor: ", body);
      this.http.post('http://localhost:8000/api/auth/password-reset/confirm/', body).subscribe({
        next: (res: any) => {
          alert('¡Contraseña cambiada con éxito! Inicia tu sesión.');
          console.log("Django retorna: ", res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.message = "Error: El enlace no es válido.";
          console.log("El error es: ", err);
        }
      });
    } else { 
      const body = { email: this.resetRequestForm.value.email };

       this.http.post('http://localhost:8000/api/auth/password-reset/request/', body).subscribe({
        next: (res: any) => {
          alert('Enviando mensaje de confirmación a tu correo electrónico.');
          console.log("Django retorna: ", res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.message = "Error: El enlace no es válido.";
          console.log("El error es: ", err);
        }
        });
    }
  }
}
