import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../forgotpassword/password-validator'; 
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  user:any;
  changePasswordForm: FormGroup;
  submitted = false;
  isChangePassword:boolean = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router){
    let userprofile:any = localStorage.getItem('userdata');
    this.user = JSON.parse(userprofile);
    console.log("userprofile forgotpassword", this.user)
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: PasswordValidator("password", "confirmPassword")
    });
  }

  ngOnInit(): void {
  }
  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  updatePassword() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
        return;
    } else {
     console.log("forgotPasswordForm", this.changePasswordForm.value);

     this.loginService.changePassword(this.changePasswordForm.value).subscribe({
       next: (response) =>{
         console.log("response", response);
         this.router.navigate(['/login']); 
       },
       error:(error) => {
         console.log("error", error);
         this.router.navigate(['/login']); // for testing after api integration delete this line
       }
     })
    }
}
onReset() {
    this.submitted = false;
    this.changePasswordForm.reset();
    this.router.navigate(['/home'])
}

}
