import { ElectronService } from './../../providers/electron.service';
import { ServerResponse } from './../../models/login-response.model';
import { SchoolService } from './../../services/school.service';
import { School } from './../../models/school.model';
import { Component, OnInit, HostListener } from '@angular/core';
import { first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  schools: School[] = [];
  selectedSchool: School;
  dbSchools: School[] = [];
  headerData: any = {
    title: 'Schools',
    backBtn: false
  };
  windowHeight: any;
  photos = [];

  search: string;
  searchChanged: Subject<string> = new Subject<string>();

  constructor(private schoolService: SchoolService, private electronService: ElectronService) {
    this.searchChanged.pipe(
      debounceTime(500) // wait 300ms after the last event before emitting last event
    ).pipe(
      distinctUntilChanged() // only emit if value is different from previous value
    ).subscribe(search => {
      this.search = search;
      if (this.search.length > 0) {
        this.schools = this.dbSchools;
        this.schools = this.filteredSearch(this.search);
      } else {
        this.schools = this.dbSchools;
      }
    });

    // Get Photos
    const that = this;
    electronService.fs.readdir('/Users/mac/new2018/schools/src/assets/ID', function(err, dir) {
      const photoFiles = [];
      for (const filePath of dir) {
        photoFiles.push(filePath);
      }
      that.photos = photoFiles;
    });
   }

  ngOnInit() {
    this.schoolService.getAll().pipe(first()).subscribe((res: ServerResponse) => {
      this.dbSchools = res.data;
      this.schools = this.dbSchools;
    });
    this.windowHeight = window.innerHeight - 100;
  }


  filteredSearch = function (search) {
    const lowSearch = search.toLowerCase();
    return this.schools.filter(function(s) {
        return Object.values(s).some( val => String(val).toLowerCase().includes(lowSearch));
    });
  };

  searchRecords(text: string) {
    this.searchChanged.next(text);
  }

  // onKeydown(event) {
  //   if (event.key === 'ArrowDown') {
  //     const fistListItem = document.querySelector('.fistListItem');
  //     console.log(fistListItem);
  //     fistListItem.focus({preventScroll: true});
  //   }
  // }

  showSchool(school: School) {
    this.selectedSchool = school;
  }

}
