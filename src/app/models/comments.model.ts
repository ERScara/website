export interface Comments {
    id: number;
    username: string;
    message: string;
    total_likes: number;
    total_dislikes?: number;
    date: string;
    parent: number | null;
    disableBtn1?: boolean;
    disableBtn2?: boolean;
    is_deleted?: boolean;
    has_active_replies?: boolean;
}