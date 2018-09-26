import { SkComponent } from './../sk/sk.component';
import { MunicipalityComponent } from './../municipality/municipality.component';
import { SyncPhotosComponent } from './../sync-photos/sync-photos.component';
import { Cluster } from './../../models/cluster.model';
import { ElectronService } from './../../providers/electron.service';
import { ClusterComponent } from './../cluster/cluster.component';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

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
  online$: Observable<boolean>;
  constructor(
    public _location: Location,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private electronService: ElectronService
    ) {

      this.electronService.ipcRenderer.on('clusterDataSentforSync', (evt, result) => {
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

      this.online$ = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );

    }

  ngOnInit() {

  }

  logout() {
    this.router.navigate(['/login']);
  }

  cluster() {
    this.dialog.open(ClusterComponent, {
      width: '1000px',
      disableClose: false,
      autoFocus: true
    });
  }

  municipality() {
    this.dialog.open(MunicipalityComponent, {
      width: '1000px',
      disableClose: false,
      autoFocus: true
    });
  }

  sk() {
    this.dialog.open(SkComponent, {
      width: '1000px',
      disableClose: false,
      autoFocus: true
    });
  }

  syncClusters() {
    this.electronService.ipcRenderer.send('getClusterData', 'forSync');
  }

  syncPhotos() {
    this.dialog.open(SyncPhotosComponent, {
      width: '1000px',
      disableClose: false,
      autoFocus: true
    });
  }


}
