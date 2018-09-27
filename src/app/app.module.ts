import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';


import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { ClusterComponent } from './components/cluster/cluster.component';
import { SyncPhotosComponent } from './components/sync-photos/sync-photos.component';
import { PreparePhotosComponent } from './components/prepare-photos/prepare-photos.component';
import { MunicipalityComponent } from './components/municipality/municipality.component';
import { SkComponent } from './components/sk/sk.component';
import { ExtraFieldsComponent } from './components/extra-fields/extra-fields.component';
import { SchoolsEditComponent } from './components/schools-edit/schools-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    LoginComponent,
    HeaderComponent,
    ClusterComponent,
    SyncPhotosComponent,
    PreparePhotosComponent,
    MunicipalityComponent,
    SkComponent,
    ExtraFieldsComponent,
    SchoolsEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    ElectronService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ClusterComponent,
    SyncPhotosComponent,
    MunicipalityComponent,
    SkComponent,
    ExtraFieldsComponent,
    SchoolsEditComponent
  ]
})
export class AppModule { }
