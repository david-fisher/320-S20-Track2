import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private http: HttpClient) {
  } // You can leave the constructor blank, http will be automatically "injected" for you

  test() { // Function which you can call to make a request
    this.http.get('http://t2-bucket-storage.s3-website.us-east-2.amazonaws.com/faq').subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit(): void {
  }

}
