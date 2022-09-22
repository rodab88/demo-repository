import { Component } from '@angular/core';
import { Services } from 'src/app/services/services';
import { AuthService } from 'src/app/services/auth.service';
import { MisRetosComponent } from 'src/app/components/misretos/misretos.component'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialogDesc/dialog-component';

@Component({
  selector: 'resumen-template',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css'],
})
export class MisRetosResumenComponent {
  showComponents: boolean = false;
  public modalPuntos: boolean = false;
  public arreglo: any = 
  {
  saldo_inicial : '2,000',
  puntos_abonados : '+ 1,700',
  puntos_cangeados : '- 200',  
  titulo: 'Resumen mensual',
  titulo2: 'Movimeintos',
  "movimientos": [
    {
      "nombre": 'Reto 6 cumplido',
      "valor": "+ 1,000",
      "fecha": "26/08/2022"

    },
    {
      "nombre": "Reto 5 cumplido",
      "valor": "+ 700",
      "fecha": "26/08/2022"
    },
    {
      "nombre": "Canje 2",
      "valor": "- 200",
      "fecha": "26/08/2022"
    },
    
  ]}

  constructor(public dialog: MatDialog, public services: Services,  public auth: AuthService, public misretos: MisRetosComponent) { }

  public activarRetos(){
    this.misretos.abrirResumen();
  }

  public activarModPuntos(){
    if(!this.modalPuntos){
      this.modalPuntos = true;
    }else{
      this.modalPuntos = false;
    }
  }

  onShowDescription(nombre: string) {   
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { name: nombre, description: "Descripción Pendiente" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
}
