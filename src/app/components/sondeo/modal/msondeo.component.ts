import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-sondeo',
    templateUrl: './msondeo.component.html',
    styleUrls: ['./msondeo.component.css'],
})
export class MSondeoComponent {


    constructor(
        public dialogRef: MatDialogRef<MSondeoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    siguiente(): void {
        this.dialogRef.close();
    }

}