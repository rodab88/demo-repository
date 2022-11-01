import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations
} from "ng-apexcharts";
import { Services } from 'src/app/services/services';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;

};

@Component({
  selector: 'cardgraficas-template',
  templateUrl: './cardgraficas.component.html',
  styleUrls: ['./cardgraficas.component.css'],
})

export class CardGraficasComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;
  @Input() datosGrafica: any = [];

  public chartOptions: ChartOptions = {} as ChartOptions;
  public cargo: boolean = false;
  seccionesPermitidas: any = [];

  public arreglo: any = [];
  public avance: any = [];
  public proyectado: any = [];
  public label: any = [];
  public micompromiso: any = [];
  public totAvance: any = [];
  public totProyectado: any = [];
  public valoridcomponente: string = '';
  displayProgressSpinner = false;
  public color: string = '';
  colorletra: string = "";
  constructor(public services: Services) {

  }

  creaGrafica(etiquetas: any, proyectado: any, avance: any, micomp: any, color: any) {
    return {
      series: [
        {
          name: "Mi Compromiso",
          data: micomp,
          color: this.arreglo.color_compromiso
        },
        {
          name: "Avance a Mi Día",
          data: avance,
          color: this.arreglo.color_avance
        },
        {
          name: "Mi Proyectado",
          data: proyectado,
          color: color
        }
      ],
      chart: {
        height: 200,
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: false
          }
        },
        zoom: {
          enabled: false,
        }
      },
      annotations: {
        points: [
          {
            x: this.totAvance.dia,
            y: this.totAvance.valor,
            marker: {
              size: 5,
              fillColor: "#fff",
              strokeColor: this.colorletra,
              radius: 5,
              cssClass: "apexcharts-custom-class"
            },
            label: {
              borderColor: this.colorletra,
              offsetY: 0,
              offsetX: 20,
              style: {
                radius: 15,
                color: "#fff",
                background: this.colorletra
              },

              text: this.valoridcomponente
            }
          },
          {
            x: this.totProyectado.dia,
            y: this.totProyectado.valor,
            image: {
              //path: '/assets/img/pez.png',
              path: this.arreglo.logo_grafica,
              width: 15,
              height: 15,
              offsetX: 0,
              offsetY: 0,
            },
            marker: {
              size: 10,
              fillColor: color,
              strokeColor: '#FFF',
              radius: 5,
              cssClass: "apexcharts-custom-class"
            }
          },

        ]
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        padding: {
          right: 12,
          left: 23
        }
      },
      labels: etiquetas,
      xaxis: {
        labels: {
          style: {
            colors: [],
            fontSize: '7px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            cssClass: 'apexcharts-xaxis-label',
          },

        },
        title: {
          text: 'Días',
          offsetX: -165,
          offsetY: -10,
          style: {
            color: this.colorletra,
            fontSize: '8px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            cssClass: 'apexcharts-xaxis-title',
          },
        },
      },
      yaxis: [
        {
          opposite: false,
          show: false,
        },
      ],
    };
  }

  ngOnInit(): void {
    this.colorletra = localStorage.getItem('colorletra')!;
    this.showProgressSpinner(true);
    this.obtieneDatosGrafica();
    this.configPage();
    console.log('pintar', this.arreglo);
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  public obtieneDatosGrafica() {
    let objenviar = {
      nomina: localStorage.getItem('nomina'),
      empresa_id: '13',
      variable_id: this.datosGrafica.id_variable ? this.datosGrafica.id_variable : this.datosGrafica.vista.id
    }
    this.services.postDatosGrafica(objenviar).subscribe(datos => {
      if (!datos.error) {
        this.arreglo = datos.data;
        this.arreglo.componentes.forEach((_e: any) => {
          this.avance = [];
          this.proyectado = [];
          this.label = [];
          this.micompromiso = [];
          this.totAvance = 0;
          this.datosGrafica.componentes.forEach((_idvalorcomp: any) => {
            if (_idvalorcomp.id_componente == _e.id_componente) {
              this.valoridcomponente = _idvalorcomp.valor;
            }
          });
          let tot = _e.avance.length - 1;
          let totProye = _e.proyectado.length - 1;
          this.totAvance = _e.avance[tot];
          this.totProyectado = _e.proyectado[totProye];
          if (this.arreglo.componentes[1].diferencia == _e.diferencia) {
            _e.diferencia = '-' + _e.diferencia;
          }
          this.getAvance(_e);
          this.proyectado[tot] = this.totAvance.valor;
          this.getProyectado(_e);
          this.cargo = true;
          let _chartOptions = this.creaGrafica(this.label, this.proyectado, this.avance, this.micompromiso, this.color);
          _e.chartOptions = _chartOptions;
        });
        this.showProgressSpinner(false);
      }
    });
  }

  getProyectado(_e: any) {
    _e.proyectado.forEach((_proy: any) => {
      this.proyectado.push(_proy.valor);
      this.label.push(_proy.dia);
      this.micompromiso.push(this.arreglo.componentes[1].diferencia == _e.diferencia ? (this.totProyectado.valor + 5) : (this.totProyectado.valor - 5));
    });
  }

  getAvance(_e: any) {
    _e.avance.forEach((_avan: any) => {
      this.avance.push(_avan.valor);
      this.label.push(_avan.dia);
      this.proyectado.push(null);
      this.micompromiso.push(this.arreglo.componentes[1].diferencia == _e.diferencia ?
        (this.totProyectado.valor + 5) : (this.totProyectado.valor - 5));
      this.color = this.arreglo.componentes[1].diferencia == _e.diferencia ? 'red' : this.arreglo.color_proyectado;
      _e.color = this.color;
    });
  }

  public enviarPag() {
    window.location.href = "https://www.universidadcorporativagentera.com/";
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

}
