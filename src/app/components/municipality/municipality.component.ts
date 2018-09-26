import { Component, OnInit } from '@angular/core';
import { Municipality } from './../../models/municipality.model';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ElectronService } from './../../providers/electron.service';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})

export class MunicipalityComponent implements OnInit {
  allMunicipalities: Municipality[];
  deletedMunicipalities: Municipality[];
  municipalities: Municipality[];
  newMunicipality: Municipality;
  constructor(
    public dialogRef: MatDialogRef<MunicipalityComponent>,
    private electronService: ElectronService,
    private snackbar: MatSnackBar
    ) {

    this.electronService.ipcRenderer.on('municipalityDataSentforApp', (evt, result) => {
      this.allMunicipalities = result;
      this.municipalities = this.allMunicipalities.filter(r => r.deleted === 0);
      this.deletedMunicipalities = this.allMunicipalities.filter(r => r.deleted === 1);
    });


    this.electronService.ipcRenderer.on('municipalityAdded', (evt, result) => {
      if (result) {
        this.setNewMunicipality();
        this.electronService.ipcRenderer.send('getMunicipalityData', 'forApp');
        this.snackbar.open(`Successfully Added.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be Added.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('municipalityModified', (evt, result) => {
      if (result) {
        this.snackbar.open(`Successfully modified.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be modified.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('municipalityDeleted', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getMunicipalityData', 'forApp');
        this.snackbar.open(`Successfully Deleted.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be deleted.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('municipalityRestored', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getMunicipalityData', 'forApp');
        this.snackbar.open(`Successfully Restored.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be restored.`, '', { duration: 1000 });
      }
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getMunicipalityData', 'forApp');
    this.setNewMunicipality();
  }


  setNewMunicipality() {
    this.newMunicipality = {
      id: 0,
      municipality: '',
      municipality_nepali: '',
      mts: 0,
      deleted: 0
    };
  }

  close() {
    this.dialogRef.close(null);
  }

  updateMunicipality (municipality: Municipality) {
    this.electronService.ipcRenderer.send('updateMunicipality', municipality);
  }

  deleteMunicipality(municipality: Municipality) {
    this.electronService.ipcRenderer.send('deleteMunicipality', municipality.id);
  }

  restoreMunicipality(municipality: Municipality) {
    this.electronService.ipcRenderer.send('restoreMunicipality', municipality.id);
  }

}
