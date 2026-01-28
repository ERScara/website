import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Comments } from '../../models/comments.model';
import { Volcano } from '../../models/volcano.model'; 
import { VolcanoService } from '../../service/volcano.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'app-capitulo1',
  templateUrl: './capitulo1.html',
  styleUrl: './capitulo1.scss',
})
export class Capitulo1 implements OnInit {
  protected title = 'website';
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  public messageForm!: FormGroup;
  public isSending = false;
  public messageSent = false;
  public errorMessage: string | null = null;
  public replyingTo: Comments | null = null;
  public listComments: Comments[] = [];

  isVisible = false;
  public vulcan: Volcano[] = [];

  setReply(comment: Comments) {
    this.replyingTo = comment;
    console.log("Respondiendo a: ", this.replyingTo.username);
    document.getElementById('commentForm')?.scrollIntoView({behavior: 'smooth'});
  }

  isInThread(child: any, parentId: number): boolean {
    if(child.parent === parentId) return true;
    const nextParent = this.listComments.find(c => c.id === child.parent);
    if (nextParent && nextParent.id !== child.id) {
      return this.isInThread(nextParent, parentId);
    }
    return false;
  }

  getReplyToName(parentId: number): string {
    const parent = this.listComments.find(c => c.id === parentId);
    return parent ? parent.username : '';
  }

  private readonly volcanoService = inject(VolcanoService);

  get f() { return this.messageForm.controls; }
  
  ngOnInit(): void {
    this.initForm();
    this.getComments();
    this.loadVolcanoes();
  }

  private initForm(): void {
    const currentUser = this.authService.currentUser();
    this.messageForm = this.fb.group({
      username: [{ value: currentUser?.username, disabled: true}],
      message: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(3000)]],
      date: [new Date().toISOString()],
    });
  }
  loadVolcanoes(): void {
    this.volcanoService.getVolcanes().subscribe({
      next: (data: Volcano[]) => {
        this.vulcan = data;
        console.log("Volcanoes loaded", this.vulcan);
      }, error: (err) => console.log("Error connecting to Django", err)
    })
  }
  getComments(){
    this.http.get('http://localhost:8000/api/comments/?capitulo=1').subscribe({
      next: (data: any) => {
        const rawData = Array.isArray(data) ? data : (data.results || []);
        this.listComments = rawData.sort((a: any, b: any) => a.id - b.id);
        console.log("Comentarios cargados y ordenados: ", this.listComments);
        this.cdr.detectChanges();
      },
      error: (err) => console.warn("error cargando comentarios", err)
    })
  }
  toggleVolcanoes() {
     this.isVisible = !this.isVisible;
     if (this.isVisible && this.vulcan.length === 0) {
      this.loadVolcanoes();
     }
  }
  deleteComment(comment: Comments) {   
      const aviso = comment.has_active_replies ? 'Este comentario tiene respuestas. Si lo borras se ocultará todo el hilo.' : '¿Estás seguro de que quieres eliminar este comentario?';
      if (confirm(aviso)) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Token ${token}`
      })
      this.http.delete(`http://localhost:8000/api/comments/${comment.id}/`, {headers}).subscribe({
        next: () => {
          this.listComments = [...this.listComments.filter(c => c.id !== comment.id)];
          console.log("Comentario eliminado definitivamente, los comentarios restantes son: ", this.listComments.length);
          this.listComments = this.listComments.filter(c => c.id !== comment.id && c.parent !== comment.id);
          this.cdr.detectChanges();
        },
        error: (err) => {
           console.log("No pudiste eliminarlo", err)
        }
      })
    }
  }
  sendMessage() {
    if (this.messageForm.valid) {
      this.isSending= true;
      this.errorMessage = null;
      const formData = this.messageForm.getRawValue();

      const token = localStorage.getItem('token');
      console.log("Token Recuperado:", token);

      if (!token) {
        console.error("No se encontró un token en el almacenamiento local");
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`
      })

      const DjangoData = {
         username: formData.username,
         message: formData.message,
         parent: this.replyingTo ? this.replyingTo.id : null,
      }

      this.http.post('http://localhost:8000/api/comments/', DjangoData, {headers}).subscribe({
        next: (res: any) => {
          this.messageSent = true;
          this.isSending = false;
          this.listComments = [res, ...this.listComments];
          this.messageForm.get('message')?.reset();
          console.log("Mensaje enviado", res);
          this.getComments();
          this.replyingTo = null;
        },
        error: (err) => {
          this.isSending = false;
          this.errorMessage = 'No se puede enviar la solicitud. Intenta nuevamente más tarde';
          console.log("Error al enviar el mensaje", err);
        }
      });
    }
  }
  like(comment: Comments) {
    this.authService.giveLike(comment.id).subscribe({
      next: (res: any) => {
        comment.total_likes = res.total_likes;
        comment.total_dislikes = res.total_dislikes;
        comment.disableBtn1 = true;
        console.log(`Like actualizado: ${comment.total_likes}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Error al calificar: ", err)
      } 
    })
  }
  dislike(comment: Comments) {
    this.authService.giveDislike(comment.id).subscribe({
      next: (res: any) => {
        comment.total_dislikes = res.total_dislikes;
        comment.total_likes = res.total_likes;
        comment.disableBtn2 = true;
        console.log(`Like actualizado: ${comment.total_likes}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Error al calificar: ", err)
      } 
    })
  }
  onReport(comment: Comments) {
    const currentUser = localStorage.getItem('username')
    if (comment.username == currentUser) {
      alert("No puedes reportar tu propio comentario, si no es de tu agrado puedes eliminarlo.");
      return;
    }
    if (confirm("¿Estás seguro de que quieres marcar este mensaje para revisión?")) {
      this.authService.reportComment(comment.id).subscribe({
        next: () => {
          alert("Gracias por marcar este comentario. El administrador revisará el comentario.")
        }, 
        error: () => {
          alert("No se pudo enviar el reporte, intente nuevamente más tarde.")
        }
      })
    }
  }
}