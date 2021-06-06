import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'popup',
    templateUrl: 'popup.component.html',
  })
  export class PopUpComponent {
  
    constructor(
      public dialogRef: MatDialogRef<PopUpComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  export interface DialogData {
    name: string;
  }
  