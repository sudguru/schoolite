import { Component, OnInit } from '@angular/core';
import { SK } from './../../models/sk.model';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ElectronService } from './../../providers/electron.service';

@Component({
  selector: 'app-sk',
  templateUrl: './sk.component.html',
  styleUrls: ['./sk.component.scss']
})
export class SkComponent implements OnInit {

  allSKs: SK[];
  deletedSKs: SK[];
  sks: SK[];
  newSK: SK;
  constructor(
    public dialogRef: MatDialogRef<SkComponent>,
    private electronService: ElectronService,
    private snackbar: MatSnackBar
    ) {

    this.electronService.ipcRenderer.on('skDataSentforApp', (evt, result) => {
      this.allSKs = result;
      this.sks = this.allSKs.filter(r => r.deleted === 0);
      this.deletedSKs = this.allSKs.filter(r => r.deleted === 1);
    });


    this.electronService.ipcRenderer.on('skAdded', (evt, result) => {
      if (result) {
        this.setNewSK();
        this.electronService.ipcRenderer.send('getSKData', 'forApp');
        this.snackbar.open(`Successfully Added.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be Added.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('skModified', (evt, result) => {
      if (result) {
        this.snackbar.open(`Successfully modified.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be modified.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('skDeleted', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getSKData', 'forApp');
        this.snackbar.open(`Successfully Deleted.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be deleted.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('skRestored', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getSKData', 'forApp');
        this.snackbar.open(`Successfully Restored.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be restored.`, '', { duration: 1000 });
      }
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getSKData', 'forApp');
    this.setNewSK();
  }


  setNewSK() {
    this.newSK = {
      id: 0,
      sk: '',
      sk_nepali: '',
      mts: 0,
      deleted: 0
    };
  }

  close() {
    this.dialogRef.close(null);
  }

  updateSK (sk: SK) {
    this.electronService.ipcRenderer.send('updateSK', sk);
  }

  deleteSK(sk: SK) {
    this.electronService.ipcRenderer.send('deleteSK', sk.id);
  }

  restoreSK(sk: SK) {
    this.electronService.ipcRenderer.send('restoreSK', sk.id);
  }

}
