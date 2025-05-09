// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return new Observable<boolean | UrlTree>(observer => {
      // Monitora estado de autenticação
      const unsubscribe = this.auth.onAuthStateChanged(async user => {
        if (!user) {
          // 1) não autenticado
          observer.next(this.router.parseUrl('/login'));
          observer.complete();
          return;
        }

        try {
          // 2) força refresh do token para pegar claims atualizados
          let tokenResult = await user.getIdTokenResult(true);
          let role = tokenResult.claims['role'] as string | undefined;

          // 3) se não tiver role no token, busca no Firestore e seta no backend
          if (!role) {
            role = 'ALUNO'; // valor padrão
            // const userRef = doc(this.firestore, `users/${user.uid}`);
            // const snap = await getDoc(userRef);
            // const fetchedRole = snap.exists() ? (snap.data() as any).role : null;

            // if (fetchedRole) {
            // chama seu endpoint para definir custom claim
            await this.http
              .post("localhost:3000/setUserRole", {
                uid: user.uid,
                role: role
              })
              .toPromise();

            // 4) atualiza o token para obter o claim recém-setado
            tokenResult = await user.getIdTokenResult(true);
            role = tokenResult.claims['role'] as string | undefined;
          }

          const expectedRoles = route.data['expectedRoles'] as string[];

          let flag = false;
          // 5) valida role
          for (let i = 0; i < expectedRoles.length; i++) {
            if (expectedRoles[i] == role) flag = true;
          }
          if (flag) observer.next(true);
          else observer.next(this.router.parseUrl('/login'));
        } catch (err) {
          console.error('Erro no RoleGuard:', err);
          observer.next(this.router.parseUrl('/login'));
        }
        observer.complete();
      });

      // retorna função de cleanup
      return unsubscribe;
    });
  }
}