import { ElectronService } from './../../providers/electron.service';
import { Municipality } from './../../models/municipality.model';
import { SK } from './../../models/sk.model';
import { Cluster } from './../../models/cluster.model';
import { School } from './../../models/school.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-schools-edit',
  templateUrl: './schools-edit.component.html',
  styleUrls: ['./schools-edit.component.scss']
})
export class SchoolsEditComponent implements OnInit {

  school: School;
  municipalities: Municipality[];
  sks: SK[];
  clusters: Cluster[];

  constructor(
    private dialogRef: MatDialogRef<SchoolsEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: School,
    private electronService: ElectronService
  ) {
      this.school = data;
      this.electronService.ipcRenderer.on('lookupDataSent', (evt, result) => {
        console.log(result);
        this.municipalities = result.municipalities;
        this.sks = result.sks;
        this.clusters = result.clusters;
      });
   }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getLookUps');
  }

  close(res: any) {
    this.dialogRef.close(res);
  }

}
