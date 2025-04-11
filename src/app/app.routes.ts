import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InstHomeComponent } from './inst-home/inst-home.component';
import { InstHeaderComponent } from './inst-header/inst-header.component';
import { InstManageComponent } from './inst-manage/inst-manage.component';

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
