import { Message, Conversation } from '../models/feature.model'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FeatureService {
    private readonly apiURL = 'http://localhost:8000/api/conversations';
    
    private readonly http = inject(HttpClient);

    getConversations(): Observable<Conversation[]> {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Token ${token}`
        };
        return this.http.get<Conversation[]>(`${this.apiURL}`, {headers});
    }
    startConversation(userId: number): Observable<Conversation> {
        return this.http.post<Conversation>(`${this.apiURL}/start/`, {
            user_id: userId
        });
    }
    markAsRead(conversationId: number): Observable<any> {
        return this.http.post(`${this.apiURL}/${conversationId}/mark_as_read/`, {})
    }
    getMessages(conversationId: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiURL}/${conversationId}/messages/`).pipe(
            tap(msgs => console.log("¡Llegaron mensajes de la API!", msgs))
        );
    }
    sendMessage(conversationId: number, text: string): Observable<Message> {
        return this.http.post<Message>(`${this.apiURL}/${conversationId}/send_message/`, {text: text});
    }
}