import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  qs;
  constructor(private http: HttpClient) {
  } // You can leave the constructor blank, http will be automatically "injected" for you

  get questions(): Array<Map<string, string>> {
    /*
    Get questions from /faq and return them
     */
    let array_qs = [];
    console.log(this.qs);
    for (const key in this.qs) {
      console.log(key);
      array_qs.push(this.qs[key]);
    }
    console.log(array_qs);
    return array_qs;
  }

  ngOnInit(): void {
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/faq').subscribe(res => {
      console.log(res);
      this.qs = res;
    });
  }

}
