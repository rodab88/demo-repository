import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Services } from 'src/app/services/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { jsPDF } from "jspdf";
import { MiIncentivoComponent } from 'src/app/components/miincentivo/miincentivo.component'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialogDesc/dialog-component';


@Component({
  selector: 'cardincentivo-template',
  templateUrl: './cardincentivo.component.html',
  styleUrls: ['./cardincentivo.component.css'],

})

export class CardIncentivoComponent implements OnInit {


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
  public iframeIncent: string = ''
  public urlI!: SafeResourceUrl;
  public actiPDFIncent: boolean = false;
  public varibleCampanias: number = 0;
  public varibleCompo: number = 0;
  public varibleIncen: number = 0;


  showComponents: boolean = false;
  showDescription: boolean = false;
  componentNameDesc: string = "";
  componentDesc: string = "Descripción Pendiente";

  @ViewChild('pdfTable', { static: false })
  pdfTable!: ElementRef;

  constructor(public dialog: MatDialog, public services: Services, private _sanitizer: DomSanitizer, public miincentivo: MiIncentivoComponent
  ) { }

  ngOnInit(): void {

    console.log(this.plan);
    this.traerListaMidia();
  }

  public traerListaMidia() {
    this.showComponents = false;
    this.boxshadow = "2px 2px 3px 3px " + localStorage.getItem('colorSecundario') + '50';
    this.showComponents = true;

    this.plan.variables.forEach((v: any) => {
      v.acordion = false;
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
  public activarAcordionPlan(item: any) {
    item.acordion = !item.acordion;
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
  public activarPdfIncentivo(obj: any) {
    if (!this.actiPDFIncent) {
      this.iframeIncent = obj.pdf;
      this.actiPDFIncent = true;

      this.urlI = this._sanitizer.bypassSecurityTrustResourceUrl(this.iframeIncent);
    } else {
      this.actiPDFIncent = false;
    }
  }

  public avtivarGrafica(_obj: any) {
    this.miincentivo.activaGraficas(_obj);
  }

  public onExport() {
    this.onShowCard(true);
    const pdfTable = this.pdfTable.nativeElement;
    const doc = new jsPDF("p", "pt", "a4");
    setTimeout(function () {
      doc.html(pdfTable, {
        callback: function (_pdf) {
          doc.save("miincentivo.pdf")
        }
      });
    }, 1000);
  }

  onShowCard(value: boolean) {
    this.variablesTot = value;
    this.variablesPlan = value;

    this.plan.variables.forEach((v: any) => {
      v.acordion = value;
    });
  }

  onShowDescription(i: any) {
    this.componentNameDesc = i.nombre;
    this.showDescription = true;
    console.log(i);

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { name: this.componentNameDesc, description: this.componentDesc }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }

}




