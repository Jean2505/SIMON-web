/**
 * Interface da Disciplina
 * @property course: ID do curso ao qual a disciplina pertence
 * @property id: ID da disciplina
 * @optional monitors: Quantidade de monitores para a disciplina
 * @property name: Nome da disciplina
 * @property professor: Nome do professor responsável pela disciplina
 * @property school: Nome da escola a qual o curso pertence
 * @property term: Período da disciplina
 */
export interface Discipline {
    /**
     * ID do curso ao qual a disciplina pertence
     * @type {string}
     */
    course: string;
    /**
     * ID da disciplina
     * @type {string}
     */
    id: string;
    /**
     * Quantidade de monitores para a disciplina
     * @optional
     * @default 0
     * @type {Number}
     */
    monitors?: Number | 0;
    /**
     * Nome da disciplina
     * @type {string}
     */
    name: string;
    /**
     * Nome do professor responsável pela disciplina
     * @type {string}
     */
    professor: string;
    /**
     * Nome da escola a qual o curso pertence
     * @type {string}
     */
    school?: string;
    /**
     * Período da disciplina
     * @type {Number}
     */
    term: Number;
}