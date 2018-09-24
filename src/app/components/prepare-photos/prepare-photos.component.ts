import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prepare-photos',
  templateUrl: './prepare-photos.component.html',
  styleUrls: ['./prepare-photos.component.scss']
})
export class PreparePhotosComponent implements OnInit {

  headerData: any = {
    title: 'Prepare Photos',
    backBtn: false,
    edit: true
  };
  imageDir = '/Users/mac/.schoolite/ID';
  image = './assets/background.jpg';
  constructor() { }

  ngOnInit() {
  }

}
