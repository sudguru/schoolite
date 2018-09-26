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
    this.getLocalPhotosList();
    this.getRemotePhotosList();
  }

  getLocalPhotosList() {
    const that = this;
    this.electronService.fs.readdir(this.imageDir, function(err, dir) {
      const photoFiles = [];
      for (const filePath of dir) {
        photoFiles.push(filePath);
      }
      that.localFiles = photoFiles;
      console.log('local', that.localFiles);
    });
  }

  getRemotePhotosList() {
    this.http.get('https://mcan.org.np/schoolite/src/public/getRemotePhotos')
      .subscribe((res) => {
        this.remoteFiles = res.toString().split(',');
        console.log('remote', this.remoteFiles);
      });
  }

  async startSync() {
    document.querySelector('#progress').innerHTML = 'Sync Started!';
    await this.startDownload();
    await this.startUpload();
  }

  startDownload () {
    console.log('startdownload');
    this.remoteFiles.forEach(remoteFile => {
      if (!this.localFiles.includes(remoteFile)) {
        this.downloadFile(this.remoteDir + '/' + remoteFile, this.imageDir + '/' + remoteFile, remoteFile);
      }
    });
  }

  startUpload () {
    console.log('startupload');
    this.localFiles.forEach(localFile => {
      if (!this.remoteFiles.includes(localFile)) {
        if (localFile.substring(0, 1) !== '.') {
          this.uploadFile(localFile);
        }
      }
    });
    // document.querySelector('#progress').innerHTML += `<br>Sync Complete !`;
  }

  uploadFile(localFile: string) {
    const filetoUpload = this.electronService.nativeImage.createFromPath(this.imageDir + '/' + localFile).toDataURL();
    // const uploadData = new FormData();
    // uploadData.append('myFile', filetoUpload);
    this.http.post('https://mcan.org.np/schoolite/src/public/uploadPhoto', {
      myFile: filetoUpload, filename: localFile, secret: 'SudeepsSecret'
    })
    .subscribe(res => {
      document.querySelector('#progress').innerHTML += `<br>${res}.`;
    });
  }

  downloadFile(file_url , targetPath, remoteFile) {

    const req = request({
        method: 'GET',
        uri: file_url
    });

    const out = fs.createWriteStream(targetPath);
    req.pipe(out);
    const that = this;


    req.on('end', function() {
      document.querySelector('#progress').innerHTML += `<br>${remoteFile} Downloaded.`;
    });
}

}
