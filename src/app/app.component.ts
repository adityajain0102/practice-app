import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'practice-app';
  display = false;
  example =true;
  constructor(){
    
    // setTimeout(() => {
    //    this.display = true;
    //     // this.example = false;
      
    //   }, 1000);
  console.log("coming here", this.title);
  }
}
