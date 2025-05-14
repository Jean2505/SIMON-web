export interface ForumPost {
    title: string;
    content: string;
    userId: string;
    userName: string;
    createdAt: Date;
    disciplineId: string;
    likes: number;
    comments: string[];
}