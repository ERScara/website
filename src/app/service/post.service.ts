import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/posts.model'
import { Comments } from '../models/comments.model';

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
    getPostsByCommunity(communityId: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiURL}/?community=${communityId}`, { headers: this.getHeaders() });
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
    getComments(id: number): Observable<Comments[]> {
        return this.http.get<Comments[]>(`${this.apiURL}/${id}/comments/`, { headers: this.getHeaders() })
    }
    createComment(postId: number, message: string, parent: number | null = null): Observable<Comments> {
        const payload = { message, post: postId, parent };
        return this.http.post<Comments>('http://localhost:8000/api/comments/', payload, { headers: this.getHeaders() });
    }
    reportPost(id: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${id}/report`, {}, {headers: this.getHeaders()});
    }
    deletePost(id: number): Observable<any> {
        return this.http.delete(`${this.apiURL}/${id}/`, {headers: this.getHeaders()})
    }
}
