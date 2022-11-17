import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';


import { Router } from '@angular/router';
import {PostsService} from '../services/posts.service';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Params } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  comment: any;
  url: any;
  format: any;
  user: any= [{
    "id": 1,
    "email": "rupal@mail.com",
    "firstName": "rupal",
    "lastName": "dabade",
    "intro": null,
    "gender": "female",
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
}];
  content: any = ''
  fileElement: any;
  limit:number = 2;
  more:boolean = false;
  searchUsers :any=[]; 
  // enable or disable visiblility of dropdown
  listHidden = true;
  showError = false;
  selectedIndex = -1;
  searchUser:any;
  // the list to be shown after filtering
  filteredList: any[] = [];
  constructor(private router: Router, private postService: PostsService, private profileService: LoginService, private route: ActivatedRoute ) {
  

    if(this.route.snapshot.queryParamMap.get('id')) {
      let userId = this.route.snapshot.queryParamMap.get('id')
      this.getfollowers(userId);
      this.getfollowingUsers(userId);
      }

    let userdata:any = localStorage.getItem('userdata');
    if(userdata) this.user = JSON.parse(userdata);
     console.log("this.user", this.user);
     let authEmail:any = localStorage.getItem('email');
     console.log("authEmail", authEmail)
     let userEmail =authEmail;
     this.profileService.viewProfile(userEmail).subscribe({
       next: (profiledata)=> {
         if(profiledata) {
           this.user = profiledata.data;
         } else {
          let userprofile:any = localStorage.getItem('userdata');
          this.user = JSON.parse(userprofile);
          console.log("userprofile from LC", this.user)
         }
       },
       error: (error) => {
         console.log("error", error);
         // delete after api integration
         let userprofile:any = localStorage.getItem('userdata');
          this.user = JSON.parse(userprofile);
          console.log("userprofile from LC", this.user);
       }
     });
  }

  ngOnInit(): void {
  }

  userProfile() {
    console.log("profile", this.user);
    this.router.navigate(['/profile']);
  }

  changePassword() {
    this.router.navigate(['/changepassword']);
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
             this.searchUsers=[
              {
                  "user": {
                      "id": 1,
                      "email": "user.one@gmail.com",
                      "firstName": "user",
                      "lastName": "one",
                      "intro": null,
                      "gender": "male",
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
                      "firstName": "rupal",
                      "lastName": "dabade",
                      "intro": null,
                      "gender": "female",
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
          ]
          
            this.filteredList = this.searchUsers.filter((user:any) => user.user.firstName.toLowerCase().startsWith(this.searchUser.toLowerCase()) || user.user.lastName.toLowerCase().startsWith(this.searchUser.toLowerCase()));
            console.log("fil..", this.filteredList);
          }
        });
       
      
    }
  }

  logout(): void {
    localStorage.removeItem('authUser')
    this.router.navigate(['/login'])
  }

   // select highlighted item when enter is pressed or any item that is clicked
   viewUserProfile(ind:any) {
    console.log("selectitem", ind);
    this.listHidden = true;
    this.selectedIndex = ind;
    if(ind.email) {
      this.router.navigate(['/profileview'],{ queryParams: {email: ind?.email }})
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

  listofFollowers:any = [];
  getfollowers(id:any) {
    this.postService.getFollowers(id).subscribe({
      next: (followers:any)=> {
        this.listofFollowers = this.listofFollowers.push(followers);
        this.listofFollowers = [...new Map(this.listofFollowers.map((v: { id: any; }) => [v.id, v])).values()]
      },
      error: (error:any)=> {
        console.log("error", error);
        this.listofFollowers = [
          {
              "id": 2,
              "email": "rupal.dabade15@gmail.com",
              "firstName": "user one",
              "lastName": "dabade",
              "intro": null,
              "gender": "female",
              "hometown": null,
              "currentCity": null,
              "profilePhoto": null,
              "role": "user",
              "followerCount": 2,
              "followingCount": 0,
              "enabled": true,
              "accountVerified": false,
              "emailVerified": false,
              "birthDate": null,
              "joinDate": "2022-11-12 08:07:35",
              "credentialsNonExpired": true,
              "accountNonExpired": true,
              "username": "rupal.dabade15@gmail.com",
              "authorities": null,
              "accountNonLocked": true
          },
          {
            "id": 1,
            "email": "rupal.dabade15@gmail.com",
            "firstName": "usertwo",
            "lastName": "dabade",
            "intro": null,
            "gender": "female",
            "hometown": null,
            "currentCity": null,
            "profilePhoto": null,
            "role": "user",
            "followerCount": 2,
            "followingCount": 0,
            "enabled": true,
            "accountVerified": false,
            "emailVerified": false,
            "birthDate": null,
            "joinDate": "2022-11-12 08:07:35",
            "credentialsNonExpired": true,
            "accountNonExpired": true,
            "username": "rupal.dabade15@gmail.com",
            "authorities": null,
            "accountNonLocked": true
        }
      ]
      
      }
    })
  }
  myfriends:any = [];
  getfollowingUsers(id:any) {
    this.postService.getFollowingUsers(id).subscribe({
      next: (followingUsers:any)=> {
        this.myfriends = this.myfriends.push(followingUsers);
        this.myfriends = [...new Map(this.myfriends.map((v: { id: any; }) => [v.id, v])).values()]     
       },
       error: (error) =>{
        console.log("error followingusers", error);
        this.myfriends = [
          {
            "id": 5,
            "email": "rupal.dabade15@gmail.com",
            "firstName": "Apurva",
            "lastName": "dabade",
            "intro": null,
            "gender": "female",
            "hometown": null,
            "currentCity": null,
            "profilePhoto": null,
            "role": "user",
            "followerCount": 2,
            "followingCount": 0,
            "enabled": true,
            "accountVerified": false,
            "emailVerified": false,
            "birthDate": null,
            "joinDate": "2022-11-12 08:07:35",
            "credentialsNonExpired": true,
            "accountNonExpired": true,
            "username": "rupal.dabade15@gmail.com",
            "authorities": null,
            "accountNonLocked": true
        },
          {
              "id": 8,
              "email": "rupal.dabade15@gmail.com",
              "firstName": "rupal",
              "lastName": "dabade",
              "intro": null,
              "gender": "female",
              "hometown": null,
              "currentCity": null,
              "profilePhoto": null,
              "role": "user",
              "followerCount": 2,
              "followingCount": 0,
              "enabled": true,
              "accountVerified": false,
              "emailVerified": false,
              "birthDate": null,
              "joinDate": "2022-11-12 08:07:35",
              "credentialsNonExpired": true,
              "accountNonExpired": true,
              "username": "rupal.dabade15@gmail.com",
              "authorities": null,
              "accountNonLocked": true
          }
      ]
    }    
  })
  }

  unFollowUser(id:any, flag:string) {
    console.log("unfolloweruser data", id);
   if(flag === "remove") {
    this.postService.UnfollowUserApi(id).subscribe({
      next: (response)=> {
        console.log("response 200", response);
        // remove particular id from the list of followers
        this.listofFollowers =  this.listofFollowers.filter((follower:any) => follower.id !== id);
      },
      error: (error)=> {
        console.log("error unfollow user", error, id);
           // remove particular id from the list of followers for testing purpose
           this.listofFollowers =  this.listofFollowers.filter((follower:any) => follower.id !== id);
      }
    })
   } else if(flag === "unfriend") {
    this.postService.UnfollowUserApi(id).subscribe({
      next: (response)=> {
        console.log("response 200", response);
        // remove particular id from the list of followers
        this.myfriends =  this.myfriends.filter((follower:any) => follower.id !== id);
      },
      error: (error)=> {
        console.log("error unfollow user", error, id);
           // remove particular id from the list of followers for testing purpose
           this.myfriends =  this.myfriends.filter((follower:any) => follower.id !== id);
           console.log("list of myfriends", this.myfriends)
      }
    })
   }
  }
  AddFriend(id:any) {
    console.log("add friend", id);
    this.postService.followUserApi(id).subscribe({
      next: (response)=> {
        console.log("add friend response", response);
        let followerData = this.listofFollowers.find((follower:any)=> follower.id === id)
       this.myfriends.unshift(followerData);
      },
      error: (error)=> {
        console.log(error);
        let followerData = this.listofFollowers.find((follower:any)=> follower.id === id)
        console.log("followerData", followerData, this.myfriends)
        if(this.myfriends ) {
          let index = this.myfriends.length
          this.myfriends.unshift(followerData);
          console.log("listincrease", this.myfriends)

        }
      }
    })
  }
}
