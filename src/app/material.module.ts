import { NgModule } from '@angular/core';

import {
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule
} from '@angular/material';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatListModule,
        MatDividerModule,
        MatChipsModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTabsModule
    ],
    exports: [
        MatFormFieldModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatListModule,
        MatDividerModule,
        MatChipsModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTabsModule
    ]
})

export class MaterialModule {}
