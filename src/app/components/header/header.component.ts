import { Cluster } from './../../models/cluster.model';
import { ElectronService } from './../../providers/electron.service';
import { ClusterComponent } from './../cluster/cluster.component';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';

export interface SyncResponse {
  status: number;
  error: string;
  data: any;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class HeaderComponent implements OnInit {
@Input() headerData: any;
  clusters: Cluster[];
  constructor(
    public _location: Location,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private electronService: ElectronService
    ) {

      this.electronService.ipcRenderer.on('clusterDataSent', (evt, result) => {
        this.clusters = result;
        const json_clusters = JSON.stringify(this.clusters);
        // console.log('cluster string', this.clusters);
        console.log(this.clusters);
        this.http.post('https://mcan.org.np/schoolite/src/public/syncClusters', { clusters: this.clusters })
        .subscribe((res: SyncResponse) => {
          console.log(res);
          if (!res.error) {
            this.electronService.ipcRenderer.send('syncClusterDataFromRemote', res.data);
          }
        });
      });

    }

  ngOnInit() {
  }

  logout() {
    this.router.navigate(['/login']);
  }

  cluster() {
    this.dialog.open(ClusterComponent, {
      width: '650px',
      disableClose: false,
      autoFocus: true
    });
  }

  syncClusters() {
    this.electronService.ipcRenderer.send('getClusterData');
  }

}
