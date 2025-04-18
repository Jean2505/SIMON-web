import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas da instituição */
import { InstitutionHeaderComponent } from './header/header.component';
import { InstitutionHomeComponent } from './home/home.component';
import { InstitutionManageSubjectsComponent } from './manage-subjects/manage-subjects.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: InstitutionHomeComponent },
      { path: 'manage-subjects', component: InstitutionManageSubjectsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule { }
