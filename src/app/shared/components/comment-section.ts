import { Component, Input, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PostService } from '../../service/post.service';
import { Comments } from '../../models/comments.model';

@Component({
  selector: 'app-comment-section',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.scss',
})
export class CommentSection implements OnInit {
  @Input() postId!: number;
  private http = inject(HttpClient);
  private postService = inject(PostService);
  private cdRef = inject(ChangeDetectorRef);
  public authService = inject(AuthService);
  sortOrder: string = 'best';

  comments: Comments[] = [];
  public messageForm!: FormGroup;
  public messageSent = false;
  public errorMessage: string | null = null;
  newComment = '';
  isSending = false;
  totalComments = 0;
  replyingTo: Comments | null = null;
  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.postService.getComments(this.postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.cdRef.detectChanges();
      }
    });
  }
  like(comment:  Comments): void {
    this.authService.giveLike(comment.id).subscribe({
      next: (res: any) => {
        const index = this.comments.findIndex(c =>c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = {
            ...this.comments[index],
          total_likes: res.total_likes,
          total_dislikes: res.total_dislikes,
          user_vote: comment.user_vote === 'like' ? null : 'like',
          };
          this.comments = [...this.comments];
        }
        this.cdRef.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }
  dislike(comment:  Comments): void {
    this.authService.giveDislike(comment.id).subscribe({
       next: (res: any) => {
        const index = this.comments.findIndex(c =>c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = {
            ...this.comments[index],
          total_likes: res.total_likes,
          total_dislikes: res.total_dislikes,
          user_vote: comment.user_vote === 'dislike' ? null : 'dislike',
          };
          this.comments = [...this.comments];
        }
        this.cdRef.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }
  onReport(comment: Comments): void {
    if (confirm('¿Deseas reportar este comentario?')) {
      this.authService.reportComment(comment.id).subscribe({
        next: () => {
          comment.has_reported = true;
          this.cdRef.detectChanges();
        },
        error: (err) => console.error(err)
      });
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
          this.comments = [...this.comments.filter(c => c.id !== comment.id)];
          console.log("Comentario eliminado definitivamente, los comentarios restantes son: ", this.comments.length);
          this.comments = this.comments.filter(c => c.id !== comment.id && c.parent !== comment.id);
          this.cdRef.detectChanges();
        },
        error: (err) => {
           console.log("No pudiste eliminarlo", err)
        }
      })
    }
  }
  setReply(comment: Comments): void {
    this.replyingTo = comment;
  }
  getReplyToName(parentId: number | null): string { 
    if(!parentId) return '';
    const parent = this.comments.find(c => c.id === parentId);
    return parent?.username || '';
  }
   onSortChange() {
    if (this.sortOrder === 'best') {
      this.comments.sort((a, b) => b.total_likes - a.total_likes);
    } else if (this.sortOrder == 'worst') {
      this.comments.sort((a, b) => a.total_likes - b.total_likes);
    } else if (this.sortOrder == 'newest') {
      this.comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.sortOrder == 'oldest') {
      this.comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      this.comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }
  isInThread(child: Comments, parentId: number): boolean {
    if(child.parent === parentId) return true;
    const directParent = this.comments.find(c => c.id === child.parent);
    if (!directParent) return false;
    return this.isInThread(directParent, parentId);
  }
  submitComment(): void {
    const message = this.newComment.trim();
    if (!message || this.isSending) return;

    this.isSending = true;
    this.postService.createComment(
      this.postId,
      message,
      this.replyingTo?.id || null
    ).subscribe({
      next: () => {
        this.newComment = '';
        this.replyingTo = null;
        this.isSending = false;
        this.loadComments();
      },
      error: () => {
        this.isSending = false;
      }
    });
  }
}
