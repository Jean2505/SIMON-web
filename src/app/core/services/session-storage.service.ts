import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

/** Serviço para gerenciar o armazenamento de dados do usuário na sessão. @class SessionStorageService */
export class SessionStorageService {
  /**
   * Armazena dados na sessão.
   * @param key - Chave para identificar os dados na sessão
   * @param data - Dados a serem armazenados na sessão
   */
  setData(key: string, data: Record<string, any>): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Recupera dados armazenados na sessão.
   * @param key - Chave do valor a ser recuperado
   * @param data - Nome do campo específico a ser recuperado
   * @returns Objeto com os dados armazenados na sessão
   */
  getData(key: string, data: string): any {
    const item = sessionStorage.getItem(key);
    if (item) {
      try {
        const parsedItem = JSON.parse(item);
        return parsedItem[data];
      } catch (error) {
        console.error('Erro ao analisar o item do sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Recupera todos os dados armazenados na sessão.
   * @param key - Chave do valor a ser recuperado
   * @returns Objeto com todos os dados armazenados na sessão
   */
  getAllDataFromKey(key: string): any {
    const item = sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  /**
   * Recupera todos os dados armazenados na sessão.
   * @returns Objeto com todos os dados armazenados na sessão
   */
  getAllData(): Record<string, any> {
    const allData: Record<string, any> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const item = sessionStorage.getItem(key);
        if (item) {
          try {
            allData[key] = JSON.parse(item);
          } catch (error) {
            console.error(
              `Erro ao analisar o item ${key} do sessionStorage:`,
              error
            );
          }
        }
      }
    }
    return allData;
  }

  /**
   * Remove um valor específico da sessão.
   * @param key - Chave do valor a ser removido
   */
  clearData(key: string): void {
    const data = this.getAllDataFromKey(key);
    delete data[key];
    this.setData(key, data);
  }

  /** Remove todos os dados armazenados na sessão. */
  clearAllData(): void {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key) {
        sessionStorage.removeItem(key);
      }
    }
  }
}
