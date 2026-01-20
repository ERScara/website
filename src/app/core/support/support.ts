import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-support',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private http = inject(HttpClient);

    public supportForm!: FormGroup;
    public isSending = false;
    public messageSent = false;
    public errorMessage: string | null = null;

    ngOnInit(): void {
      const currentUser = this.authService.currentUser();
      this.supportForm = this.fb.group({
        username: [{ value: currentUser?.username || '', disabled: true}, Validators.required],
        email: [currentUser?.email || '', [Validators.required, Validators.email]],
        reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(3000)]]
      });
    }

    get f() { return this.supportForm.controls; }

    sendRequest() {
      if (this.supportForm.valid) {
        this.isSending= true;
        this.errorMessage = null;
        const formData = this.supportForm.getRawValue();

        this.http.post('http://localhost:8000/api/auth/support/', formData).subscribe({
          next: (res) => {
            this.messageSent = true;
            this.isSending = false;
            this.supportForm.reset();
            console.log("Mensaje enviado", res);
          },
          error: (err) => {
            this.isSending = false;
            this.errorMessage = 'No se puede enviar la solicitud. Intenta nuevamente más tarde';
            console.log("Error al enviar el mensaje", err);
          }
        });
      }
    }
}
