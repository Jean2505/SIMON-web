import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas da instituição */
import { InstitutionHomeComponent } from './home/home.component';
import { InstitutionManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ApproveCandidateComponent } from './approve-candidate/approve-candidate.component';
import { HeaderComponent } from '../shared/header/header.component';

const routes: Routes = [
  {
    path: '',
    component:HeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: InstitutionHomeComponent },
      { path: 'manage-subjects', component: InstitutionManageSubjectsComponent },
      { path: 'manage-tutors', component: ApproveCandidateComponent },
      {
        path: 'subject/:id',
        loadChildren: () => import('../shared/shared.module').then(m => m.SharedModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule { }
