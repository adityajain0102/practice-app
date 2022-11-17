import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../services/token-storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  loginForm: FormGroup;
  formSubmitted:boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private tokenStorage: TokenStorageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
   }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  authUser(user: any, list: any) {
    return list.find((x: any) => x.email === user.email && x.password === user.password)
  }

  login(): void {
    this.formSubmitted = true
    if (this.loginForm.valid) {
      localStorage.setItem('email',this.loginForm.value.email); // for testing purpose once api integrated, delete it
      this.router.navigate(['/home']); 
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.tokenStorage.saveToken(response.accessToken);
          this.tokenStorage.saveUser(response);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
           localStorage.setItem('email',response.email)
           this.router.navigate(['/home']); 
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }
  }


  openRegister(): void {
    const dialogRef = this.matDialog.open(RegisterComponent, {
      role: 'dialog',
      height: '480px',
      width: '480px'
    });

    dialogRef.afterClosed().subscribe((result: { firstName: any; lastName: any; email: any; password: any; id: any, gender: string } | undefined) => {

      if (result !== undefined) {
        this.loginService.signup(result).subscribe({
          next: (response) => {
            console.log("registration response", response);
            alert('user registered successfully')
            
          },
          error: (error) => {
            console.log("error message signup", error.message)
          }
        })

        // for local purpose Im keeping these lines of code from 86 
        
      }
      return;
    });
  }

  get formFields() {
    return this.loginForm.controls;
  }
}
