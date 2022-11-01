import { Component, OnInit, Input } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],

})
export class RankingComponent implements OnInit {

  showComponents: boolean = false;

  iconoPerfil = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  nombre: string = "";

  seccionesPermitidas: any = [];

  displayProgressSpinner = false;
  public resumenReto: boolean = false;
  public cardReto: boolean = false;
  public arreglo: any = [];
  public mosOrdenar: boolean = false;
  public mosFiltrar: boolean = false;
  public arregloPuestos: any = [];
  public colorFiltroProM: string = '';
  public colorFiltroProMa: string = '';
  public colorFiltroGeM: string = '';
  public colorFiltroGeMa: string = '';
  public colorFiltroGaM: string = '';
  public colorFiltroGaMa: string = '';
  public colorFiltro: string = '';
  public colorOrden: string = '';
  public arregloIni: any = [];
  public arregloFil: any = [];
  public filtroranking: string = '';
  public categoriaSelected = new FormControl('');

  constructor(public services: Services, private router: Router) { }


  ngOnInit(): void {
    this.colorletra = localStorage.getItem('colorletra')!;
    this.arreglo = JSON.parse(String(localStorage.getItem("ranking")));
    this.configPage();
    this.getPropertiesHeader();
    this.cargarDatos();
    this.modificaArreglo();
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
    this.showComponents = true;
    this.showProgressSpinner(false);
    this.arregloIni = this.arreglo;
  }

  public modificaArreglo() {
    let contador = 0;
    this.arreglo.forEach((_e: any) => {
      if (_e.categoria) {
        _e.categoria = _e.categoria.toUpperCase();
      }
      if (_e.orden == 1) {
        _e.colorNombre = this.colorletra;
      } else {
        _e.colorNombre = '#000000';
      }
      if (_e.puesto) {
        //if(this.arregloPuestos.length <= 0){

        if (this.arregloPuestos.length == 0 || (this.arregloPuestos.findIndex((x: any) => x.puesto === _e.puesto)) == -1) {
          contador = contador + 1;
          let obj: any = {
            puesto: _e.puesto,
            id: contador,
            status: false
          }
          this.arregloPuestos.push(obj);
        }
        /*else{
        this.arregloPuestos.forEach((_puesto: any) => {
          if(!_puesto.puesto.includes( _e.puesto )){
            contador = contador +1;
            let obj: any ={
              puesto : _e.puesto,
              id : contador
            }
          this.arregloPuestos.push(obj);

        }
        });
      }  */
      }
    });
  }

  public filtrar() {
    if (!this.mosFiltrar) {
      this.mosFiltrar = true;
      this.mosOrdenar = false;
      this.colorOrden = ''
      this.colorFiltro = 'rgba(217, 217, 217, 0.31)'
    } else {
      this.mosFiltrar = false;
      this.colorFiltro = ''
     // this.arregloFil = [];

    }
  }

  public perfil(obj: any) {
    localStorage.setItem('nominaColaborador', obj.nomina);
    this.services.analitica('irPerfilRanking').subscribe();
    this.router.navigate(['/perfil']);
  }


  public ordenar() {
    if (!this.mosOrdenar) {
      this.mosOrdenar = true;
      this.mosFiltrar = false;
      this.colorFiltro = ''
      this.colorOrden = 'rgba(217, 217, 217, 0.31)'
    } else {
      this.mosOrdenar = false;
      this.colorOrden = ''

    }
  }

  public filtrarPuesto(obj: any) {
    const allCheckBoxes = document.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
    allCheckBoxes.forEach(checkBox => {
      if (checkBox.checked && checkBox.id == ("checkbox-"+obj.id)) {
        obj.status = true;
        this.arregloIni.forEach((_puesto: any) => {
          if (_puesto.puesto.includes(obj.puesto)) {
            this.arregloFil.push(_puesto);
          }

        });

      } else if (!checkBox.checked && checkBox.id == ("checkbox-"+obj.id)) {
        obj.status = false;
        this.arregloFil = [];
        this.arreglo.forEach((_puestoFal: any) => {
          if (_puestoFal.puesto !== obj.puesto) {
            this.arregloFil.push(_puestoFal);
          }

        });
      }

      this.arreglo = this.arregloFil;
    });
  }

  public ordenarLista(obj: any) {

    if (obj == 1) {
      this.colorFiltroProM = '#006699'; this.colorFiltroProMa = ''; this.colorFiltroGeM = ''; this.colorFiltroGeMa = ''; this.colorFiltroGaM = ''; this.colorFiltroGaMa = '';
      this.arreglo.sort((a: any, b: any) => {

        if (a.incentivo_prom > b.incentivo_prom) {
          return -1;
        }
        if (a.incentivo_prom < b.incentivo_prom) {
          return 1;
        }
        return 0;
      });
    } else if (obj == 2) {
      this.colorFiltroProM = ''; this.colorFiltroProMa = '#006699'; this.colorFiltroGeM = ''; this.colorFiltroGeMa = ''; this.colorFiltroGaM = ''; this.colorFiltroGaMa = '';
      this.arreglo.sort((a: any, b: any) => {

        if (a.incentivo_prom < b.incentivo_prom) {
          return -1;
        }
        if (a.incentivo_prom > b.incentivo_prom) {
          return 1;
        }
        return 0;
      });
    } else if (obj == 3) {
      this.colorFiltroProM = ''; this.colorFiltroProMa = ''; this.colorFiltroGeM = '#006699'; this.colorFiltroGeMa = ''; this.colorFiltroGaM = ''; this.colorFiltroGaMa = '';
      this.arreglo.sort((a: any, b: any) => {

        if (a.num_incentivos > b.num_incentivos) {
          return -1;
        }
        if (a.num_incentivos < b.num_incentivos) {
          return 1;
        }
        return 0;
      });
    } else if (obj == 4) {
      this.colorFiltroProM = ''; this.colorFiltroProMa = ''; this.colorFiltroGeM = ''; this.colorFiltroGeMa = '#006699'; this.colorFiltroGaM = ''; this.colorFiltroGaMa = '';
      this.arreglo.sort((a: any, b: any) => {

        if (a.num_incentivos < b.num_incentivos) {
          return -1;
        }
        if (a.num_incentivos > b.num_incentivos) {
          return 1;
        }
        return 0;
      });
    } else if (obj == 5) {
      this.colorFiltroProM = ''; this.colorFiltroProMa = ''; this.colorFiltroGeM = ''; this.colorFiltroGeMa = ''; this.colorFiltroGaM = '#006699'; this.colorFiltroGaMa = '';
      this.arreglo.sort((a: any, b: any) => {

        if (a.retos_ganados > b.retos_ganados) {
          return -1;
        }
        if (a.retos_ganados < b.retos_ganados) {
          return 1;
        }
        return 0;
      });
    } else if (obj == 6) {
      this.colorFiltroProM = ''; this.colorFiltroProMa = ''; this.colorFiltroGeM = ''; this.colorFiltroGeMa = ''; this.colorFiltroGaM = ''; this.colorFiltroGaMa = '#006699';
      this.arreglo.sort((a: any, b: any) => {

        if (a.retos_ganados < b.retos_ganados) {
          return -1;
        }
        if (a.retos_ganados > b.retos_ganados) {
          return 1;
        }
        return 0;
      });
    }


  }

}
