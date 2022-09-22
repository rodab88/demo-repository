import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'footer-template',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})

export class FooterComponent implements OnInit {
  @Input() color: string = '';

  seccionesPermitidas: any = [];
  numcol = 4;
  public rutaPaginaSim: boolean = false;
  public rutaPaginaIncen: boolean = false;

  ngOnInit() {
    this.configPage();
    this.validaSeciones();
  }

  configPage() {

    let secciones = 0;
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
    if (this.seccionesPermitidas !== null) {
      secciones = secciones + (this.seccionesPermitidas.mis_variables ? 1 : 0);
      secciones = secciones + (this.seccionesPermitidas.mi_incentivo ? 1 : 0);
      secciones = secciones + (this.seccionesPermitidas.mi_simulador ? 1 : 0);
      secciones = secciones + (this.seccionesPermitidas.mis_retos ? 1 : 0);
      this.numcol = 12 / secciones;
    }
  }

  public validaSeciones(){
    if(!this.seccionesPermitidas.acceso_simulador){
      this.rutaPaginaSim = true;
    }
    if(!this.seccionesPermitidas.acceso_incentivo){
      this.rutaPaginaIncen = true;
    }
  }

  public openPage(origin: string) {
    let nomina = String(localStorage.getItem('nomina'));

    let url = "";
    if (origin == 'I')
      url = 'https://vinculacion.gentera.com.mx:9088/sist_incen/login?Nomina='
    else
      url = 'https://vinculacion.gentera.com.mx:9088/sist_incen/loginSim?Nomina='
    nomina = nomina == '82245' ? 'NTM5NjM%3D' : btoa(nomina);
    url = url + nomina;
    window.open(url, "_self");

  }

}