import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { FriendlistViewComponent } from './friendlist-view/friendlist-view.component';
const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'app', component: AppComponent },
    { path: 'profile', component: ProfileComponent},
    { path: 'forgotpassword', component: ForgotpasswordComponent},
    { path: 'changepassword', component: ChangepasswordComponent},
    { path: 'profileview', component: FriendlistViewComponent},
    { path: '', component: LoginComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
