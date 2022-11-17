import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
   TOKEN_KEY = 'auth-token';
   USER_KEY = 'auth-user';
   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor( private http: HttpClient) { }
    login(data: any): Observable<any> {
      console.log("logindata", data)
      return this.http.post(environment.apiUrl + '/login', data, this.httpOptions).pipe(map((result: any) => {
          console.log('result', result);

          // for sample api response, later delete it once it is integrated
          if(!result) {
          result = [{
            "email": "rupal@mail.com",
            "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxLHJ1cGFsQG1haWwuY29tIiwiaXNzIjoiQ29kZUphdmEiLCJpYXQiOjE2NjgwNjgwNzEsImV4cCI6MTY2ODE1NDQ3MX0.XfWXruMOFXQVWP2BYkPb6xtKhl6wxiyoIfOeO69p4IZ2giTx8IdwyEtW_hEozgYJXyhDXWq7v0ARBCWVWFP_rQ"
        } ]
      }
          return result;
        }
      ));
    }

    signup(data:any):Observable<any> {
      console.log("signupdata", data);
      localStorage.setItem("userdata", JSON.stringify({
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
    }));

      return this.http.post(environment.apiUrl + '/signup', data, this.httpOptions).pipe(map((result: any) => {
          console.log('result', result);
          // for sample Im keeping here
          localStorage.setItem("userdata", JSON.stringify(result));
          return result;
        }
      ));
    }
  
    forgotPassword(email: any): Observable<any> {
      console.log("forgotpassword", email)
      return this.http.post(environment.apiUrl + '/forgot-password?email=', email).pipe(map((result: any) => {
          console.log('result', result);
          // for sample api response, later delete it once it is integrated
          result = [{
            "status": "200",
            "message" : "Password Changed Successfully",
            "data": []
        } ]
          return result;
        }
      ));
    }

    changePassword(passwordData:any): Observable<any> {
      console.log("change password", passwordData);
      let authUser:any = localStorage.getItem(this.USER_KEY);
      authUser = JSON.parse(authUser);
      let accessToken=  authUser.accessToken;
      passwordData.token = accessToken;
      return this.http.post(environment.apiUrl + '/reset-password' , passwordData, this.httpOptions).pipe(map((result: any) => {
          console.log('result', result);
          // for sample api response, later delete it once it is integrated
          result = [{
            "status": "200",
            "message" : "Password Changed Successfully",
            "data": []
        }]
          return result;
        }
      ));
    }

    viewProfile(email: any): Observable<any> {
      console.log("get profile", email)
      return this.http.get(environment.apiUrl + '/viewUser', email).pipe(map((result: any) => {
          console.log('result', result);
          localStorage.setItem('userdata', result);
          return result;
        }
      ));
    }

    
    updateProfile(profiledata:any): Observable<any> {
      console.log("update profile", profiledata);
      let accessToken = localStorage.getItem(this.TOKEN_KEY);
      return this.http.post(environment.apiUrl + '/updateInfo/' + accessToken, profiledata, this.httpOptions).pipe(map((response: any) => {
          console.log('response', response);
          return response;
        }
      ));
    }

}
