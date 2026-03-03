import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../service/post.service';

@Component({
  selector: 'app-post-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss',
})
export class PostCreate implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  communityId = 0;
  isSaving = false;
  error: string | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    prompt: ['', [Validators.required, Validators.minLength(10)]],
    target_model: [''],
  });

  ngOnInit(): void {
    this.communityId = Number(this.route.snapshot.paramMap.get('communityId'));
    if (!this.communityId) {
      this.error = 'Comunidad invalida.';
    }
  }

  submit(): void {
    if (!this.communityId || this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.error = null;
    const payload = {
      title: this.form.controls.title.value?.trim() || '',
      content: this.form.controls.content.value?.trim() || '',
      prompt: this.form.controls.prompt.value?.trim() || '',
      target_model: this.form.controls.target_model.value?.trim() || '',
      community: this.communityId,
    };

    this.postService.createPost(payload).subscribe({
      next: (post) => {
        this.isSaving = false;
        this.router.navigate(['/comunidades', this.communityId, 'posts', post.id]);
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err?.error?.detail || 'No se pudo crear el post.';
      },
    });
  }
}
