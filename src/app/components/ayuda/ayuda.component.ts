import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent  {

  campo:string="{{nombre_completo}}"

  constructor(private matDialog: MatDialogRef<AyudaComponent>) { }

  cerrar(){
    this.matDialog.close();
  }

}
