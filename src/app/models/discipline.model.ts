/**
 * Interface da Disciplina
 * @property id: ID da disciplina
 * @property course: ID do curso ao qual a disciplina pertence
 * @property name: Nome da disciplina
 * @property professor: Nome do professor responsável pela disciplina
 * @property term: Período da disciplina
 * @optional monitorAmnt: Quantidade de monitores para a disciplina
 */
export interface Discipline {
    /**
     * ID da disciplina
     * @type {string}
     */
    id: string;
    /**
     * ID do curso ao qual a disciplina pertence
     * @type {string}
     */
    course: string;
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
     * Período da disciplina
     * @type {Number}
     */
    term: Number;
    /**
     * Quantidade de monitores para a disciplina
     * @optional
     * @default 0
     * @type {Number}
     */
    monitorAmnt?: Number | 0;
}