/**
 * Post model interface
 * @property title: Título do post
 * @property content: Conteúdo do post
 * @property userName: Nome do usuário que criou o post
 * @property files: Array de URLs de arquivos associados ao post
 * @property images: Array de URLs de imagens associadas ao post
 * @property videos: Array de URLs de vídeos associados ao post
 * @property createdAt: Timestamp do momento em que o post foi criado
 * @property disciplineId: ID da disciplina à qual o post pertence
 */
export interface Post {
    /**
     * Título do post
     * @type {string}
     */
    title: string,
    /**
     * Conteúdo do post
     * @type {string}
     */
    content: string,
    /**
     * Nome do usuário que criou o post
     * @type {string}
     */
    userName: string,
    /**
     * Array de URLs de arquivos associados ao post
     * @type {string[]}
     */
    files: string[],
    /**
     * Array de URLs de imagens associadas ao post
     * @type {string[]}
     */
    images: string[],
    /**
     * Array de URLs de vídeos associados ao post
     * @type {string[]}
     */
    videos: string[],
    /**
     * Timestamp do momento em que o post foi criado
     * @type {Date}
     */
    createdAt: Date,
    /**
     * ID da disciplina à qual o post pertence
     * @type {string}
     */
    disciplinaId: string
}