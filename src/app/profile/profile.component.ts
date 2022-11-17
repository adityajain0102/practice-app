import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component'
import { PostsService } from '../services/posts.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  comment: any;
  url: any;
  format: any;
  subs: Subscription[] = [];
  posts: any[] = []
  content: any = ''
  fileElement: any;
  limit:number = 2;
  more:boolean = false;
  user:any;
  userprofiledata:any;
    // enable or disable visiblility of dropdown
    listHidden = true;
    showError = false;
    selectedIndex = -1;
    searchUser:any;
    // the list to be shown after filtering
    filteredList: any[] = [];
    searchUsers :any=[]; 

  constructor(
    private router: Router, 
    private profileService: LoginService, 
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private postService: PostsService, 
    ) {
      let userdata:any = localStorage.getItem('userdata');
      let user = JSON.parse(userdata)
      this.user = user;
      console.log("userdata", this.user);
    
      this.searchUsers = [
        {
            "user": {
                "id": 1,
                "email": "rupal.dabade@gmail.com",
                "firstName": "rupal",
                "lastName": "dabade",
                "intro": null,
                "gender": null,
                "hometown": null,
                "currentCity": null,
                "profilePhoto": null,
                "role": "user",
                "followerCount": 0,
                "followingCount": 1,
                "enabled": true,
                "accountVerified": false,
                "emailVerified": false,
                "birthDate": null,
                "joinDate": "2022-11-12 08:00:38",
                "credentialsNonExpired": true,
                "accountNonExpired": true,
                "username": "rupal.dabade@gmail.com",
                "authorities": null,
                "accountNonLocked": true
            },
            "followedByAuthUser": false
        },
        {
            "user": {
                "id": 1,
                "email": "rupal.dabade@gmail.com",
                "firstName": "user",
                "lastName": "one",
                "intro": null,
                "gender": null,
                "hometown": null,
                "currentCity": null,
                "profilePhoto": null,
                "role": "user",
                "followerCount": 0,
                "followingCount": 1,
                "enabled": true,
                "accountVerified": false,
                "emailVerified": false,
                "birthDate": null,
                "joinDate": "2022-11-12 08:00:38",
                "credentialsNonExpired": true,
                "accountNonExpired": true,
                "username": "rupal.dabade@gmail.com",
                "authorities": null,
                "accountNonLocked": true
            },
            "followedByAuthUser": true
        }
    ];
    let savesPosts = localStorage.getItem('posts')
    if (savesPosts) {
      let user_posts = JSON.parse(savesPosts)
      if(!this.user.id) {
        let userprofile:any = localStorage.getItem('userdata');
        this.user = JSON.parse(userprofile);
        console.log("userprofile from LC", this.user)
      }
      this.posts = user_posts.map((x: any) => {
        x['is_show_comments'] = false;
        x['is_liked'] = x.likes.includes(this.user.id) ? true : false
        return x;
      });
      console.log("this.posts", this.posts)
    }
   }

  ngOnInit(): void {
    if(this.user && this.user.email) {
      this.profileService.viewProfile(this.user.email).subscribe({
        next: (response)=> {
          console.log("response of user profile", response);
          this.userprofiledata = response;
        },
        error: (error)=> {
          console.log("error", error);
          this.userprofiledata = [{
            "id": 1,
            "email": "rupal@mail.com",
            "firstName": "rupal",
            "lastName": "dabade",
            "intro": null,
            "gender": null,
            "hometown": null,
            "currentCity": null,
            "profilePhoto": null,
            "role": "user",
            "followerCount": 0,
            "followingCount": 0,
            "enabled": true,
            "accountVerified": false,
            "emailVerified": false,
            "birthDate": null,
            "joinDate": "2022-11-10 08:11:31",
            "username": "rupal@mail.com",
            "accountNonLocked": true,
            "authorities": null,
            "credentialsNonExpired": true,
            "accountNonExpired": true
        }]
      }
      })
    } else if(!this.user) {
      let email = localStorage.getItem("email");
      this.profileService.viewProfile(email).subscribe({
        next: (response)=> {
          console.log("response of user profile", response);
          this.userprofiledata = response;
        },
        error: (error)=> {
          console.log("error", error);
          this.userprofiledata = [{
            "id": 1,
            "email": "rupal@mail.com",
            "firstName": "rupal",
            "lastName": "dabade",
            "intro": null,
            "gender": null,
            "hometown": null,
            "currentCity": null,
            "profilePhoto": null,
            "role": "user",
            "followerCount": 0,
            "followingCount": 0,
            "enabled": true,
            "accountVerified": false,
            "emailVerified": false,
            "birthDate": null,
            "joinDate": "2022-11-10 08:11:31",
            "username": "rupal@mail.com",
            "accountNonLocked": true,
            "authorities": null,
            "credentialsNonExpired": true,
            "accountNonExpired": true
        }]
      }
      })

    }
  }

  userProfile() {
    console.log("profile", this.user);
    this.router.navigate(['/profile']);
  }
  changePassword() {
    this.router.navigate(['/changepassword']);
  }

  logout() {
    localStorage.removeItem('auth-user');
    this.router.navigate(['/login']);
  }

  showEditProfile(profileData:any) {
    console.log("edit profile", profileData);
    const dialogRef = this.matDialog.open(ProfileDialogComponent, {
      role: 'dialog',
      height: '450px',
      width: '400px',
      data: profileData
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("profile data from dialog", result);
      if(result) {
        this.profileService.updateProfile(result).subscribe({
          next: (response) => {
            console.log(response);
            alert('Profile Updated Successfully');
          },
          error: (error) => {
            console.log("Error", error);
          }
        })
      }
    });
  }
  backToHomePage() {
    this.router.navigate(['/home']);
  }
  // search functionality

  // modifies the filtered list as per input
  getFilteredList() {
    console.log("this.listHidden", this.listHidden, this.searchUser)
    this.listHidden = false;
    if (!this.listHidden && (this.searchUser !== undefined && this.searchUser.length == 3 )) {
         // call the api to get the search users list
         this.postService.getSearchUsers(this.searchUser).subscribe({
          next: (users)=> {
            if(users) {
              this.searchUsers.push(users);
              this.filteredList = this.searchUsers.filter((user:any) => user.user.firstName.toLowerCase().startsWith(this.searchUser.toLowerCase()) || user.user.lastName.toLowerCase().startsWith(this.searchUser.toLowerCase()));
              console.log("fil..", this.filteredList);
            }
          }, 
          error: (error)=> {
            console.log("error search api", error);
      // testing code here before api integration. ()
      this.filteredList = this.searchUsers.filter((user:any) => user.user.firstName.toLowerCase().startsWith(this.searchUser.toLowerCase()) || user.user.lastName.toLowerCase().startsWith(this.searchUser.toLowerCase()));
      console.log("fil..", this.filteredList);
          }
        });

      
    }
  }

  // select highlighted item when enter is pressed or any item that is clicked
  viewUserProfile(ind:any) {
    console.log("selectitem",ind);
    this.listHidden = true;
    this.selectedIndex = ind;
    if(ind.email || ind.id) {
      this.router.navigate(['/profileview'],{ queryParams: {email: ind.email }})
    } else {
    this.router.navigate(['/profileview'],{ queryParams: {email: this.filteredList[ind].user.email }})
    }
  }

  // navigate through the list of items
  onKeyPress(event:any) {
    console.log("evnet")
    if (!this.listHidden) {
      if (event.key === 'Escape') {
        this.selectedIndex = -1;
        this.toggleListDisplay(0);
      }

      if (event.key === 'Enter') {

        this.toggleListDisplay(0);
      }
      if (event.key === 'ArrowDown') {

        this.listHidden = false;
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
        if (this.filteredList.length > 0 && !this.listHidden) {
          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      } else if (event.key === 'ArrowUp') {

        this.listHidden = false;
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this.filteredList.length;
        }
        this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;

        if (this.filteredList.length > 0 && !this.listHidden) {

          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      }
    } 
  }

  // show or hide the dropdown list when input is focused or moves out of focus
  toggleListDisplay(sender: number) {
    console.log("sender", sender);
    if (sender === 1) {
      this.listHidden = false;
      this.getFilteredList();
    } else {
      // helps to select item by clicking
      setTimeout(() => {
        this.viewUserProfile(this.selectedIndex);
        this.listHidden = true;
        console.log("inputITem", this.searchUser);
        if (!this.searchUsers.includes(this.searchUser)) {
          this.showError = true;
          this.filteredList = this.searchUsers;
        } else {
          this.showError = false;
        }
      }, 500);
    }
  }
}
