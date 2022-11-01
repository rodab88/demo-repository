import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Services } from 'src/app/services/services';
import { ToastService } from 'src/app/toast-service';
import { CurrencyPipe } from '@angular/common';
import { ValorFormat } from 'src/app/pipes/valorFormat';
import { DialogComponent } from 'src/app/components/dialogDesc/dialog-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cardsimulador-template',
  templateUrl: './cardsimulador.component.html',
  styleUrls: ['./cardsimulador.component.css'],

})

export class CardSimuladorComponent implements OnInit {


  @Input() arreglo: any = [];
  @Input() total: any = [];
  @Input() plan: any = [];


  public boxshadow = "";
  public currentIndex = 0;
  public variables: boolean = false;
  public variablesTot: boolean = false;
  public variablesPlan: boolean = false;
  public acordion: boolean = false;
  public acordionPlan: boolean = false;


  public panelOpenState: boolean = false;
  public arreglopintar: any = [false, false, false, false, false];
  public url: string = ''
  public actiPDFIncent: boolean = false;
  public varibleCampanias: number = 0;
  public varibleCompo: number = 0;
  public varibleIncen: number = 0;
  public filtroIncentivo: number = 0;
  public seleccionamMonto: boolean = false;
  public seleccionamMontoCamp: boolean = false;
  showComponents: boolean = false;

  public montoSim: string = '0';
  public nombreSim: string = '';
  public idVariable: number = 0;
  public objVarible: any = [];

  public compromiso: any = [];
  public varcomp: any = [];

  public varibleCompPlan: number = 0;

  componenteSelect: any;
  showDescription: boolean = false;
  componentNameDesc: string = "";
  componentDesc: string = "Descripción Pendiente";


  sumInsuredLimitModel: number = 5000000;
  limit = 5000000;
  amountOptions = { align: 'right', prefix: '$', thousands: ',', precision: 2, decimal: '.', suffix: '' };
  public colorletra: string = "";

  @ViewChild('pdfTable', { static: false })
  pdfTable!: ElementRef;

  constructor(public services: Services, public toastService: ToastService, private currencyPipe: CurrencyPipe,
    private valorFormat: ValorFormat, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.colorletra = localStorage.getItem('colorletra')!;
    this.traerListaMidia();
  }

  public traerListaMidia() {
    this.showComponents = false;
    this.boxshadow = "2px 2px 3px 3px " + localStorage.getItem('colorSecundario') + '50';
    this.showComponents = true;

    this.plan.variables.forEach((v: any) => {
      v.acordion = false;
      v.componentes.forEach((c: any) => {
        c.seleccionamMonto = false;
      });
    });
  }



  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

  public mostrarVar(valor: any) {
    if (valor.idIncentiv == this.varibleIncen) {
      this.acordion = false;
      if (!this.variables) {
        this.variables = true;
        this.varibleCampanias = valor.variables[0].idVariable;
        this.varibleIncen = valor.idIncentiv;
      } else {
        this.variables = false;
        this.varibleCampanias = 0;
        this.varibleIncen = 0;
      }
    } else {
      this.variables = false;
      this.acordion = false;
      if (!this.variables) {
        this.variables = true;
        this.varibleCampanias = valor.variables[0].idVariable;
        this.varibleIncen = valor.idIncentiv;
      } else {
        this.variables = false;
        this.varibleCampanias = 0;
        this.varibleIncen = 0;
      }

    }

  }
  public mostrarVarTot() {
    if (!this.variablesTot) {
      this.variablesTot = true;
    } else {
      this.variablesTot = false;
    }

  }
  public mostrarVarPlan() {
    if (!this.variablesPlan) {
      this.variablesPlan = true;
    } else {
      this.variablesPlan = false;
    }

  }


  public activarPdfIncentivo(obj: any) {
    if (!this.actiPDFIncent) {
      this.url = obj.pdf;
      this.services.analitica('abrirPdfMiMiSimulador').subscribe();
      this.actiPDFIncent = true;
    } else {
      this.actiPDFIncent = false;
    }
  }

  public activarMonto(obj: any, idVariable: number) {
    this.montoSim = '';
    this.amountOptions.precision = obj.tiposCampo.decimales;
    switch (obj.tiposCampo.simbolo) {
      case '$':
        this.amountOptions.prefix = obj.tiposCampo.simbolo;
        this.amountOptions.suffix = '';
        break;
      case '%':
        this.amountOptions.prefix = '';
        this.amountOptions.suffix = obj.tiposCampo.simbolo;
        break;
      default:
        this.amountOptions.prefix = '';
        this.amountOptions.suffix = '';
        break;
    }
    if (obj.bEditable) {
      if (obj) {
        this.componenteSelect = obj;
        this.nombreSim = obj.nombre;
        this.idVariable = idVariable;
      }
      obj.seleccionamMonto = !obj.seleccionamMonto;
      if (!this.seleccionamMonto) {
        this.seleccionamMonto = true;
      } else {
        this.seleccionamMonto = false;
      }
    }
  }

