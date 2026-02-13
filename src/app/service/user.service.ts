import { inject, Injectable } from '@angular/core';
import { FeatureService } from './feature.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
    private http = inject(HttpClient);
    private chatService = inject(FeatureService);
    private readonly API_URL = 'http://localhost:8000/api/auth/search';

    search(term: string): Observable<any[]>{
        if (!term.trim()) return of([]);
        return this.http.get<any[]>(`${this.API_URL}/?search=${term}`);
    }
}