import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult } from '../models/search.model';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiURL = 'http://localhost:8000/api/search';
    private http = inject(HttpClient);

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ 'Authorization': `Token ${token}`});
    }

    search(query: string): Observable<SearchResult> {
        return this.http.get<SearchResult>(`${this.apiURL}/?q=${query}`, { headers: this.getHeaders()});
    }
}