  public activarMontoCam(obj: any) {
    if (obj.bEditable) {
      if (!this.seleccionamMontoCamp) {
        this.seleccionamMontoCamp = true;
      } else {
        this.seleccionamMontoCamp = false;
      }
    }
  }

  public aplicarMontoCamp() {

    let itemComp: any = {}
    try {
      itemComp = this.plan.variables
        .find((e: any) => e.id_variable == this.idVariable)
    }
    catch (e) {
      console.log(e)

    }

    this.componenteSelect.valor = Number(this.montoSim);
    let decimal = this.componenteSelect.tiposCampo.decimales;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimal
    })
    if (this.componenteSelect.tiposCampo.simbolo == '$') {
      this.componenteSelect.valor = formatter.format(this.componenteSelect.valor);

    }
    if (this.componenteSelect.tiposCampo.simbolo == '%') {
      let valor = Number(this.componenteSelect.valor) / 100;
      this.componenteSelect.valor = valor;//.toFixed(decimal);
    }

    this.plan.variables.forEach((v: any) => {
      v.acordion = true;
      v.componentes.forEach((c: any) => {
        c.seleccionamMonto = true;
      });
    });

    setTimeout(() => {
      this.calculos();
      this.plan.variables.forEach((v: any) => {
        v.acordion = itemComp == v ? true : false;
        v.componentes.forEach((c: any) => {
          c.seleccionamMonto = false;
        });
      });
      this.seleccionamMontoCamp = false;
      this.objVarible = this.plan.variables;
      this.montoSim = '';
      this.services.analitica('cambiarMonto').subscribe();
    }, 1000);
  }


  public calculos() {

    for (let itemVar of this.plan.variables) {
      for (let itemComp of itemVar.componentes) {
        if (itemComp.calculos !== '') {
          itemComp.valor = this.calculaFN(itemComp.valor, itemComp.calculos);
        }
      }
    }
    let suma = 0;
    for (let itemVar of this.plan.variables) {
      itemVar.incentivo = this.calculaFN(itemVar.incentivo, itemVar.calculos);
      suma += itemVar.incentivo;
    }
    this.plan.incentivo = suma;
    this.total.incentivo = this.plan.incentivo;
  }

  public onShowDescription(i: any) {
    this.componentNameDesc = i.nombre;
    this.showDescription = true;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { name: this.componentNameDesc, description: this.componentDesc }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      console.log('The dialog was closed' + resultado);
    });
  }

  calculaFN(valor: any, calculos: string) {
    if (valor !== undefined) {
      let value = valor.toString().replace(/[%]/g, '').replace(/[$,]/g, '');
      let calc = '  let value = ' + value + '; ' + calculos;
      calc = calc.replaceAll(".value", ".innerText.replace(/[%]/g,'').replace(/[$,]/g,'')");
      calc = calc.replaceAll(".innerText.replace(/[%]/g,'').replace(/[$,]/g,'')=", ".innerText=");
      calc = calc.replaceAll(".innerText.replace(/[%]/g,'').replace(/[$,]/g,'') =", ".innerText=");
      console.log(calc);
      if (!calc.includes('incremento_neto_de_clientes')) {
        let F = new Function(calc);
        return F();
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  public generarCompromiso() {
    this.compromiso = [];
    this.plan.status_compromiso = 'GUARDADA';
    let montoTotal = 0;
    if (this.objVarible.length == 0) {
      this.objVarible = this.plan.variables;
    }
    for (let item of this.objVarible) {
      this.varcomp = {
        id_incentivo: item.id_variable,
        monto: Number(item.incentivo)
      }
      this.compromiso.push(this.varcomp);
      montoTotal = montoTotal + Number(item.incentivo);

    }

    let objEnviar = {
      nomina: localStorage.getItem('nomina'),
      monto: montoTotal,
      incentivos: this.compromiso
    }
    this.services.postCrearCompromiso(objEnviar).subscribe(datos => {
      if (!datos.error) {
        this.services.analitica('generarCompromiso').subscribe();
        let not = {
          title: 'Mi Compromiso',
          body: 'El compromiso se género correctamente',
          image: '/assets/img/accept.png'
        }
        this.toastService.show(not);
        this.datosMiSimulador(String(localStorage.getItem('nomina')));

      }
    });
  }
  public datosMiSimulador(nomina: string) {
    let obj = {
      "nomina": nomina,
      "simulador": true
    }
    this.services.getDatosMiDia(obj).subscribe(datos => {

      if (!datos.error) {

        this.total = datos.data.total;
        this.plan = datos.data.plan;

      }
    });
  }
  public activarAcordionPlan(obj: any) {
    obj.acordion = !obj.acordion;
    if (obj.orden == this.varibleCompPlan) {
      if (!this.acordionPlan) {
        this.acordionPlan = true;
        this.varibleCompPlan = obj.orden;
      } else {
        this.acordionPlan = false;
        this.varibleCompPlan = 0;
      }
    } else {
      this.varibleCompPlan = 0;
      this.acordionPlan = false;
      if (!this.acordionPlan) {
        this.acordionPlan = true;
        this.varibleCompPlan = obj.orden;
      } else {
        this.acordionPlan = false;
        this.varibleCompPlan = 0;
      }
    }


  }
  public onExport() {
    let incentivos: any[] = [];

    this.plan.variables.forEach((v: any) => {
      let componentes: any[] = [];

      v.componentes.forEach((c: any) => {
        componentes.push({
          "nombre_variable": c.nombre,
          "valor_variable": this.valorFormat.transform(c.valor, c.tiposCampo)
        });
      });
      incentivos.push({
        "titulo_incentivo": v.nombre,
        "monto_incentivo": this.currencyPipe.transform(v.incentivo),
        "variable": componentes
      });
    });

    let obj = {
      "idDocumentType": 221,
      "directory": "Incentivos",
      "datos": {
        "objetivo": this.currencyPipe.transform(this.total.incentivo),
        "fecha": this.total.fecha,
        "plan": this.currencyPipe.transform(this.total.incentivo),
        "incentivos": incentivos
      }

    };
    this.services.getPDF(obj).subscribe(datos => {
      if (!datos.error) {
        this.services.analitica('descargarCompromiso').subscribe();
        console.log(datos);
        const source = `data:application/pdf;base64,${datos.b64}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `micompromiso.pdf`
        link.click();
      }
    });
  }

  public onShowCard(value: boolean) {
    this.variablesTot = value;
    this.variablesPlan = value;

    this.plan.variables.forEach((v: any) => {
      v.acordion = value;
    });
  }

  public activarAcordion(obj: any) {

    if (obj.idVariable == this.varibleCompo) {
      if (!this.acordion) {
        this.acordion = true;
        this.varibleCompo = obj.idVariable;
      } else {
        this.acordion = false;
        this.varibleCompo = 0;
      }
    } else {
      this.varibleCompo = 0;
      if (!this.acordion) {
        this.acordion = true;
        this.varibleCompo = obj.idVariable;
      } else {
        this.acordion = false;
        this.varibleCompo = 0;
      }
    }
  }

  getInfoHTML() {
    let template: string = "<html><head>" +

      "</div>" +
      "</div>" +
      "<hr class=\"linea\">" +
      "<table class=\"centerTable\">" +
      "<tr>" +
      "<td style=\"padding-left: 0.5em;\" class=\"texto\">Monto Plan</td>" +
      "<td style=\"padding-left: 5.8em;\" class=\"textoMagenta\">" + this.currencyPipe.transform(this.total.incentivo) + "</td>" +
      "</tr>" +
      "</table>" +
      "<hr class=\"linea\">";

    template += "<table class=\"centerTable\">";

    this.plan.variables.forEach((v: any) => {
      template += "<tr>" +
        "<td style=\"padding-right: 1em;padding-left: 0.9em;width: 0.5em;\"><span class=\"dot\"></span></td>" +
        "<td class=\"texto\">" + v.nombre + "</td>" +
        "<td class=\"textoMagenta\">" + this.currencyPipe.transform(v.incentivo) + "</td></tr>";
      v.componentes.forEach((c: any) => {

        template += "<tr style=\"background: rgb(193 193 193 / 30%);\">" +
          "<td colspan=\"2\" style=\"padding: 0.2em 0.5em;\" class=\"texto\">" + c.nombre + "</td>" +
          //"<td style=\"padding: 0em 8em;\"></td>" +
          "<td style=\"text-align: right;\" class=\"texto\">" + this.valorFormat.transform(c.valor, c.tiposCampo) + "</td></tr>";
      });
    });


    template += "</table>";

    template += "</body></html>";

    return template;
  }

}

