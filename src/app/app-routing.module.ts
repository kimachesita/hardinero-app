import { NgModule } from '@angular/core';

import {Routes, RouterModule} from '@angular/router';

import { PanelComponent } from './panel/panel.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ViewComponent } from './view/view.component';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { ParametersComponent } from './parameters/parameters.component';

import { AuthGuard } from './_guards/auth.guard';
 
const routes: Routes = [
  {path: '',component: PanelComponent, canActivate: [AuthGuard]},
  {path: 'view/:id',component: ViewComponent, canActivate: [AuthGuard]},
  {path: 'update/:id',component: UpdateComponent, canActivate: [AuthGuard]},
  {path: 'create',component: CreateComponent, canActivate: [AuthGuard]},
  {path: 'parameters',component: ParametersComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  //otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
