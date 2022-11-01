import { Component, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-misretos',
  templateUrl: './misretos.component.html',
  styleUrls: ['./misretos.component.css'],

})
export class MisRetosComponent implements OnInit {
  showComponents: boolean = false;

  mostrarTienda: boolean = false;

  iconoPerfil = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  nombre: string = "";

  seccionesPermitidas: any = [];

  displayProgressSpinner = false;
  public resumenReto: boolean = false;
  public cardReto: boolean = false;

  saldoDisponible: number = 0;  

  public misretos: any =
    {
      "reto": [
        {
          "nombre": 'Nombre del reto',
          "descripcion": "Desembolsómetro"
        },
        {
          "nombre": "Tiempo para lograr el reto",
          "descripcion": "Mensual"
        },
        {
          "nombre": "Fecha de inicio",
          "descripcion": "1 de agosto 2022 "
        },
        {
          "nombre": "Fecha de corte",
          "descripcion": "31 de agosto 2022"
        },
        {
          "nombre": "Indicador a medir",
          "descripcion": "Desembolsos"
        },
        {
          "nombre": "Puestos participantes",
          "descripcion": "Promotor CM y Promotor CCR"
        },
        {
          "nombre": "Alcance",
          "descripcion": "Nacional"
        },
        {
          "nombre": "Objetivo",
          "descripcion": "Desembolsar $500,000.00"
        },
        {
          "nombre": "Regla",
          "descripcion": "Gana el colaborador que logre primero el objetivo"
        },
        {
          "nombre": "Competencia",
          "descripcion": "Compañeros del mismo puesto"
        },
        {
          "nombre": "Medición",
          "descripcion": "Por colaborador"
        },
        {
          "nombre": "Valor del reto (puntaje)",
          "descripcion": "100 puntos"
        },
        {
          "nombre": "Fecha de acumulación de puntos",
          "descripcion": "1 de septiembre 2022"
        }
      ]
    };

  public steps = [{ status: true, class: "#E00000" }, { status: true, class: "#E05100" }, { status: true, class: "#E08600" },
  { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];

  public arreglo: any =
    {
      "posts": [
        {
          "miniatura_banner": "/assets/img/retos_activos.png",
          "post_id": 1,
          "titulo": "Mi Reto",
          "nombre": "Nombre de KPI",
          "descripcion": "Real/Objeto",
          "titulo2": "Desembolsómetro",
          "nombre2": "Desembolsos",
          "descripcion2": "$300K/$500K"
        },
        {
          "miniatura_banner": "/assets/img/retos_activos.png",
          "post_id": 1,
          "titulo": "Mi Reto",
          "nombre": "Nombre de KPI",
          "descripcion": "Real/Objeto",
          "titulo2": "Desembolsómetro",
          "nombre2": "Desembolsos",
          "descripcion2": "$300K/$500K"
        }
      ]
    }

  constructor(public services: Services, private matDialog: MatDialog) { }


  ngOnInit(): void {
    this.configPage();
    this.getPropertiesHeader();    
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  getPropertiesHeader() {
    this.iconoPerfil = String(localStorage.getItem('iconoPerfil'));
    this.colorperfil = String(localStorage.getItem('colorperfil'));
    this.colorletra = String(localStorage.getItem('colorletra'));
    this.meimpulsa = String(localStorage.getItem('meimpulsa'));
    this.nombre = String(localStorage.getItem('nombre'));
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

  

  public abreModalResumen() {
    if (!this.cardReto) {
      this.cardReto = true;
    } else {
      this.cardReto = false;
    }
  }

  public abrirResumen() {

    if (!this.resumenReto) {
      this.resumenReto = true;
    } else {
      this.resumenReto = false;
    }
    console.log(this.resumenReto)

  }

  irTienda(val: boolean) {
    this.mostrarTienda = val;
  }

  changeSaldo(saldo: number) {
    this.saldoDisponible = saldo;
  }

}
