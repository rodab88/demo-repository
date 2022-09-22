import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Share } from 'src/app/models/share';


@Component({
    selector: 'dialog-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css']
})
export class ShareComponent {


    constructor(
        public dialogRef: MatDialogRef<ShareComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Share,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
