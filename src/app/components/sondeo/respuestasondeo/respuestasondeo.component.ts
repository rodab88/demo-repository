import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import * as $ from "jquery";


@Component({
  selector: 'respuestasondeo-template',
  templateUrl: './respuestasondeo.component.html',
  styleUrls: ['./respuestasondeo.component.css'],
})

export class RespuestaSondeoComponent implements OnChanges {
  @Output() setRespuesta: EventEmitter<any> = new EventEmitter();
  @Input() arreglo: any = [];

  respOpc4: string = "";
  col: number = 0;

  inputRadio: any[] = [];

  constructor(public services: Services,
    private matDialog: MatDialog, public auth: AuthService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initRespuestas();
  }

  initRespuestas() {
    if (this.arreglo.idTipoPregunta == 1) {
      this.arreglo.respuestas.forEach((e: any) => {
        e.estatus = false;
        e.coloronpress = '';
        e.backgroundonpress = '';
      })
    }
    if (this.arreglo.idTipoPregunta == 2) {
      let respuestas: any[] = [];
      let simbolo = "";
      switch (this.arreglo.id_simbolo) {
        case 1:
          simbolo = "estrella";
          break;
        case 2:
          simbolo = "elipse";
          break;
        case 3:
          simbolo = "cara";
          break;
        case 4:
          simbolo = "corazon";
          break;
      }
      let src = "/assets/img/" + simbolo + ".png";
      for (let i = 1; i <= this.arreglo.id_Nivel; i++) {
        respuestas.push({ id: i, src: src, coloronpress: '', backgroundonpress: '', estatus: false })
      }

      this.arreglo.respuestas = respuestas;
    }
    if (this.arreglo.idTipoPregunta == 3) {
      for (let i = 0; i < this.arreglo.respuestas.columnas.length; i++) {
        let t: any[] = [];
        for (let j = 0; j < this.arreglo.respuestas.filas.length; j++) {
          t.push(
            { estatus: false, col: this.arreglo.respuestas.columnas[i].idcolumna, fila: this.arreglo.respuestas.filas[j].idfila });
        }
        this.inputRadio.push(t);
      }
      this.col = Math.floor(12 / (this.arreglo.respuestas.columnas.length + 1));
    }
  }

  selectValueOpc1(obj: any) {
    let respuestas: any[] = [];
    this.arreglo.respuestas.forEach((_e: any) => {
      if (_e.idradio == obj.idradio) {
        if (_e.estatus) {
          _e.estatus = false;
          _e.coloronpress = '';
          _e.backgroundonpress = '';
        } else {
          _e.estatus = true;
          _e.coloronpress = '#FFFFFF';
          _e.backgroundonpress = 'rgb(2 98 145 / 86%)';
        }
      } else {
        if (!this.arreglo.multiple) {
          _e.estatus = false;
          _e.coloronpress = '';
          _e.backgroundonpress = '';
        }
      }
    });

    this.arreglo.respuestas.forEach((r: any) => {
      if (r.estatus)
        respuestas.push({ id: r.idradio, respuesta: (r.nombreradio ? r.nombreradio : r.nombre), estatus: r.status== undefined? true: r.status });
    });
    this.setRespuesta.emit({ "id": this.arreglo.id, "respuestas": respuestas });
  }

  selectValueOpc2(obj: any) {
    let respuestas: any[] = [];

    for (let i = 0; i < this.arreglo.id_Nivel; i++) {
      if (i < obj.id) {
        this.arreglo.respuestas[i].coloronpress = '#FFFFFF';
        this.arreglo.respuestas[i].backgroundonpress = 'rgb(2 98 145 / 86%)';
      } else {
        this.arreglo.respuestas[i].coloronpress = '';
        this.arreglo.respuestas[i].backgroundonpress = '';
      }
    }
    respuestas.push({ id: obj.id, respuesta: obj.id.toString(), estatus: true });
    this.setRespuesta.emit({ "id": this.arreglo.id, "respuestas": respuestas});
  }

  selectValueOpc4() {
    this.setRespuesta.emit({ "id": this.arreglo.id, "respuestas": { id: 0, respuesta: this.respOpc4, estatus: true } });
  }

  changeInput(event: any, inputSelected: any) {
    console.log(event);
    console.log(inputSelected);
    let f = inputSelected.fila - 1;
    for (let i = 0; i < this.inputRadio.length; i++) {
      this.inputRadio[i][f].estatus = false;
      $("#radio-" + this.inputRadio[i][f].col + "-" + this.inputRadio[i][f].fila).prop("checked", false);
    }
    this.inputRadio[inputSelected.col - 1][inputSelected.fila - 1].estatus = true;
    $("#radio-" + this.inputRadio[inputSelected.col - 1][inputSelected.fila - 1].col + "-" + this.inputRadio[inputSelected.col - 1][inputSelected.fila - 1].fila).prop("checked", true);
    let respuestas:any[]=[];
    for (let c=0; c< this.arreglo.respuestas.columnas.length; c++){
      for (let f=0; f< this.arreglo.respuestas.filas.length; f++){
        if(this.inputRadio[c][f].estatus){
          respuestas.push({respuesta: this.arreglo.respuestas.columnas[c].columnasnombre +"-"+this.arreglo.respuestas.filas[f].filasnombre, estatus: true})
        }
      }
    }
    this.setRespuesta.emit({ "id": this.arreglo.id, "respuestas": respuestas });
  }

}
