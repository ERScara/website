import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommunityService } from '../../../service/community.service';
import { Community } from '../../../models/community.model';

@Component({
  selector: 'app-community-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './community-list.html',
  styleUrl: './community-list.scss',
})
export class CommunityList implements OnInit {
    private communityService = inject(CommunityService);
    private cdRef = inject(ChangeDetectorRef);
    communities: Community[] = [];
    isLoading = true;
    error: string | null = null;

    ngOnInit() {
      this.communityService
        .getCommunities()
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          }),
        )
        .subscribe({
          next: (data: any) => {
            this.communities = Array.isArray(data) ? data : (data?.results || []);
          },
          error: (err) => {
            console.error('Error cargando comunidades:', err);
            this.error = err?.error?.detail || `Error al cargar las comunidades (${err?.status || 'sin status'}).`;
          },
        });
    }
    join(community: Community) {
      this.communityService.joinCommunity(community.id).subscribe({
        next: (res) => {
          community.is_member = true;
          community.total_members++;
        },
        error: (err) => console.error('Error al unirse: ', err)
      });
    }
    leave(community: Community) {
    this.communityService.leaveCommunity(community.id).subscribe({
      next: () => {
        community.is_member = false;
        community.total_members--;
      },
      error: (err) => console.error('Error al abandonar: ', err)
    });
  }
}
