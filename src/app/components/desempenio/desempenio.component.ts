import { Component, ViewChild} from "@angular/core";
import { ApexAxisChartSeries, ApexTitleSubtitle, ApexChart,
  ApexXAxis,ChartComponent,ApexDataLabels
} from "ng-apexcharts";
import { Services } from 'src/app/services/services';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart ;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'desempenio-template',
  templateUrl: './desempenio.component.html',
  styleUrls: ['./desempenio.component.css'],
})

export class DesempenioComponent {
  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;
  public chartOptions: ChartOptions;

  seccionesPermitidas: any=[];

  constructor(public services: Services) {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: []

        },
        {
          name: '',
          data: []
        }
      ],
      colors: [],
      dataLabels: {
        enabled: true
      },
      chart: {
        height: 400,
        type: "radar",
          toolbar: {
            show: true,
            tools: {
              download: false
            }
          }

      },
      title: {
        text: "",
        
      },
      xaxis: {
        categories: []
      }
    };
  }

  ngOnInit(): void {

    this.categoria();
    this.configPage();
  }

  configPage(){
    this.seccionesPermitidas=JSON.parse(String(localStorage.getItem("seccionesPermitidas")));        
  }

  public categoria() {
    let objenviar =
    {
      nomina: localStorage.getItem('nominaColaborador'),
      empresa_id: '13'
    }
    this.services.postCategoria(objenviar).subscribe(datos => {

      if(!datos.error){
        if(datos.data.categoria == 'Muy Alto'){
          this.chartOptions = {
            series: [
              {
                name: datos.data.categoria,
                data: [73, 60, 72, 76, 75, 88, 90, 75]
      
              }
            ],
            colors: [datos.data.color_categoria],
            dataLabels: {
              enabled: true,
              textAnchor: 'middle',
              style: {
              fontSize: '14px',
              fontFamily: 'BreeBold',
              //colors: ['#263238']
            },
            background: {
              enabled: false,
            }
            },
            chart: {
              height: 400,
              type: "radar",
  
                toolbar: {
                  show: true,
                  tools: {
                    download: false
                  }
                }
      
            },
            title: {
              text: datos.data.categoria,
              align: 'center',
              floating: true,
              offsetX: 0,
              offsetY: 10,
              style: {
                fontSize:  '14px',
                fontFamily:  'BreeBold',
                color:  datos.data.color_categoria
              },
              
            },
            xaxis: {
              categories: ["IncrementoClientes", "VentaCruzada", "Colocaciones", "Incentivo", "MetaRiesgo",
                          "CateraRiesgo", "Fichas" , "GruposNuevos"]
            }
          };
        }else{
          this.chartOptions = {
            series: [
              {
                name: datos.data.categoria,
                data: [73, 60, 72, 76, 75, 88, 90, 75]
      
              },
              {
                
                name: datos.data.categoria_sig,
                data: [94, 83, 90, 92, 97, 99, 95, 90]
              }
            ],
            colors: [datos.data.color_categoria,datos.data.color_categoria_sig],
            dataLabels: {
              enabled: true,
              textAnchor: 'middle',
              style: {
              fontSize: '14px',
              fontFamily: 'BreeBold',
              //colors: ['#263238']
            },
            background: {
              enabled: false,
            }
            },
            chart: {
              height: 400,
              type: "radar",
  
                toolbar: {
                  show: true,
                  tools: {
                    download: false
                  }
                }
      
            },
            title: {
              text: datos.data.categoria,
              align: 'center',
              floating: true,
              offsetX: 0,
              offsetY: 10,
              style: {
                fontSize:  '14px',
                fontFamily:  'BreeBold',
                color:  datos.data.color_categoria
              },
              
            },
            xaxis: {
              categories: ["IncrementoClientes", "VentaCruzada", "Colocaciones", "Incentivo", "MetaRiesgo",
                          "CateraRiesgo", "Fichas" , "GruposNuevos"]
            }
          };
        }
      }

    });


  }

  public enviarPag(){
    this.services.analitica('accesarUcg').subscribe(datos=>{
      window.location.href = "https://www.universidadcorporativagentera.com/";
    });
  }

}
