import { Component, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-misimulador',
  templateUrl: './misimulador.component.html',
  styleUrls: ['./misimulador.component.css'],
})
export class MiSimuladorComponent implements OnInit {
  showComponents: boolean = false;

  iconoPerfil = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  nombre: string = "";

  seccionesPermitidas: any = [];

  displayProgressSpinner = false;
  periodoSelected: number = 0;
  puestoSelected: number = 0;

  periodos: any = [];

  puestos: any = [];
  arregloGen: any = [];
  arreglo: any = [];
  total: any = [];
  plan: any = [];
  componentesMiDia: boolean = false;
  public idVariable: number = 0;
  public idVariableIncen: number = 0;
  public id: number = 0;
  public arrayColaboradores: any[] = [];
  public arrayCMiDia: any = [];
  public divMiSimulador: boolean = true;
  public divColaboradores: boolean = false;
  public divCompromiso: boolean = false;

  public equipo: boolean = false;
  public nomina: string = '';


  constructor(public services: Services) { }


  ngOnInit(): void {
    this.configPage();
    this.getPropertiesHeader();
    this.cargarDatos();
    this.periodosActual();
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
    this.showComponents = true;
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

  periodosActual(){
    let fecha = new Date();
    let mesAc = fecha.getMonth() + 1;
    let mesAnterior = mesAc -1;
    let mesSiguiente = mesAc +1;

      if (mesAnterior) {
        fecha.setMonth(mesAnterior - 1);
        let mess = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha)
        mess = mess.charAt(0).toUpperCase() + mess.slice(1);
        let obj: any = {
          id: 1,
          descripcion: mess
        }
        this.periodos.push(obj);
      }
      if (mesAc) {
        fecha.setMonth(mesAc - 1);
        let mess = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha)
        mess = mess.charAt(0).toUpperCase() + mess.slice(1);
        let obj: any = {
          id: 2,
          descripcion: mess
        }
        this.periodos.push(obj);
      }
      if (mesSiguiente) {
        fecha.setMonth(mesSiguiente - 1);
        let mess = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha)
        mess = mess.charAt(0).toUpperCase() + mess.slice(1);
        let obj: any = {
          id: 3,
          descripcion: mess
        }
        this.periodos.push(obj);
      }
  }

  cargarDatos() {
    this.showProgressSpinner(true);
    this.divMiSimulador = true;
    this.divColaboradores = false;
    this.componentesMiDia = false;
    this.arrayColaboradores = JSON.parse(localStorage.getItem('colaboradores')!);
    let nomina = this.arrayColaboradores[this.arrayColaboradores.length - 1].nominaColaborador;
    this.datosMiSimulador(nomina);
    this.datosColaboradores(nomina);
    this.obtienePuestos(nomina);
  }

  public obtienePuestos(nomina: any) {
    this.services.getPuestosSimulador().subscribe((datos: any) => {

      if (!datos.error) {
        this.puestos = datos.tiposNominas;

        for (let item of this.puestos) {
          this.id = this.id + 1;
          item.id = this.id;
        }
        let puestoInicial: any = {
          empresaId: 0,
          nombre: "Nombre del Plan",
          orden: "0",
          id: 0,
          tipoNominaId: nomina
        }
        this.puestos.push(puestoInicial);
      }
    })

  }

  public buscarNominaPuesto() {
    for (let item of this.puestos) {
      if (item.id == this.puestoSelected) {
        this.nomina = item.tipoNominaId;
      }
    }

    let obj = { "nomina": this.nomina }
    this.services.getDatosMiDia(obj).subscribe(datos => {

      if (!datos.error) {
        if (datos.data.capanias) {
          this.arreglo = datos.data.capanias;

          if (this.arreglo) {
            for (let item of this.arreglo) {
              this.idVariableIncen = this.idVariableIncen + 1;
              item.idIncentiv = this.idVariableIncen;
              item.stps = this.setStepsGeneral(item.avance);

              if (item.variables) {
                for (let itemVar of item.variables) {
                  this.idVariable = this.idVariable + 1;
                  itemVar.idVariable = this.idVariable;
                  itemVar.stpsVar = this.setStepsGeneral(itemVar.avance);
                }
              }
            }
          }
        }

        this.total = datos.data.total;
        this.plan = datos.data.plan;
        this.setPlan();
        if (datos.data.equipo.length == 0) {
          this.equipo = true;
        }
        this.setCurrentIndexTot();
        this.setCurrentIndexPlan();
        let idx = this.arrayColaboradores.findIndex(c => c.nominaColaborador === this.nomina)
        this.arrayColaboradores[idx].nominaJefe = datos.data.nomina_jefe;
        localStorage.setItem('colaboradores', JSON.stringify(this.arrayColaboradores));
        this.componentesMiDia = true;

        this.services.analitica('buscarNominaMiSimulador').subscribe();
      }
    });
  }

  setPlan() {
    if (this.plan) {
      this.plan.incentivo = '0.00';
      if (this.plan.variables) {
        for (let itemVar of this.plan.variables) {
          itemVar.stpsVar = this.setStepsGeneral(itemVar.avance);
          itemVar.incentivo = '0.00'
          for (let itemCom of itemVar.componentes) {
            this.formatCurrency(itemCom);
            itemCom.color = itemCom.bEditable ? 'white' : '#D9D9D9';
          }
        }
      }

    }
  }

  formatCurrency(itemCom: any) {
    let decimal = itemCom.tiposCampo.decimales;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimal
    })
    if (itemCom.tiposCampo.simbolo == '$') {
      itemCom.valor = formatter.format(itemCom.valor);
    }
    if (itemCom.tiposCampo.simbolo == '%') {
      let valor = Number(itemCom.valor);
      itemCom.valor = valor.toFixed(decimal);
    }
  }

  setStepsGeneral(avance: number) {
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

  datosMiSimulador(nomina: string) {
    let obj = {
      "nomina": nomina,
      "simulador": true
    }
    this.services.getDatosMiDia(obj).subscribe(datos => {
      this.arregloGen = datos.data;
      if (!datos.error) {
        if (datos.data.capanias) {
          this.arreglo = datos.data.capanias;
          if (this.arreglo) {
            for (let item of this.arreglo) {
              this.idVariableIncen = this.idVariableIncen + 1;
              item.idIncentiv = this.idVariableIncen;
              item.stps = this.setStepsGeneral(item.avance);
              if (item.variables) {
                for (let itemVar of item.variables) {
                  this.idVariable = this.idVariable + 1;
                  itemVar.idVariable = this.idVariable;
                  itemVar.stpsVar = this.setStepsGeneral(itemVar.avance);
                }
              }
            }
          }
        }

        this.plan = datos.data.plan;
        if (this.plan) {
          if (this.plan.status_compromiso !== 'ACEPTADA' && this.plan.status_compromiso !== 'GUARDADA') {
            this.plan.incentivo = '0.00';
          }
          if (this.plan.variables) {
            for (let itemVar of this.plan.variables) {
              itemVar.stpsVar = this.setStepsGeneral(itemVar.avance);
              for (let itemCom of itemVar.componentes) {
                this.formatCurrency(itemCom);
                itemCom.color = itemCom.bEditable ? 'white' : '#D9D9D9';
              }
            }
          }

        }
        this.total = datos.data.total;
        if (this.total) {
          if (this.plan.status_compromiso !== 'ACEPTADA' && this.plan.status_compromiso !== 'GUARDADA') {
            this.total.incentivo = '0.00';
          }
        }
        if (datos.data.equipo.length == 0) {
          this.equipo = true;
        }
        this.setCurrentIndexTot();
        this.setCurrentIndexPlan();
        let idx = this.arrayColaboradores.findIndex(c => c.nominaColaborador === nomina)
        this.arrayColaboradores[idx].nominaJefe = datos.data.nomina_jefe;
        localStorage.setItem('colaboradores', JSON.stringify(this.arrayColaboradores));
        this.componentesMiDia = true;
      }
    });
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

  datosColaboradores(nomina: string) {
    this.services.getDatos(nomina).subscribe(datosp => {
      if (datosp !== undefined) {
        this.services.getIncentivos().subscribe(datos => {
          console.log(datos)
          if (!datos.error) {
            this.arrayCMiDia.liderazgo = datos.total;
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
          }
          this.showProgressSpinner(false);
        })
      }
    });
  }

  abrirMiSimulador() {
    this.divMiSimulador = true;
    this.divColaboradores = false;
    this.divCompromiso = false;
    this.services.analitica('iniciarMiSimulador').subscribe();
  }

  abrirColaboradores() {
    this.divMiSimulador = false;
    this.divCompromiso = false;
    this.divColaboradores = true;
    this.services.analitica('verBolsaLiderazgoMiSimulador').subscribe();
  }

  public abrirCompromisos() {
    this.divMiSimulador = false;
    this.divColaboradores = false;
    this.divCompromiso = true;
    this.services.analitica('verCompromisosMiSimulador').subscribe();

  }

  regresarColaboradores(item: any) {
    let idx = this.arrayColaboradores.findIndex(c => c.nominaColaborador === item.nominaColaborador);
    this.arrayColaboradores = this.arrayColaboradores.splice(0, idx + 1);
    localStorage.setItem('colaboradores', JSON.stringify(this.arrayColaboradores));
    this.cargarDatos();
    this.divMiSimulador = false;
    this.divColaboradores = true;
  }


}
