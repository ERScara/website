export interface ChatUser {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    is_superuser?: boolean;
}
export interface Message {
    id: number;
    text: string;
    sender: number;
    created_at: string | Date;
    is_me: boolean;
    is_read: boolean;
}
export interface Conversation {
    id: number;
    participants: ChatUser[];
    last_message?: string;
    updated_at: string | Date;
    unread_count?: number;
}

export interface UserSearchResult {
    id: number;
    username: string;
}