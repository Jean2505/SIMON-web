import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const auth = getAuth();

    return new Observable<boolean>(observer => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (!user) {
          // Usuário não autenticado: redireciona para login
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        } else {
          // Força a atualização do token para pegar custom claims
          user.getIdTokenResult(true)
            .then(idTokenResult => {
              const role = idTokenResult.claims['role'] || '';
              const expectedRole = route.data['expectedRole'];
              if (role === expectedRole) {
                observer.next(true);
              } else {
                // Role não confere: redireciona para login
                this.router.navigate(['/login']);
                observer.next(false);
              }
              observer.complete();
            })
            .catch(err => {
              console.error('Erro ao ler custom claims:', err);
              this.router.navigate(['/login']);
              observer.next(false);
              observer.complete();
            });
        }
      });

      // Retorna a função de cleanup
      return unsubscribe;
    });
  }
}
