/**
 * Post model interface
 * @property {string} title - Título do post
 * @property {string} content - Conteúdo do post
 * @property {string} userName - Nome do usuário que criou o post
 * @property {string[]} files - Array de URLs de arquivos associados ao post
 * @property {string[]} images - Array de URLs de imagens associadas ao post
 * @property {string[]} videos - Array de URLs de vídeos associados ao post
 * @property {Date} createdAt - Timestamp do momento em que o post foi criado
 * @property {string} disciplineId - ID da disciplina à qual o post pertence
 */
export interface MuralPost {
    /** Título do post @type {string} */
    title: string,
    /** Conteúdo do post @type {string} */
    content: string,
    /** Nome do usuário que criou o post @type {string} */
    userName: string,
    /** Array de URLs de arquivos associados ao post @type {string[]} */
    files: string[],
    /** Array de URLs de imagens associadas ao post @type {string[]} */
    images: string[],
    /** Array de URLs de vídeos associados ao post @type {string[]} */
    videos: string[],
    /** Timestamp do momento em que o post foi criado @type {Date} */
    createdAt: Date,
    /** ID da disciplina à qual o post pertence @type {string} */
    disciplinaId: string
}