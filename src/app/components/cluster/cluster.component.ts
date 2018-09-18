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

  clusters: Cluster[];
  newCluster: Cluster;
  constructor(
    public dialogRef: MatDialogRef<ClusterComponent>,
    private electronService: ElectronService,
    private snackbar: MatSnackBar
    ) {

    this.electronService.ipcRenderer.on('clusterDataSent', (evt, result) => {
      this.clusters = result;
      console.log('from cluster', this.clusters);
    });


    this.electronService.ipcRenderer.on('clusterAdded', (evt, result) => {
      if (result) {
        this.electronService.ipcRenderer.send('getClusterData');
        this.setNewCluster();
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
      console.log(result);
      if (result) {
        this.electronService.ipcRenderer.send('getClusterData');
        this.snackbar.open(`Successfully Deleted.`, '', { duration: 1000 });
      } else {
        this.snackbar.open(`Could NOT be deleted.`, '', { duration: 1000 });
      }
    });
  }

  ngOnInit() {
    this.electronService.ipcRenderer.send('getClusterData');
    this.setNewCluster();
  }

  setNewCluster() {
    this.newCluster = {
      id: 0,
      cluster: '',
      cluster_nepali: ''
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

}
