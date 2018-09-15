import { ServerResponse } from './../../models/login-response.model';
import { SchoolService } from './../../services/school.service';
import { School } from './../../models/school.model';
import { Component, OnInit, HostListener } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  schools: School[] = [];
  headerData: any = {
    title: 'Schools',
    backBtn: false
  };
  windowHeight: any;

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.windowHeight = window.innerWidth;
  // }

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    this.schoolService.getAll().pipe(first()).subscribe((res: ServerResponse) => {
      this.schools = res.data;
    });
    this.windowHeight = window.innerWidth - 150;
  }

}
