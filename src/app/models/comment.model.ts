export interface Comment {
    userId: string;
    userName: string;
    userRole: string;
    content: string;
    likes: number;
    createdAt: Date;
}