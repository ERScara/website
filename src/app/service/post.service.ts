import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/posts.model'

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiURL = 'http://localhost:8000/api/posts';
    private http = inject(HttpClient);
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ 'Authorization': `Token ${token}`});
    }
    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiURL}/`, { headers: this.getHeaders() });
    }
    getPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.apiURL}/${id}/`, {headers: this.getHeaders()});
    }
    createPost(data: Partial<Post>): Observable<Post> {
        return this.http.post<Post>(`${this.apiURL}/`, data, {headers: this.getHeaders()});
    }
    likePost(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/like/`, {}, {headers: this.getHeaders()});
    }
    dislikePost(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/dislike/`, {}, {headers: this.getHeaders()});
    }
    getComments(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiURL}/${id}/comments/`, { headers: this.getHeaders() })
    }
    reportPost(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/report`, {}, {headers: this.getHeaders()});
    }
    deletePost(id: number): Observable<any> {
        return this.http.delete(`${this.apiURL}/${id}/`, {headers: this.getHeaders()})
    }
}