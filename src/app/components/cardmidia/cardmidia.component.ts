import { Component, OnInit, Input } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiDiaComponent } from 'src/app/components/midia/midia.component'


@Component({
  selector: 'cardmidia-template',
  templateUrl: './cardmidia.component.html',
  styleUrls: ['./cardmidia.component.css'],

})

export class CardMiDiaComponent implements OnInit {

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
  public heightTotal: string = '12'
  

  public panelOpenState: boolean = false;
  public arreglopintar: any = [false, false, false, false, false];
  url: string =''
  public actiPDF: boolean = false;
  public varibleCampanias: number= 0;
  public varibleCompo: number= 0;
  public varibleCompPlan: number= 0;
  public varibleIncen: number= 0;
  public arregloIncent: any = [];

  showComponents: boolean = false;

  constructor(public services: Services, public midia: MiDiaComponent
  ) { }

  ngOnInit(): void {

    console.log(this.plan);
    this.traerListaMidia();
    this.openPage('I');
  }

  public traerListaMidia() {
    this.showComponents = false;
    this.boxshadow = "2px 2px 3px 3px " + localStorage.getItem('colorSecundario') + '50';
    this.showComponents = true;
    
  }
  public avtivarGrafica(_obj:any){
    this.midia.activaGraficas(_obj);
  }
  openPage(_origin: string) {
    this.services.getDatosinentivos().subscribe(datos => {
      if (!datos.err) {
        console.log(datos);
        this.arregloIncent = datos;
        if(this.arregloIncent){
          for(let item of this.arregloIncent.incentivos){
            item.stpsVar=this.plan.steps;
            if(item.icono){
              let imagen = item.icono.replace(/ /g,'%20');
              item.icono = 'https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/' + imagen;
            }
            for(let itemCom of item.componentes){
                let decimal = itemCom.vista.tiposCampo.decimales;
                let valor = Number(itemCom.vista.valor);
                itemCom.vista.valor = valor.toFixed(decimal);

            }
          }
        }
      }
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
    if(valor.idIncentiv == this.varibleIncen){  
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
    }else{
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
  public activarAcordionPlan(obj:any){


     if(obj.vista.orden == this.varibleCompPlan){  
      if (!this.acordionPlan) {
        this.acordionPlan = true;
        this.varibleCompPlan = obj.vista.orden;
      } else {
        this.acordionPlan = false;
        this.varibleCompPlan = 0;
      }
     }else{
      this.varibleCompPlan = 0;
      this.acordionPlan = false;
      if (!this.acordionPlan) {
        this.acordionPlan = true;
        this.varibleCompPlan = obj.vista.orden;
      } else {
        this.acordionPlan = false;
        this.varibleCompPlan = 0;
      }
    } 
    

  }

  public activarAcordion(obj:any){
    if(obj.idVariable == this.varibleCompo){  
      if (!this.acordion) {
        this.acordion = true;
        this.varibleCompo = obj.idVariable;
      } else {
        this.acordion = false;
        this.varibleCompo = 0;
      }
    }else{
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

  public activarPdf(obj: any){
    if (!this.actiPDF) {

      this.url = 'https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/' + obj.documento;
      this.actiPDF = true;
    } else {
      this.actiPDF = false;
    }
  }


}
