import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { InstHomeComponent } from './institution/home/home.component';
import { InstHeaderComponent } from './institution/header/header.component';
import { InstManageComponent } from './institution/manage-subjects/manage-subjects.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: '', component: InstHeaderComponent,
    children: [
        { path: 'home', component: InstHomeComponent },
    ],
   },
  {
    path: '', component: InstHeaderComponent,
    children: [
      {path: 'manage', component: InstManageComponent}
    ],
  }, 
];
