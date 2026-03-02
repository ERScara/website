import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommunityService } from '../../../service/community.service';
import { PostService } from '../../../service/post.service';
import { Community } from '../../../models/community.model';
import { Post } from '../../../models/posts.model';

@Component({
  selector: 'app-community-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './community-detail.html',
  styleUrl: './community-detail.scss',
})
export class CommunityDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private communityService = inject(CommunityService);
  private postService = inject(PostService);
  private communityId = 0;

  community: Community | null = null;
  posts: Post[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.communityId = Number(
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.paramMap.get('communityId'),
    );
    if (!this.communityId) {
      this.error = 'Comunidad invalida.';
      this.isLoading = false;
      return;
    }

    this.loadCommunity();
    this.loadPosts();
  }

  private loadCommunity(): void {
    this.communityService
      .getCommunity(this.communityId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (community) => {
          this.community = community;
        },
        error: (err) => {
          this.error = err?.error?.detail || `No se pudo cargar la comunidad (${err?.status || 'sin status'}).`;
        },
      });
  }

  private loadPosts(): void {
    this.postService
      .getPostsByCommunity(this.communityId)
      .subscribe({
        next: (posts: any) => {
          this.posts = Array.isArray(posts) ? posts : (posts?.results || []);
        },
        error: () => {
          this.posts = [];
        },
      });
  }
}
