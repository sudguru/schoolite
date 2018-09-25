import { ElectronService } from './../../providers/electron.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-prepare-photos',
  templateUrl: './prepare-photos.component.html',
  styleUrls: ['./prepare-photos.component.scss']
})
export class PreparePhotosComponent implements OnInit {

  finalPhoto: string;
  imageDir = '/Users/mac/.schoolite/ID';
  image = './assets/background.jpg';
  constructor(
    private electronService: ElectronService
  ) { }

  ngOnInit() {
  }

  openDialog() {
    this.electronService.remote.dialog.showOpenDialog({
      defaultPath: '/Users/mac/Desktop/',
      buttonLabel: 'Select Image',
      filters: [
        {name: 'Images', extensions: ['jpg', 'png', 'gif']}
      ]
    }, selectedPath => {
      const tempimg = this.electronService.nativeImage.createFromPath(selectedPath[0]);
      const imageSize = tempimg.getSize();
      const imageWidth = 200;
      const imageHeight = (imageSize.height / imageSize.width) * imageWidth;
      this.finalPhoto = tempimg
                        .resize({width: imageWidth, height: imageHeight})
                        .crop({x: 0, y: 0, width: 200, height: 300})
                        .toDataURL();
      document.querySelector('.original-image-container').innerHTML = `<img src="${tempimg.toDataURL()}">`;
      document.querySelector('.thumb-image-container').innerHTML = `<img src="${this.finalPhoto}">`;
    });
  }

}
