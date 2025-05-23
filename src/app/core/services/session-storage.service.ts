import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

/** Serviço para gerenciar o armazenamento de dados do usuário na sessão. @class SessionStorageService */
export class SessionStorageService {
  /** Objeto com os dados armazenados na sessão */
  private key = 'sessionData';

  /**
   * Armazena dados na sessão.
   * @param data - Dados a serem armazenados na sessão
   */
  setData(data: Record<string, any>): void {
    sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  /**
   * Recupera dados armazenados na sessão.
   * @returns Objeto com os dados armazenados na sessão
   */
  getData(): Record<string, any> {
    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Remove um valor específico da sessão.
   * @param key - Chave do valor a ser removido
   */
  clearData<K extends keyof Record<string, any>>(key: K): void {
    const data = this.getData();
    delete data[key];
    this.setData(data);
  }

  /** Remove todos os dados armazenados na sessão. */
  clearAllData(): void {
    sessionStorage.removeItem(this.key);
  }
}
