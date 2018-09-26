import { ElectronService } from './../../providers/electron.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
const fs = require('fs');
const request = require('request');

@Component({
  selector: 'app-sync-photos',
  templateUrl: './sync-photos.component.html',
  styleUrls: ['./sync-photos.component.scss']
})
export class SyncPhotosComponent implements OnInit {
  imageDir = '/Users/mac/.schoolite/ID';
  remoteDir = 'https://mcan.org.np/schoolite/ID';
  remoteFiles = [];
  localFiles = [];
  constructor(
    private http: HttpClient,
    private electronService: ElectronService
    ) {}

  ngOnInit() {
    const that = this;
    this.electronService.fs.readdir(this.imageDir, function(err, dir) {
      const photoFiles = [];
      for (const filePath of dir) {
        photoFiles.push(filePath);
      }
      that.localFiles = photoFiles;
    });
  }

  startDownload () {
    this.http.get('https://mcan.org.np/schoolite/src/public/getRemotePhotos')
        .subscribe((res) => {
           // this.remoteFiles = res;
           this.remoteFiles = Object.keys(res).map(function(key) {
            return [res[key]];
          });
          this.remoteFiles.forEach(remoteFile => {
            if (!this.localFiles.includes(remoteFile)) {
              this.downloadFile(this.remoteDir + '/' + remoteFile, this.imageDir + '/' + remoteFile);
            }
          });
        });
  }

  startUpload () {
    this.localFiles.forEach(localFile => {
      if (!this.remoteFiles.includes(localFile)) {
        this.uploadFile(localFile);
      }
    });
  }

  uploadFile(localFile: string) {
    const filetoUpload = this.electronService.nativeImage.createFromPath(this.imageDir + '/' + localFile).toDataURL();
    const uploadData = new FormData();
    uploadData.append('myFile', filetoUpload);
    this.http.post('https://mcan.org.np/schoolite/src/public/uploadPhoto', filetoUpload)
    .subscribe(res => {
      console.log(res);
    });
  }

  downloadFile(file_url , targetPath) {
    // Save variable to know progress
    let received_bytes = 0;
    let total_bytes = 0;

    const req = request({
        method: 'GET',
        uri: file_url
    });

    const out = fs.createWriteStream(targetPath);
    req.pipe(out);
    const that = this;
    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = +(data.headers['content-length']);
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        that.showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        console.log('File succesfully downloaded');
    });
}

  showProgress(received, total) {
      const percentage = (received * 100) / total;
      const progress = percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.';
      document.querySelector('#progress').innerHTML = progress;
  }
}
