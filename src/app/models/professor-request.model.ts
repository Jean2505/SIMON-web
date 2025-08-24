/**
 * Interface da Requisição
 * @property {string} course - ID do curso ao qual a disciplina pertence
 * @property {string} id - ID da disciplina
 * @property {string} [monitors] - Quantidade de vagas para monitoria para a disciplina (opcional)
 * @property {string} [currentMonitors] - Quantidade de monitores para a disciplina (opcional)
 * @property {string} requestQuantity - Valor da requisição
 * @property {string} name - Nome da disciplina
 * @property {string} professor - Nome do professor responsável pela disciplina
 * @property {string} status - Status da requisição
 */

export interface ProfessorRequest {
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
     * Quantidade de vagas de monitoria para a disciplina
     * @optional
     * @default 0
     * @type {Number}
     */
    monitors?: Number | 0;
    /**
     * Quantidade de monitores para a disciplina
     * @optional
     * @default 0
     * @type {Number}
     */
    currentMonitors?: Number | 0;
    /**
     * Nome da disciplina
     * @type {Number}
     */
    requestQuantity: Number;
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
     * Status da requisição (0 para negada, 1 para aprovada, 2 para 'em análise')
     * @type {Number}
     */
    status: Number;
}