import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas da instituição */
import { HeaderComponent } from '../../shared/header/header.component';
import { InstitutionHomeComponent } from '../../institution/home/home.component';
import { InstitutionManageSubjectsComponent } from '../../institution/manage-subjects/manage-subjects.component';
import { ApproveCandidateComponent } from '../../institution/approve-candidate/approve-candidate.component';
import { ManageRequestsComponent } from '../../institution/manage-requests/manage-requests.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: InstitutionHomeComponent },
      { path: 'manage-subjects', component: InstitutionManageSubjectsComponent },
      { path: 'manage-tutors', component: ApproveCandidateComponent },
      {
        path: 'subject/:id',
        loadChildren: () => import('./shared.module').then(m => m.SharedModule),
      },
      { path: 'manage-requests', component: ManageRequestsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule { }
