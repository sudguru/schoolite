import { Cluster } from './../../models/cluster.model';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ElectronService } from './../../providers/electron.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss']
})
export class ClusterComponent implements OnInit {
  allClusters: Cluster[];
  deletedClusters: Cluster[];
  clusters: Cluster[];
  newCluster: Cluster;
  token: any;
  constructor(
    public dialogRef: MatDialogRef<ClusterComponent>,
    private electronService: ElectronService,
    private snackbar: MatSnackBar
    ) {

    this.electronService.ipcRenderer.on('clusterDataSentforApp', (evt, result) => {
      this.allClusters = result;
      this.clusters = this.allClusters.filter(r => r.deleted === 0);
      this.deletedClusters = this.allClusters.filter(r => r.deleted === 1);
    });


    this.electronService.ipcRenderer.on('clusterAdded', (evt, result) => {
      if (result) {
        this.setNewCluster();
        this.electronService.ipcRenderer.send('getClusterData', 'forApp');
        this.snackbar.open(`Successfully Added.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be Added.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('clusterModified', (evt, result) => {
      if (result) {
        this.snackbar.open(`Successfully modified.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be modified.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('clusterDeleted', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getClusterData', 'forApp');
        this.snackbar.open(`Successfully Deleted.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be deleted.`, '', { duration: 1000 });
      }
    });

    this.electronService.ipcRenderer.on('clusterRestored', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getClusterData', 'forApp');
        this.snackbar.open(`Successfully Restored.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be restored.`, '', { duration: 1000 });
      }
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getClusterData', 'forApp');
    this.setNewCluster();
    this.token = JSON.parse(localStorage.getItem('token'));
  }


  setNewCluster() {
    this.newCluster = {
      id: 0,
      cluster: '',
      cluster_nepali: '',
      mts: 0,
      deleted: 0
    };
  }

  close() {
    this.dialogRef.close(null);
  }

  updateCluster (cluster: Cluster) {
    this.electronService.ipcRenderer.send('updateCluster', cluster);
  }

  deleteCluster(cluster: Cluster) {
    this.electronService.ipcRenderer.send('deleteCluster', cluster.id);
  }

  restoreCluster(cluster: Cluster) {
    this.electronService.ipcRenderer.send('restoreCluster', cluster.id);
  }

}
