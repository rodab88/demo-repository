import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class MisRetosResumenComponent implements OnInit {
  showComponents: boolean = false;
  public modalPuntos: boolean = false;
  arreglo: any = [];
  @Output() changeSaldo: EventEmitter<number> = new EventEmitter();

  anios: any[] = [];

  anioSelected: number = 0;
  mesSelected: number = 0;

  constructor(public dialog: MatDialog, public services: Services, public auth: AuthService, public misretos: MisRetosComponent) { }

  ngOnInit(): void {
    let i = 1;
    let z = 2022 + 10;
    for (let a = 2022; a < z; a++) {
      this.anios.push({ "id": i, "value": a });
      i++;
    }
    const d = new Date();
    this.anioSelected = d.getFullYear();
    this.mesSelected = d.getMonth() + 1;
    this.changeValue();
  }

  changeValue() {
    if (this.anioSelected > 0 && this.mesSelected > 0) {
      let obj = {
        "nomina": Number(localStorage.getItem('nomina')),
        "periodo": this.anioSelected + "-" + this.mesSelected + "-01"
      }
      this.services.saldos(obj).subscribe(datos => {
        if (!datos.error) {
          console.log(datos);
          this.changeSaldo.emit(datos.data.saldo_disponible);
          this.arreglo = datos.data;
        }
      });
    }
  }

  public activarRetos() {
    this.misretos.abrirResumen();
  }

  public activarModPuntos() {
    if (!this.modalPuntos) {
      this.modalPuntos = true;
    } else {
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
