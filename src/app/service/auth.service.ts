import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
    username: string;
    email: string;
    is_superuser: boolean;
}


@Injectable({ providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:8000/api/auth/login/'
    private REGISTER_URL = 'http://localhost:8000/api/auth/'
    public currentUser = signal<User | null>(localStorage.getItem('username') && localStorage.getItem('email')&& localStorage.getItem('is_superuser')? {username: localStorage.getItem('username'), email: localStorage.getItem('email'), is_superuser: localStorage.getItem('is_superuser') === 'true'} : null);
    public IsLoggedIn = computed(() => !!this.currentUser());

    login(credentials: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, credentials).pipe(
            tap(response => {
                localStorage.setItem('username', response.username);
                localStorage.setItem('email', response.email);
                localStorage.setItem('is_superuser', String(response.is_superuser));
                const tokenValue = response.token || response.key;
                if (tokenValue) {
                    localStorage.setItem('token', tokenValue);
                }
                this.currentUser.set({
                    username: response.username,
                    email: response.email,
                    is_superuser: !!response.is_superuser
                });
                window.location.reload();
            })
        )   
    }
    logout() {
        localStorage.clear();
        localStorage.removeItem('username');
        this.currentUser.set(null);
        window.location.reload();
    }
    register(userData: any): Observable<any> {
        return this.http.post<any>(`${this.REGISTER_URL}register/`, userData).pipe(
            tap(res => {
                this.loginState(res.username, res.email, res.is_superuser || false);
            })
        );
    }
    giveLike(CapituloId: number){
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

        return this.http.post(`http://localhost:8000/api/comments/${CapituloId}/toggle_like/`, {}, { headers });
    }
    giveDislike(CapituloId: number){
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

        return this.http.post(`http://localhost:8000/api/comments/${CapituloId}/toggle_dislike/`, {}, { headers });
    }
    private loginState(username: string, email:string, is_superuser: boolean) {
       localStorage.setItem('username', username);
       localStorage.setItem('email', email);
       localStorage.setItem('is_superuser', String(is_superuser));
       this.currentUser.set({
          username: username,
          email: email,
          is_superuser: is_superuser
       });
    }
}