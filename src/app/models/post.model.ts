/**
 * Post model interface
 * @property postId - Unique identifier for the post
 * @property title - Title of the post
 * @property content - Content of the post
 * @property posterName - Name of the person who posted it
 * @property files - Array of files associated with the post
 * @property images - Array of image URLs associated with the post
 * @property videos - Array of video URLs associated with the post
 * @property createdAt - Timestamp of when the post was created
 * @property disciplineId - ID of the discipline associated with the post
 */
export interface Post {
    title: string,
    content: string,
    userName: string,
    files: {},
    images: [],
    videos: [],
    createdAt: Date,
    disciplinaId: string
}