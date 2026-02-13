import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureService } from '../service/feature.service';
import { AuthService } from '../service/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { UserService } from '../service/user.service';
import { ChatWebSocketService } from '../service/chat-websockets.service';
import { ChangeDetectorRef } from '@angular/core';
import { Message, Conversation} from '../models/feature.model';

@Component({
    selector: 'app-header-menu',
    standalone: true,
    imports: [ CommonModule, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './header-menu.component.html',
    styleUrl: './header-menu.component.scss',
    providers: [AuthService]
})

export class HeaderMenuComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    public authService = inject(AuthService);
    public chatService = inject(FeatureService);
    public userService = inject(UserService);
    private cdRef = inject(ChangeDetectorRef);
    private wsService = inject(ChatWebSocketService);
    public readonly menuItems = [
        {label: 'Inicio', route:'/'},
        {label: 'Capítulo N°1', route:'/Capitulo1'},
        {label: 'Capítulo N°2', route:'/Capitulo2'},
        {label: 'Capítulo N°3', route:'/Capitulo3'},
        {label: 'Capítulo N°4', route:'/Capitulo4'},
        {label: 'Capítulo N°5', route:'/Capitulo5'},
        {label: 'Capítulo N°6', route:'/Capitulo6'},
    ]

    searchSubject = new Subject<string>();
    messages: Message[] = [];
    searchResults: any[] = [];
    conversations: Conversation[] = [];
    selectedConversation: Conversation | null = null;
    public currentUser: any = null;
    toSendText: '';
    newText: '';
    
    sendMessage() {
        if (!this.newText.trim() || !this.selectedConversation) {
            console.warn("Falta texto o conversación seleccionada");
            return;
        }

        if (!this.wsService.isSocketOpen()) {
            console.error("No se puede enviar: El socket está cerrado o conectando.")
            return;
        }
        const textValue = this.newText;
        this.newText = '';

        const tempMessage: Message = {
            id: 0,
            text: textValue,
            is_me: true,
            created_at: new Date().toISOString(),
            is_read: false,
            sender: this.currentUser.id
        }

        this.messages = [...this.messages, tempMessage];
        setTimeout(() => {
           this.cdRef.detectChanges();
        }, 0);
        this.scrollToBottom();

        this.wsService.sendMessage(this.selectedConversation.id, textValue);
        setTimeout(() => {
            if (this.messages.includes (tempMessage)) {
                console.warn('Mensaje no confirmado, removiendo temporal.');
                this.messages = this.messages.filter(m => m !== tempMessage);
            }
        }, 5000);
    }

    onSearch (event:any) {
        const term = event.target.value;
        console.log('Escribiendo...', term);
        this.searchSubject.next(term);
    }

    getOtherUser(conv: Conversation) {
        const other = conv.participants.find(p => p.id !== this.currentUser.id);
        return other.username;
    }

    isOtherUserAdmin(conv: Conversation): boolean {
        const other = conv.participants.find(p => p.id !== this.currentUser.id);
        return other?.is_superuser || false;
    }

    ngOnInit() {
         this.wsService.messages$.subscribe({
                next: (data) => {
                    if (data.type === 'new_message') {
                        this.handleNewMessage(data.message);
                    }
                },
                error: (err) => console.error('Error en el WebSocket: ', err)
            });
        this.currentUser = this.authService.getCurrentUser();
        this.chatService.getConversations().subscribe({
            next: (data: Conversation[]) => {
                this.conversations = data;
            },
            error: (err) => console.error('Error cargando chats', err)
        })
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => this.userService.search(term))
        ).subscribe({
            next: (data: any) => {
                console.log('Datos recibidos del servidor: ', data);
                this.searchResults = data;
            },
            error: (err) => console.error('Error en el pipe:', err)
        });
    }

    openDirectChat(user: any) {
        console.log('openDirectChat es llamado por: ', user)
        console.log('Abriendo chat directo con:', user.username)
        this.chatService.startConversation(user.id).subscribe({
            next: (conversation: Conversation) => {
                this.selectedConversation = conversation;
                this.selectChat(conversation);

                const token = localStorage.getItem('token');
                console.log('Token obtenido:', token ? 'Si existe' : 'No existe');
                console.log('Conversation ID: ', conversation.id);
                if (token) {
                    console.log('LLAMANDO a wsService.connect()...');
                    this.wsService.disconnect()
                    this.wsService.connect(conversation.id, token);
                    console.log('connect() fue llamado. ')
                } else {
                    console.log('No hay token.')
                }
            }, 
            error: (err) => {
                console.error('Error en startConversation: ', err);
                console.error('Detalles del error: ', JSON.stringify(err, null, 2));
            }
        });
    }

    handleNewMessage(message: any) {
        console.log('Mensaje recibido', message);
        if (this.selectedConversation?.id === message.conversation) {
            this.messages.push({
                ...message,
                is_me: message.sender === this.currentUser.id
            });
            setTimeout(() => {
                this.cdRef.detectChanges();
            }, 0);
            this.scrollToBottom();
            this.chatService.getConversations().subscribe({
                next: (data:Conversation[]) => {
                    this.conversations = data;
                }
            });
        }
    }
    selectUser(user: any) {
        this.chatService.startConversation(user.id).subscribe({
            next: (newConv: Conversation) => {
                const index = this.conversations.findIndex(c => c.id === newConv.id);

                if (index === -1) {
                   this.conversations.unshift(newConv);
                } else {
                    this.conversations.splice(index, 1);
                    this.conversations.unshift(newConv);
                }
                this.selectChat(newConv);

                const token = localStorage.getItem('token');
                if (token) {
                    this.wsService.disconnect();
                    console.log('Conectando WebSocket desde selectUser...');
                    setTimeout(() => {
                        console.log('Iniciando nueva conexión...');
                        this.wsService.connect(newConv.id, token);
                        this.cdRef.detectChanges();
                    }, 50);
                }
            }, 
            error: (err) => console.error("Error al iniciar la conversación.", err)
        });
        this.searchResults = [];
    }

    get totalUnreadCount(): number {
        return this.conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
    }

    onEnterPressed() {
        if (this.searchResults && this.searchResults.length > 0) {
            const firstUser = this.searchResults[0];
            console.log('Abriendo chat directo con: ', firstUser.username);
            this.selectUser(firstUser);
            this.searchResults = [];
        } else if (!this.authService.IsLoggedIn()) {
            alert("Debe ingresar a su cuenta para buscar usuarios.");
        } else if (this.currentUser) {
            alert("No puedes buscarte a tí mismo, busca a otro usuario.");
        } else {
            alert("No se encontró a ningún usuario con ese nombre.");
        }
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.scrollContainer) {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            }
        }, 0);
    }

    selectChat(conv: Conversation) {
        this.selectedConversation = conv;
        console.log("Cargando los mensajes de la conversación", conv.id)
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Conectando WebSocket desde selectChat...');
            this.wsService.disconnect();
            this.wsService.connect(conv.id, token);
        }
        if (conv.unread_count > 0) {
            this.chatService.markAsRead(conv.id).subscribe(() => {
                conv.unread_count = 0;
            });
        }
        this.chatService.getMessages(conv.id).subscribe({
            next: (msgs: Message[]) => {
                console.log("DEBUG: Mi ID actual es: ", this.currentUser?.id);
                this.messages = msgs.map(m => {
                    const senderId = (typeof m.sender === 'object' && m.sender !== null) ? (m.sender as any).id : m.sender;
                    return {    
                        ...m,
                        is_me: senderId != null && this.currentUser?.id != null && Number(senderId) === Number(this.currentUser?.id)
                    };
                });
                setTimeout(() => {
                   this.cdRef.detectChanges();
                })
                this.scrollToBottom();
            },
            error: (err) => console.error(err)
        });
    }
    ngOnDestroy() {
        this.wsService.disconnect()
    }
}