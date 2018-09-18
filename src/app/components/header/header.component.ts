import { ClusterComponent } from './../cluster/cluster.component';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
@Input() headerData: any;

  constructor(
    public _location: Location,
    private router: Router,
    public dialog: MatDialog,
    ) { }

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

}
