import { Component, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-miincentivo',
  templateUrl: './miincentivo.component.html',
  styleUrls: ['./miincentivo.component.css'],
})
export class MiIncentivoComponent implements OnInit {
  showComponents: boolean = false;

  iconoPerfil = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  nombre: string = "";

  seccionesPermitidas: any = [];

  displayProgressSpinner = false;

  //arrayMiDia: any;
  nombreMiDia: string = "";

  arrayCMiDia: any = [];
  divMiDia: boolean = true;
  divColaboradores: boolean = false;
  public idVariable: number = 0;
  public idVariableIncen: number = 0;
  arrayColaboradores: any[] = [];

  filtroIncentivo: number = 0;

  /*CARD MI DIA*/
  arreglo: any = [];
  total: any = [];
  plan: any = [];
  componentesMiDia: boolean = false;
  public componenteGrafica: boolean = false;
  public datosGrafica: any = [];

  steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
  { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];

  constructor(public services: Services) { }


  ngOnInit(): void {
    this.configPage();
    this.getPropertiesHeader();
    this.cargarDatos();
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

  cargarDatos() {
    this.showProgressSpinner(true);
    this.divMiDia = true;
    this.divColaboradores = false;
    this.componentesMiDia = true;
    this.arrayColaboradores = JSON.parse(localStorage.getItem('colaboradores')!);
    let nomina = this.arrayColaboradores[this.arrayColaboradores.length - 1].nominaColaborador;
    this.datosMiDia(nomina);
  }

  datosMiDia(nomina: string) {
    let obj = {
      "nomina": nomina,
      "simulador": false
    }
    this.services.getDatosMiDia(obj).subscribe(datos => {
      if (!datos.error) {
        this.arreglo = datos.data.campanias;
        if (this.arreglo) {
          this.formatArreglo();
        }

        this.total = datos.data.total;
        this.plan = datos.data.plan;
        this.formatPlan();
        this.setCurrentIndexTot();
        this.setCurrentIndexPlan();
        let idx = this.arrayColaboradores.findIndex(c => c.nominaColaborador === nomina)
        this.arrayColaboradores[idx].nominaJefe = datos.data.nomina_jefe;
        localStorage.setItem('colaboradores', JSON.stringify(this.arrayColaboradores));
        this.componentesMiDia = true;
        this.datosColaboradores(datos.data);
      }
    });
  }

  formatPlan() {
    if (this.plan) {
      if (this.plan.variables) {
        for (let itemVar of this.plan.variables) {
          itemVar.stpsVar = this.getSteps(itemVar.avance);
          for (let itemCom of itemVar.componentes) {
            this.formatCurrency(itemCom);
          }
        }
      }
    }
  }

  formatArreglo() {
    for (let item of this.arreglo) {
      this.idVariableIncen = this.idVariableIncen + 1;
      item.idIncentiv = this.idVariableIncen;
      item.stps = this.getSteps(item.avance);

      if (item.variables) {
        for (let itemVar of item.variables) {
          this.idVariable = this.idVariable + 1;
          itemVar.idVariable = this.idVariable;
          itemVar.stpsVar = this.getSteps(itemVar.avance);
          for (let itemCom of itemVar.componentes) {
            this.formatCurrency(itemCom);
          }
        }
      }
    }
  }

  formatCurrency(item: any) {
    let decimal = item.tiposCampo.decimales;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimal
    })
    if (item.tiposCampo.simbolo == '$') {
      item.valor = formatter.format(item.valor);
    }
    if (item.tiposCampo.simbolo == '%') {
      let valor = Number(item.valor);
      item.valor = valor.toFixed(decimal);
    }
  }

  getSteps(avance: number) {
    let steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
    { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];

    for (let i = 0; i < steps.length; i++) {
      if (i < avance + 1)
        steps[i].status = true;
      else
        steps[i].class = "#747474";
    }

    return steps;
  }

  datosColaboradores(datos: any) {
    /*this.services.getDatos(nomina).subscribe(datos=>{
      if(datos!==undefined){
        this.services.getIncentivos(nomina, datos.tipoNominaId).subscribe(datos=>{
          console.log(datos)
          if(!datos.error){*/
    this.arrayCMiDia.liderazgo = datos.totalEquipo;
    this.arrayCMiDia.equipo = datos.equipo;
    this.arrayCMiDia.equipo.forEach((e: any) => {
      e.incentivo = e.total;
      e.compromiso = 100;
      e.compromiso_aceptado = true;
      e.puesto = "Subdirector";
      e.avance = 2;
    })
    this.setSteps();
    this.showComponents = true;
    //}
    this.showProgressSpinner(false);
    /* })
   }
 });

 let objenviar = {
   nomina: nomina,
   empresa_id: '13'
 }
 this.services.postDatosColabMiDia(objenviar).subscribe(datos => {
   if (!datos.error) {
     console.log(datos);
     this.arrayCMiDia = datos.data;
     this.setSteps();
     this.showComponents = true;
     this.showProgressSpinner(false);
   } else {
     this.showProgressSpinner(false);
   }
 });*/
  }

  abrirColaboradores() {
    this.divMiDia = false;
    this.divColaboradores = true;
    this.componenteGrafica = false;
    this.services.analitica('verBolsaLiderazgoMiIncentivo').subscribe();
  }

  abrirMiDia() {
    this.divMiDia = true;
    this.divColaboradores = false;
    this.componenteGrafica = false;
  }

  public activaGraficas(datos: any) {
    this.datosGrafica = datos;
    this.divMiDia = false;
    this.divColaboradores = false;
    this.componenteGrafica = true;

  }

  regresarColaboradores(item: any) {
    let idx = this.arrayColaboradores.findIndex(c => c.nominaColaborador === item.nominaColaborador);
    this.arrayColaboradores = this.arrayColaboradores.splice(0, idx + 1);
    localStorage.setItem('colaboradores', JSON.stringify(this.arrayColaboradores));
    this.cargarDatos();
    this.divMiDia = false;
    this.divColaboradores = true;
  }

  setSteps() {
    this.arrayCMiDia.equipo.forEach((e: any) => {
      let steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
      { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];
      for (let i = 0; i < steps.length; i++) {
        if (e.compromiso > 0 && !e.compromiso_aceptado) {
          e.opacity = true;
          steps[i].class = "#747474";
        } else {
          e.opacity = false;
          if (i < e.avance)
            steps[i].status = true;
          else
            steps[i].class = "#747474";
        }

      }
      e.steps = steps;
    });
  }


  setCurrentIndexPlan() {
    let steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
    { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];

    for (let i = 0; i < steps.length; i++) {
      if (i < this.plan.avance)
        steps[i].status = true;
      else
        steps[i].class = "#747474";
    }
    this.plan.steps = steps;
  }

  public setCurrentIndexTot() {
    let steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
    { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];
    for (let i = 0; i < steps.length; i++) {
      if (i < this.total.avance)
        steps[i].status = true;
      else
        steps[i].class = "#747474";
    }
    this.total.steps = steps;
  }

}
