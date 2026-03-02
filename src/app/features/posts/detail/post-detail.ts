import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../service/post.service';
import { Post } from '../../../models/posts.model';
import { Comments } from '../../../models/comments.model';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);

  communityId = 0;
  postId = 0;
  post: Post | null = null;
  comments: Comments[] = [];
  newComment = '';
  isLoading = true;
  isSending = false;
  error: string | null = null;

  ngOnInit(): void {
    this.communityId = Number(this.route.snapshot.paramMap.get('communityId'));
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));

    if (!this.postId) {
      this.error = 'Post invalido.';
      this.isLoading = false;
      return;
    }

    this.loadPost();
    this.loadComments();
  }

  loadPost(): void {
    this.postService.getPost(this.postId).subscribe({
      next: (data) => {
        this.post = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el post.';
        this.isLoading = false;
      },
    });
  }

  loadComments(): void {
    this.postService.getComments(this.postId).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar los comentarios.';
      },
    });
  }

  submitComment(): void {
    const message = this.newComment.trim();
    if (!message || this.isSending) {
      return;
    }

    this.isSending = true;
    this.postService.createComment(this.postId, message).subscribe({
      next: () => {
        this.newComment = '';
        this.isSending = false;
        this.loadComments();
      },
      error: () => {
        this.error = 'No se pudo publicar el comentario.';
        this.isSending = false;
      },
    });
  }
}
