import { Component, OnInit } from '@angular/core';
import { ElectronService } from './../../providers/electron.service';



@Component({
  selector: 'app-sqlite',
  templateUrl: './sqlite.component.html',
  styleUrls: ['./sqlite.component.scss']
})
export class SqliteComponent implements OnInit {
  recs = [];
  constructor(private electronService: ElectronService) {
    const that = this;
    this.electronService.ipcRenderer.on('resultSent', (evt, result) => {
      that.recs = result;
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getData');
  }

}
