import { Injectable } from '@angular/core';
import {Auth, IdTokenResult, updateProfile, User } from '@angular/fire/auth';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private auth: Auth) { }

  /**
   * Atualiza o perfil do usuário autenticado com o novo nome.
   * @param name - Novo nome do usuário.
   */
  async updateDisplayName(name: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: name });
    }
  }

   getUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Obtém o ID do usuário autenticado.
   * @returns ID do usuário ou null se não estiver autenticado.
   */
  getUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }
  /**
   * Obtém o nome do usuário autenticado.
   * @returns Nome do usuário ou null se não estiver autenticado.
   */
  getUserName(): string | null {
    const user = this.auth.currentUser;
    return user ? user.displayName : null;
  }

  /**
   * Obtém o e-mail do usuário autenticado.
   * @returns E-mail do usuário ou null se não estiver autenticado.
   */
  getUserEmail(): string | null {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }

  /**
   * Obtém o papel do usuário autenticado.
   * @returns O papel do usuário autenticado ou 'ESTUDANTE' se não estiver definido.
   */
  getUserRole(): string {
    const user = this.auth.currentUser!;
    user.getIdTokenResult(true).then(idTokenResult => {
      return idTokenResult.claims['role'] as string;
    });
    return 'ESTUDANTE';
  }

}
