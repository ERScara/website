import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { Community } from '../../../models/community.model';

@Component({
  selector: 'app-community-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './community-create.html',
  styleUrl: './community-create.css',
})
export class CommunityCreate {
  private fb = inject(FormBuilder);
  private communityService = inject(CommunityService);
  private router = inject(Router);

  isSaving = false;
  error: string | null = null;

  readonly categories = [
    { value: 'advanced', label: 'Avanzado' },
    { value: 'design', label: 'Diseno' },
    { value: 'common', label: 'Sala Comun' },
    { value: 'modelos', label: 'Modelos' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['common', Validators.required],
  });

  submit(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.error = null;
    const payload: Pick<Community, 'name' | 'description' | 'category'> = {
      name: this.form.controls.name.value?.trim() || '',
      description: this.form.controls.description.value?.trim() || '',
      category: (this.form.controls.category.value as Community['category']) || 'common',
    };

    this.communityService.createCommunity(payload).subscribe({
      next: (community) => {
        this.isSaving = false;
        this.router.navigate(['/comunidades', community.id]);
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err?.error?.detail || 'No se pudo crear la comunidad.';
      },
    });
  }
}
