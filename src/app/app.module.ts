import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers/fake-bakend';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PanelComponent } from './panel/panel.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { AlertComponent } from './_directives/alert/alert.component';

import { UserService } from './_services/user.service';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { BedService } from './_services/bed.service';

import { AuthGuard } from './_guards/auth.guard';
import { JwtInterceptor} from './_helpers/jwt.interceptor';
import { ErrorInterceptor} from './_helpers/error.interceptor';

import { AppRoutingModule } from './/app-routing.module';
import { ParametersComponent } from './parameters/parameters.component';
import { ParameterService } from './_services/parameter.service';
import { SocketService } from './_services/socket.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PanelComponent,
    CreateComponent,
    UpdateComponent,
    ViewComponent,
    AlertComponent,
    ParametersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    UserService, 
    AlertService, 
    AuthenticationService, 
    AuthGuard,
    BedService,
    ParameterService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
