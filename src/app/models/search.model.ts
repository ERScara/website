import { Post } from "./posts.model";
import { Community } from "./community.model";

export interface SearchResult {
    posts: Post[];
    communities: Community[];
    users:{
           id: number; 
           username: string;
          }
}