import { ElectronService } from './../../providers/electron.service';
import { ServerResponse } from './../../models/login-response.model';
import { School } from './../../models/school.model';
import { Component, OnInit, HostListener } from '@angular/core';
import { first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
const stringSimilarity = require('string-similarity');
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  schools: School[] = [];
  selectedSchool: School;
  dbSchools: School[] = [];
  newSchool: School;
  headerData: any = {
    title: 'Schools',
    backBtn: false,
    edit: true
  };
  windowHeight: any;
  photos = [];


  search: string;
  searchChanged: Subject<string> = new Subject<string>();

  constructor(private electronService: ElectronService) {
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
    this.electronService.fs.readdir('/Users/mac/new2018/schoolite/src/assets/ID', function(err, dir) {
      const photoFiles = [];
      for (const filePath of dir) {
        photoFiles.push(filePath);
      }
      that.photos = photoFiles;
    });

    this.electronService.ipcRenderer.on('resultSent', (evt, result) => {
      this.dbSchools = result;
      this.schools = this.dbSchools;
    });
   }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getData');
    this.windowHeight = window.innerHeight - 200;
    // this.windowHeight = this.electronService.remote.getCurrentWindow().getBounds().height;
    console.log(this.windowHeight);
    this.setNewSchool();
  }

  setNewSchool() {
    this.newSchool = {
      id: 0,
      name: '',
      n_id: 0,
      nagarpalika: '',
      ward_no: '',
      principal: '',
      address: '',
      office_no: '',
      mobile_no: '',
      classes_upto: '',
      c_id: 0,
      cluster: '',
      email: '',
      contact_person: '',
      contact_no: '',
      estd: '',
      post_box: '',
      home_no: '',
      cdo: '',
      sk_id: 0,
      sk: '',
      photo: ''
    };
  }


  // J Jorpati
  // P Pabson
  // MID Mid Pabson
  // NEEB
  // W West Region
  // N Northern Pabson
  // SR South Region
  // DEAN DEAN
  // TOPS TOPS
  // OPS OPS
  // PRO Progressive Group
  // FISM
  // NOPSO
  // MF MAAF
  // BEF BEF
  // F FECA
  // Bishesh




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
    const result = stringSimilarity.findBestMatch(school.name, this.photos);
    this.selectedSchool.photo = './assets/ID/' + result.bestMatch.target;
  }


  addEdit(school: School) {
    // const dialogRef = this.dialog.open(ProductEditComponent, {
    //   width: '650px',
    //   disableClose: true,
    //   autoFocus: true,
    //   data: product
    // });
    // const that = this;
    // dialogRef.afterClosed().subscribe(readyProduct => {
    //   if (readyProduct) {
    //     this.productService.addEditProduct(readyProduct, that.parties).then(res => {
    //       console.log(res);
    //       if (res) {
    //         this.snackbar.open(`${readyProduct.name} successfully added / modified.`, '', { duration: 3000 });
    //         this.getProducts();
    //       } else {
    //         this.snackbar.open(`${readyProduct.name} could not be added / modified.`, '', { duration: 3000 });
    //       }
    //     });
    //   } else {
    //     this.getProducts();
    //   }
    //   this.setNewProduct();
    // });
  }


}
