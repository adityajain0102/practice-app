import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public profileData:any , private formBuilder: FormBuilder,
    ) {
      this.profileForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z])(\.([a-zA-Z]{2,4})){0,1}(\.[a-zA-Z]{2,4}))$/)]],
        gender: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log("profile data ", this.profileData);
    if(this.profileData) {
      this.profileForm.patchValue({
        email: this.profileData?.email,
        firstName: this.profileData?.firstName,
        lastName: this.profileData?.lastName,
        gender: this.profileData?.gender,
      });
    }
    }

  backToHome(): void {
    this.dialogRef.close();
  }
  updateUserProfile() {
    console.log("profiledata", this.profileForm.value);
    this.dialogRef.close(this.profileForm.value)

  }
}
