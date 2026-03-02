export interface Community {
    id: number;
    name: string;
    description: string;
    category: 'advanced' | 'design' | 'common' | 'modelos';
    total_members: number;
    creator_username: string;
    owner: number;
    created_at: string;
    status: 'pending' | 'approved' | 'rejected' | 'relocated';
    reviewed_by: number | null;
    reviewed_at: string | null;
    is_member: boolean;
    user_role: 'owner' | 'moderator' | 'member' | null;
    relocation_reason: string | null;
}

export interface Membership {
    id: number;
    username: string;
    role: 'owner'|'moderator'|'member';
    joined_at: string;
}
