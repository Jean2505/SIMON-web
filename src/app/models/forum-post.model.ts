/**
 * ForumPost model
 * @description Interface que representa um post no fórum.
 * @property {string[]} comments - Array de comentários associados ao post
 * @property {string} content - Conteúdo do post
 * @property {string} courseId - ID da disciplina à qual o post pertence
 * @property {Date} createdAt - Timestamp do momento em que o post foi criado
 * @property {string} docId - ID do post
 * @property {Number} likes - Número de curtidas no post
 * @property {string} title - Título do post
 * @property {string} userId - ID do usuário que criou o post
 * @property {string} userName - Nome do usuário que criou o post
 */
export interface ForumPost {
    /**
     * Array de IDs de comentários associados ao post
     * @description O array de IDs dos comentários associados ao post.
     * @type {string[]}
     * @example ["Ótima pergunta!", "A herança em Java é um conceito fundamental."]
     */
    comments: string[];
    /**
     * Conteúdo do post
     * @description O conteúdo do post no fórum.
     * @type {string}
     * @example "Alguém pode explicar como funciona a herança em Java?"
     */
    content: string;
    /**
     * ID da disciplina à qual o post pertence
     * @description O ID da disciplina à qual o post pertence.
     * @type {string}
     * @example "1234567890"
     */
    courseId: string;
    /**
     * Timestamp do momento em que o post foi criado
     * @description O timestamp do momento em que o post foi criado.
     * @type {Date}
     * @example "2023-10-01T12:00:00Z"
     */
    createdAt?: Date;
    /**
     * ID do post
     * @description O ID do post.
     * @optional
     * @type {string}
     * @example "lkpHQhmfqeufb1ozMMtx"
     */
    docId?: string;
    /**
     * Número de curtidas no post
     * @description O número de curtidas no post.
     * @type {number}
     * @example 10
     */
    likes: number;
    /**
     * Título do post
     * @description O título do post no fórum.
     * @type {string}
     * @example "Como funciona a herança em Java?"
     */
    title: string;
    /**
     * ID do usuário que criou o post
     * @description O ID do usuário que criou o post.
     * @type {string}
     * @example "1234567890"
     */
    userId: string;
    /**
     * Nome do usuário que criou o post
     * @description O nome do usuário que criou o post.
     * @type {string}
     * @example "João Silva"
     */
    userName: string;
}

/**
 * PostComment model
 * @description Interface que representa um comentário em um post do fórum.
 * @property {string} content - Conteúdo do comentário
 * @property {Date} createdAt - Data de criação do comentário
 * @property {string} userId - ID do usuário que fez o comentário
 * @property {string} userName - Nome do usuário que fez o comentário
 * @property {string} userRole - Papel do usuário que fez o comentário
 */
export interface PostComment {
    /** Conteúdo do comentário @type {string} */
    content: string;
    /** Data de criação do comentário @type {Date} */
    createdAt: Date;
    /** ID do post ao qual o comentário pertence @type {string} */
    postId: string;
    /** ID do usuário que fez o comentário @type {string} */
    userId: string;
    /** Nome do usuário que fez o comentário @type {string} */
    userName: string;
    /** Papel do usuário que fez o comentário @type {string} */
    userRole: string;
}