import { PreparePhotosComponent } from './../prepare-photos/prepare-photos.component';
import { ElectronService } from './../../providers/electron.service';
import { School } from './../../models/school.model';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

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
  imageDir = '/Users/mac/.schoolite/ID';

  search: string;
  searchChanged: Subject<string> = new Subject<string>();


  constructor(
    private electronService: ElectronService,
    private router: Router,
    public dialog: MatDialog,
    ) {
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
    // /Users/mac/new2018/schoolite/src/assets/ID
    const that = this;
    this.electronService.fs.readdir(this.imageDir, function(err, dir) {
      const photoFiles = [];
      for (const filePath of dir) {
        photoFiles.push(filePath);
      }
      that.photos = photoFiles;
      // console.log(that.photos);
    });

    this.electronService.ipcRenderer.on('resultSent', (evt, result) => {
      this.dbSchools = result;
      this.schools = this.dbSchools;
    });

    this.electronService.ipcRenderer.on('imageUpdated', (evt, result) => {
      this.setPhoto(this.selectedSchool.photo);
    });

   }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getSchoolData');
    this.windowHeight = window.innerHeight - 100;
    // this.windowHeight = this.electronService.remote.getCurrentWindow().getBounds().height;
    console.log(this.windowHeight);
    this.setNewSchool();
  }

  setNewSchool() {
    this.newSchool = {
      id: 0,
      name: '',
      m_id: 0,
      municipality: '',
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



  filteredSearch = function (search) {
    const lowSearch = search.toLowerCase();
    return this.schools.filter(function(s) {
        return Object.values(s).some( val => String(val).toLowerCase().includes(lowSearch));
    });
  };

  searchRecords(text: string) {
    this.searchChanged.next(text);
  }



  showSchool(school: School) {
    this.selectedSchool = school;

    if (!this.selectedSchool.photo) {
      this.selectedSchool.photo = 'dummy.jpg';
    }
    this.setPhoto(this.selectedSchool.photo);
  }

  setPhoto(photo) {
    const photopath = this.imageDir + '/' + photo;
    const imagetoShow = this.electronService.nativeImage.createFromPath(photopath);
    const imageSize = imagetoShow.getSize();
    const imageWidth = 200;
    const imageHeight = (imageSize.height / imageSize.width) * imageWidth;
    this.selectedSchool.photoDataUrl = imagetoShow.resize({width: imageWidth, height: imageHeight}).toDataURL();
  }

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^.\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  openPreparePhoto() {

    const dialogRef = this.dialog.open(PreparePhotosComponent, {
      width: '1000px',
      disableClose: false,
      autoFocus: true,
      data: this.selectedSchool.name
    });
    const that = this;
    dialogRef.afterClosed().subscribe(selectedImage => {
      const data = {
        id: that.selectedSchool.id,
        filename: selectedImage
      };
      if (selectedImage) {
        this.selectedSchool.photo = selectedImage;
        this.electronService.ipcRenderer.send('saveImage', data);
      }
    });
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
