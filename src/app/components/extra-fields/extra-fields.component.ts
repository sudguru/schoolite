import { Component, OnInit } from '@angular/core';
import { EF } from './../../models/ef.model';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ElectronService } from './../../providers/electron.service';

@Component({
  selector: 'app-extra-fields',
  templateUrl: './extra-fields.component.html',
  styleUrls: ['./extra-fields.component.scss']
})
export class ExtraFieldsComponent implements OnInit {

  allEFs: EF[];
  deletedEFs: EF[];
  extra_fields: EF[];
  newEF: EF;
  token: any;
  constructor(
    public dialogRef: MatDialogRef<ExtraFieldsComponent>,
    private electronService: ElectronService,
    private snackbar: MatSnackBar
    ) {

    this.electronService.ipcRenderer.on('efDataSentforApp', (evt, result) => {
      this.allEFs = result;
      this.extra_fields = this.allEFs.filter(r => r.deleted === 0);
      this.deletedEFs = this.allEFs.filter(r => r.deleted === 1);
    });


    this.electronService.ipcRenderer.on('efAdded', (evt, result) => {
      if (result) {
        this.setNewEF();
        this.electronService.ipcRenderer.send('getEFData', 'forApp');
        this.snackbar.open(`Successfully Added.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be Added.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('efModified', (evt, result) => {
      if (result) {
        this.snackbar.open(`Successfully modified.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be modified.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('efDeleted', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getEFData', 'forApp');
        this.snackbar.open(`Successfully Deleted.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be deleted.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('efRestored', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getEFData', 'forApp');
        this.snackbar.open(`Successfully Restored.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be restored.`, '', { duration: 1000 });
      }
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getEFData', 'forApp');
    this.setNewEF();
    this.token = JSON.parse(localStorage.getItem('token'));
  }


  setNewEF() {
    this.newEF = {
      id: 0,
      field_name: '',
      field_type: '',
      sub_fields: '',
      display_order: 0,
      mts: 0,
      deleted: 0
    };
  }

  close() {
    this.dialogRef.close(null);
  }

  updateEF (sk: EF) {
    this.electronService.ipcRenderer.send('updateEF', sk);
  }

  deleteEF(sk: EF) {
    this.electronService.ipcRenderer.send('deleteEF', sk.id);
  }

  restoreEF(sk: EF) {
    this.electronService.ipcRenderer.send('restoreEF', sk.id);
  }

}
