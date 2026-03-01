import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../models/community.model';

@Injectable({
    providedIn: 'root'
})
export class CommunityService {
    private apiURL = 'http://localhost:8000/api/communities';
    private http = inject(HttpClient);

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ 'Authorization': `Token ${token}` });
    }
    getCommunities(): Observable<Community[]> {
        return this.http.get<Community[]>(`${this.apiURL}/`, { headers: this.getHeaders()});
    }
    getCommunity(id: number): Observable<Community> {
        return this.http.get<Community>(`${this.apiURL}/${id}/`,  {headers: this.getHeaders()});
    }
    createCommunity(data: Partial<Community>): Observable<Community> {
        return this.http.post<Community>(`$this.apiURL}/`, data, { headers: this.getHeaders()});
    }
    joinCommunity(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/join/`, {}, { headers: this.getHeaders()});
    }
    leaveCommunity(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/leave/`, {}, { headers: this.getHeaders()});
    }
    getPending(): Observable<Community[]> {
        return this.http.get<Community[]>(`${this.apiURL}/pending/`, { headers: this.getHeaders()});
    }
    reviewCommunity(id: number, status: 'approved' | 'rejected'): Observable<any> {
        return this.http.patch(`${this.apiURL}/${id}/review/`, {status}, {headers: this.getHeaders()});
    }
    relocateCommunity(id: number, category: string, reason: string): Observable<any> {
        return this.http.patch(`${this.apiURL}/${id}/relocate/`, {category,  relocation_reason: reason})
    }
}