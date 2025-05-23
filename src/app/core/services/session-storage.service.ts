import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

/** Serviço para gerenciar o armazenamento de dados do usuário na sessão. @class SessionStorageService */
export class SessionStorageService {
  /** Objeto com os dados armazenados na sessão */
  private data: Record<string, any> = {};

  /**
   * Armazena dados na sessão.
   * @param data - Dados a serem armazenados na sessão
   */
  setData(data: any): void {
    Object.assign(this.data, data);
  }

  /**
   * Recupera dados armazenados na sessão.
   * @returns Objeto com os dados armazenados na sessão
   */
  getData(): {} {
    return this.data;
  }

  /**
   * Remove um valor específico da sessão.
   * @param key - Chave do valor a ser removido
   */
  clearData<K extends keyof Record<string, any>>(key: K): void {
    this.data[key] = '';
  }

  /** Remove todos os dados armazenados na sessão. */
  clearAllData(): void {
    this.data = {};
  }
}
