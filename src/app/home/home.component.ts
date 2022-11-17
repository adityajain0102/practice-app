import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {PostsService} from '../services/posts.service';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  comment: any;
  url: any;
  format: any;
  subs: Subscription[] = [];
  posts: any[] = []
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
  constructor(private router: Router, private postService: PostsService, private profileService: LoginService) {
 
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
          let userprofile:any = localStorage.getItem('userdata');
           this.user = JSON.parse(userprofile);
           console.log("userprofile from LC", this.user);
        }
      });

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
      console.log(this.posts);
    }
  }

  async ngOnInit(): Promise<void> {
    this.posts = this.posts;
    this.user = this.user;
  }
  uploadfileData:any
  onSelectFile(event: any) {
    var file = event.target.files && event.target.files[0];
    console.log("file", file);
    this.uploadfileData = file;
    file.value = {}
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;

        file.value['url'] = this.url;
        file.value.type = this.format;
        this.fileElement = file
      }
    }
  }

  addComment(post: any, comment: string) {
    console.log(comment);
    if (comment) {
      this.postService.commentPost(comment, post.id).subscribe({
        next : (response) => {
          let index = this.posts.findIndex(x => x.id === post.id)
          if (index != -1) {
            this.posts[index].comments.unshift(
              {
                user_id: response.data.author.id,
                user_name: `${response.data.author.firstName} ${response.data.author.lastName}`,
                comment: response.data.content,
                postid: post.id,
                title: `${response.data.author.firstName} ${response.data.author.lastName}`,
                time: {
                  seconds: 10
                },
                dateCreated:response.data.dateCreated
              }
            )
            post.comment = ''
            localStorage.setItem('posts', JSON.stringify(this.posts))
          }
        }
      })
      let index = this.posts.findIndex(x => x.id === post.id)
      console.log(index)
      if (index != -1) {
        this.posts[index].comments.unshift(
          {
            user_id: this.user.id,
            user_name: `${this.user.firstName} ${this.user.lastName}`,
            comment: comment,
            postid: post.id,
            title: `${this.user.firstName} ${this.user.lastName}`,
            time: {
              seconds: 10
            }
          }
        )
        post.comment = ''
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    }
  }

  likeOrDelike(post: any) {
    let index = this.posts.findIndex(x => x.id === post.id)
    console.log(this.posts[index]);
    if(!this.posts[index].likes.includes(this.user.id)){
      this.posts[index]['likes'].push(this.user.id)
      this.posts[index]['is_liked'] = true
    }else{
      console.log("else", this.posts[index].likes.includes(this.user.id));
      let like_index = this.posts[index]['likes'].findIndex((x:any) => x === this.user.id)
        if(like_index!=-1){
          this.posts[index]['likes'].splice(like_index,1)
          this.posts[index]['is_liked'] = false
        }
    }
    this.posts = this.posts;
    localStorage.setItem('posts', JSON.stringify(this.posts))
  }

  logout(): void {
    localStorage.removeItem('authUser')
    this.router.navigate(['/login'])
  }


  createPost() {
    if (this.content || this.fileElement) {
    this.uploadfileData = " ";
      this.postService.createPost(this.content, this.fileElement).subscribe(
        {
          next: (response:any) => {
            let obj = {
              email: response.data.author.email,
              user_id: response.data.author.id,
              user_name: `${response.data.author.firstName} ${response.data.author.lastName}`,
              id: new Date().getTime(),
              title: "NEW POST",
              content: response.data.content || '',
              time: {
                seconds: 55
              },
              dateCreated: response.data.dateCreated,
              avatar: "../../assets/avatar.png",
              media: {
                url: this.fileElement ? this.fileElement.value.url : '',
                type: this.fileElement ? this.fileElement.value.type : ''
              },
              comments: [
              ],
              likes: []
            }
            this.posts.unshift(obj)
            this.content = ''
            this.fileElement = ''
            this.uploadfileData.name = ''
            let savesPosts = localStorage.getItem('posts')
            if (savesPosts) {
              let user_posts = JSON.parse(savesPosts)
              user_posts.push(obj)
              localStorage.setItem('posts', JSON.stringify(user_posts))
            } else {
              let post = [obj]
              localStorage.setItem('posts', JSON.stringify(post))
            }
          }, error: (error:any) => {
            console.log(error);
            // for working logic. after api integration delete this below code 
      let obj = {
        email:  localStorage.getItem("email"),
        user_id: this.user ? this.user.id : 1,
        user_name: this.user ? `${this.user?.firstName} ${this.user?.lastName}` : "no username",
        id: new Date().getTime(),
        title: "NEW POST",
        content: this.content || '',
        time: {
          seconds: 55
        },
        avatar: "../../assets/avatar.png",
        media: {
          url: this.fileElement ? this.fileElement.value.url : '',
          type: this.fileElement ? this.fileElement.value.type : ''
        },
        comments: [
        ],
        likes: []
      }
      this.posts.unshift(obj)
      this.content = ''
      this.fileElement = ''

      let savesPosts = localStorage.getItem('posts')
      if (savesPosts) {
        let user_posts = JSON.parse(savesPosts)
        user_posts.push(obj)
        localStorage.setItem('posts', JSON.stringify(user_posts))
      } else {
        let post = [obj]
        localStorage.setItem('posts', JSON.stringify(post))
      }
      // upto here
          }
        }
      )
    
    } else if(!this.content && !this.fileElement) {
      alert('Please Add comment or Post')
    }
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
            this.filteredList = this.searchUsers.filter((user:any) => user.user.firstName.toLowerCase().startsWith(this.searchUser.toLowerCase()) || user.user.lastName.toLowerCase().startsWith(this.searchUser.toLowerCase()));
            console.log("fil..", this.filteredList);
          }
        });
       
      
    }
  }

  // select highlighted item when enter is pressed or any item that is clicked
  viewUserProfile(ind:any) {
    console.log("selectitem", ind);
    this.listHidden = true;
    this.selectedIndex = ind;
    if(ind.email || ind.id) {
      this.router.navigate(['/profileview'],{ queryParams: {email: ind?.email }})
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

