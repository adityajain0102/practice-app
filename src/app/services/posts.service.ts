import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor( private http: HttpClient) { }
  createPost(content: any, filedata: any): Observable<any> {
    console.log("createpost", content, filedata)
    return this.http.post(environment.postUrl + 'create?content=', content +"&" + "postPhoto=" + filedata, this.httpOptions).pipe(map((result: any) => {
        console.log('result', result);
        return result;
      }
    ));
  }

  commentPost(content: any, postId:any): Observable<any> {
    return this.http.post(`${environment.postUrl + postId}/comments/create?content=${content}` , {}, this.httpOptions).pipe(map((result: any) => {
      console.log('result', result);
      return result;
    }
  ));
  }
  getPost(postId:any): Observable<any> {
    return this.http.get(environment.postUrl + postId, this.httpOptions).pipe(map((result: any) => {
      console.log('result', result);
      return result;
    }
  ));
  }

  followUserApi(followerId:any): Observable<any> {
    
    return this.http.post(environment.followUrl , followerId, this.httpOptions ).pipe(map((followresponse: any) => {
      return followresponse;
    })
    )
  }

  UnfollowUserApi(followerId:any): Observable<any> {
    return this.http.post(environment.unfollowUrl , followerId, this.httpOptions ).pipe(map((followresponse: any) => {
      return followresponse;
    })
    )
  }

  getSearchUsers(string:any): Observable<any> {
    return this.http.get(environment.apiUrl + '/search?key=' + string + '&page=1&size=5', this.httpOptions).pipe(map((result: any) => {
      console.log('result', result);
      return result;
    }
  ));
  }
}
