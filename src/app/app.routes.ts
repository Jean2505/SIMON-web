// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './shared/login/login.component';
import { ErrorComponent } from './shared/error/error.component';

export const routes: Routes = [

  // Rota para usuários Aluno
  {
    path: 'student',
    loadChildren: () => import('./core/routing/student.module').then(m => m.StudentModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['ALUNO', 'MONITOR'] }
  },

  // Rota para usuários Professor
  {
    path: 'professor',
    loadChildren: () => import('./core/routing/professor.module').then(m => m.ProfessorModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['PROFESSOR'] }
  },

  // Rota para usuários Instituição
  {
    path: 'institution',
    loadChildren: () => import('./core/routing/institution.module').then(m => m.InstitutionModule),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['INSTITUICAO'] }
  },

  // { path: 'perfil-monitor', component: TutorProfileComponent },

  // Rota de Login: qualquer pessoa pode acessar
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Redireciona para o login caso a rota digitada não exista
  { path: '**', redirectTo: '404' },
  { path: '404', component: ErrorComponent }, // Componente de erro 404
];
