import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-supporter-availability',
  templateUrl: './supporter-availability.component.html',
  styleUrls: ['./supporter-availability.component.css']
})

export class SupporterAvailabilityComponent implements OnInit {
  sunday: string;
  date: string;
  start: string;
  end: string;
  startAMPM: string;
  endAMPM: string;
  start24: string;
  end24: string;
  constructor() {
    const sundayList = [];
    // push all available times
    sundayList.push('Unavailable');
    this.sunday = sundayList.toString();
  }
  click(): void {
    if (this.timeValid()) {
      console.log(this.date);
      console.log(this.start24);
      console.log(this.end24);
    }
  }
  private timeValid(): boolean {
    if (this.date !== undefined && this.start !== undefined && this.end !== undefined && this.startAMPM !== undefined && this.endAMPM !== undefined) {
      if (!this.start.includes(".") && !this.start.includes(".")&&!isNaN(Number(this.start)) && !isNaN(Number(this.end))) {
        let s = Number(this.start);
        let e = Number(this.end);
        if(!(s > 0) && (s <= 12) && (e > 0) && (e <= 12))
        {
          return false;
        }
        if (this.startAMPM === 'PM') {
          s += 12;
        }
        if (this.endAMPM === 'PM') {
           e += 12;
        }
        this.start24 = s.toString();
        this.end24 = e.toString();
        return (e > s);
      }
    }
    return false;
  }
  ngOnInit(): void {
  }

}
