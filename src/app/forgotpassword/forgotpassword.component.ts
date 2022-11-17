import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from './password-validator'; 
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {  
  forgotPassword: FormGroup;
  formSubmitted: boolean = false;
  message:any=''
  user:any;
  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router){
    let userprofile:any = localStorage.getItem('userdata');
    this.user = JSON.parse(userprofile);
    console.log("userprofile forgotpassword", this.user)
    this.forgotPassword = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ]
    });
  }
    ngOnInit(): void {
    }
     userProfile() {
      console.log("profile", this.user);
      this.router.navigate(['/profile']);
    }
    changePassword() {
      console.log("chg pwd");
      this.router.navigate(['/forgotpassword']);
    }
    logout() {
      localStorage.removeItem('authUser');
      this.router.navigate(['/login']);
    }

    get formFields() {
      return this.forgotPassword.controls;
    }
    submit(){
      this.formSubmitted = true
      if(this.forgotPassword.valid){
        this.loginService.forgotPassword(this.forgotPassword.value).subscribe({
          next: (response)=> {
            this.message ='Reset Instructions send to given Email or Mobile';
            this.forgotPassword.reset({
              email:''
            })
           this.formSubmitted = false
          },
          error: (error)=>{
            console.log("error", error);
          }
        })
    }
}
}
