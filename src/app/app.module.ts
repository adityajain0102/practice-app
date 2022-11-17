import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { FilterPipe } from './pipes/filter.pipe';
import { LoginService } from './services/login.service';

import { HttpClientModule } from '@angular/common/http';
import { PostsService } from './services/posts.service';
import { ProfileComponent } from './profile/profile.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { FriendlistViewComponent } from './friendlist-view/friendlist-view.component';
const modules = [
  MatBadgeModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatListModule,
  ReactiveFormsModule,
  FormsModule,
  MatRadioModule,
  
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FilterPipe,
    ProfileComponent,
    ForgotpasswordComponent,
    ChangepasswordComponent,
    ProfileDialogComponent,
    FriendlistViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ...modules,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [LoginService, PostsService,authInterceptorProviders],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule { }
