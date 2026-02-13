import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatWebSocketService {
    private socket?: WebSocket;
    private messageSubject = new Subject<any>();

    public messages$ = this.messageSubject.asObservable();

    connect(conversationId: number, token: string) {
        console.log('Intentando conectar WebSocket', { conversationId, token: token? 'existe': 'no existe'})
        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
                console.log('Elsoquet ya está activo o conectando.');
                return;
            }
        }
        const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/?token=${token}`
        console.log('URL del WebSocket: ', wsUrl);
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('¡WebSocket conectado!', conversationId)
        }
        this.socket.onmessage = (event) => {
            console.log('Mensaje recibido de WebSocket: ', event.data);
            const data = JSON.parse(event.data);
            this.messageSubject.next(data);
        }
        this.socket.onerror = (error) => {
            if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                console.error('Error en el WebSocket: ', error)
            } 
        }
        this.socket.onclose = (event) => {
            console.log('WebSocket desconectado.', event.code);
            this.socket = null;
        }
    }
    isSocketOpen(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
    sendMessage(conversationId: number, text: string) {
        console.log('Intentando enviar mensaje...', {socketExists: !!this.socket, readyState: this.socket?.readyState, conversationId, text })
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Socket abierto, enviando mensaje...')
            this.socket.send(JSON.stringify({
                type: 'send_message',
                conversation_id: conversationId,
                text: text,
            }));
        } else {
            console.error('Socket no está abierto. ReadyState:', this.socket?.readyState);
            console.error('Estados posibles: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3');
        }
    }
    disconnect() {
        if (this.socket) {
            this.socket.close()
        }
    }
}