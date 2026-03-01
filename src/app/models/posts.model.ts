export interface Post {
    id: number;
    community: number;
    title: string;
    content: string;
    prompt: string;
    target_model: string;
    author_username: string;
    total_likes: number;
    total_dislikes: number;
    user_vote: 'like' | 'dislike' | null
    has_roported: boolean;
    is_reported_by_anyone: boolean;
    comment_count: number;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}