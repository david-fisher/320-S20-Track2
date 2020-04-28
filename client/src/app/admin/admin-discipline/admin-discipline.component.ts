import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-discipline',
  templateUrl: './admin-discipline.component.html',
  styleUrls: ['./admin-discipline.component.css']
})
export class AdminDisciplineComponent implements OnInit {
  reportedID;
  constructor(private activatedRoute: ActivatedRoute) {
    this.reportedID = this.activatedRoute.snapshot.params.filedAgainstID;
  }

  ngOnInit(): void {
  }

}
