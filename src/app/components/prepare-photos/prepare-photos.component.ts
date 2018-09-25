import { ElectronService } from './../../providers/electron.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
const fs = require('fs');

@Component({
  selector: 'app-prepare-photos',
  templateUrl: './prepare-photos.component.html',
  styleUrls: ['./prepare-photos.component.scss']
})
export class PreparePhotosComponent implements OnInit {
  schoolname: string;
  finalPhoto: any;
  imageDir = '/Users/mac/.schoolite/ID';
  constructor(
    private electronService: ElectronService,
    private dialogRef: MatDialogRef<PreparePhotosComponent>,
    @Inject(MAT_DIALOG_DATA) data: string
  ) {
    this.schoolname = data;
  }

  ngOnInit() {
  }

  openDialog() {
    this.electronService.remote.dialog.showOpenDialog({
      defaultPath: '/Users/mac/Desktop/pab/ID Photo',
      buttonLabel: 'Select Image',
      filters: [
        {name: 'Images', extensions: ['jpg', 'png', 'gif']}
      ]
    }, selectedPath => {
      if (selectedPath) {

        const tempimg = this.electronService.nativeImage.createFromPath(selectedPath[0]);
        const imageSize = tempimg.getSize();
        const imageWidth = 300;
        const imageHeight = (imageSize.height / imageSize.width) * imageWidth;
        this.finalPhoto = tempimg
                          .resize({width: imageWidth, height: imageHeight})
                          .crop({x: 0, y: 0, width: 300, height: 300});

        document.querySelector('.original-image-container').innerHTML = `<img src="${tempimg.toDataURL()}">`;
        document.querySelector('.thumb-image-container').innerHTML = `<img src="${this.finalPhoto.toDataURL()}">`;
        // save image to 'Predefined Folder'
        const ofilename = selectedPath[0].substring(selectedPath[0].lastIndexOf('/') + 1);
        console.log(ofilename);
        const filename = this.slugify(ofilename);
        console.log(filename);
        fs.writeFile(this.imageDir + '/' + filename, this.finalPhoto.toJPEG(100), () => {});
        // Close and send data
        this.dialogRef.close(filename);
      } else {
        this.dialogRef.close(null);
      }

    });
  }

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^.\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

}
