import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'footer-template',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})

export class FooterComponent implements OnChanges {
  @Input() color: string = '';

  seccionesPermitidas: any = [];
  numcol = 4;
  menuactivo: number = 0;

  public rutaPaginaSim: boolean = false;
  public rutaPaginaIncen: boolean = false;

  constructor(private router: Router, private services: Services) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.configPage();
    this.validaSeciones();
    this.menuactivo = Number(localStorage.getItem("activa")!);
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

  public validaSeciones() {
    if (!this.seccionesPermitidas.acceso_simulador) {
      this.rutaPaginaSim = true;
    }
    if (!this.seccionesPermitidas.acceso_incentivo) {
      this.rutaPaginaIncen = true;
    }
  }

  public valida(opc: any) {
    let url = "";
    let urlToNavigate = "";
    switch (opc) {
      case 1:
        this.services.analitica('irVariables').subscribe();
        this.menuactivo=1;
        urlToNavigate = "/variables";
        break;
      case 2:
        this.services.analitica('irMiIncentivo').subscribe();
        this.menuactivo=2;
        if (this.seccionesPermitidas.acceso_incentivo) {
          localStorage.removeItem('colaboradores');
          let colaboradores = [{ "nominaColaborador": localStorage.getItem('nomina')!, "nominaJefe": "", "nombreColaborador": localStorage.getItem('nombre')! }];
          localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
          urlToNavigate = "/miincentivo";
        }
        else
          url = 'https://vinculacion.gentera.com.mx:9088/sist_incen/login?Nomina='
        break;
      case 3:
        this.menuactivo=3;
        this.services.analitica('irMiSimulador').subscribe();
        if (this.seccionesPermitidas.acceso_simulador) {
          localStorage.removeItem('colaboradores');
          let colaboradores = [{ "nominaColaborador": localStorage.getItem('nomina')!, "nominaJefe": "", "nombreColaborador": localStorage.getItem('nombre')! }];
          localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
          urlToNavigate = "/misimulador";
        }
        else
          url = 'https://vinculacion.gentera.com.mx:9088/sist_incen/loginSim?Nomina='
        break;
      case 4:
        this.services.analitica('irMisRetos').subscribe();
        this.menuactivo=4;
        urlToNavigate = "/misretos";
        break;
    }
    console.log("valida: " + opc);
    if (url !== "") {
      let nomina = String(localStorage.getItem('nomina'));
      nomina = nomina == '82245' ? 'NTM5NjM%3D' : btoa(nomina);
      url = url + nomina;
      window.open(url, "_self");
    }
    localStorage.setItem('activa', this.menuactivo.toString());
    if (urlToNavigate !== "") {
      this.router.navigate([urlToNavigate]);
    }
  }

}