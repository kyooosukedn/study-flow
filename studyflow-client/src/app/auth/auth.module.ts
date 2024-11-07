import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi())
  ],
})
export class AuthModule { }
