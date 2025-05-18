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

  async getUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  /**
   * Obtém o ID do usuário autenticado.
   * @returns ID do usuário ou null se não estiver autenticado.
   */
  async getUserId(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }
  /**
   * Obtém o nome do usuário autenticado.
   * @returns Nome do usuário ou null se não estiver autenticado.
   */
  async getUserName(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.displayName : null;
  }

  async getUserRole(): Promise<string> {
    const user = this.auth.currentUser!;
    const idTokenResult = await user.getIdTokenResult(true);
    return idTokenResult.claims['role'] as string || 'ESTUDANTE';
  }

}
