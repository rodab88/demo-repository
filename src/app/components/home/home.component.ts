import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Empresa, Favorito, Post } from 'src/app/models/empresa';
import { Services } from 'src/app/services/services';
import { HomeRequest } from 'src/app/models/home-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    //  {provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }}
  ]
})
export class HomeComponent implements OnInit {
  showComponents: boolean = false;

  micompromiso = ''
  incentivo = '';
  colorprimario = '';
  colorsecundario: string = '';
  shadowCard = "";
  boxshadow = "";

  iconoPerfil = "";
  fechaHora = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  banner: string = "";
  nombre: string="";

  currentIndex = 0;

  steps = [{ status: false, class: "#E00000" }, { status: false, class: "#E05100" }, { status: false, class: "#E08600" },
  { status: false, class: "#E6CB3E" }, { status: false, class: "#BAAD35" }, { status: false, class: "#8AC60C" }, { status: false, class: "#6FA007" }];

  posts: Post[] = [];
  favoritosG: any = [];
  favoritos: Favorito[] = [];

  seccionesPermitidas: any = [];

  displayProgressSpinner = false;

  constructor(config: NgbCarouselConfig, public services: Services) {

    config.interval = 0;
    config.showNavigationIndicators = false;
    config.keyboard = true;
    config.pauseOnHover = false;
    config.showNavigationArrows = true;
  }


  ngOnInit(): void {
    this.showProgressSpinner(true);
    let nomina = localStorage.getItem('nomina');
    localStorage.setItem('nominaJefe','');    
    localStorage.setItem('nominaColaborador', String(nomina));
    this.getHomeInfo(parseInt(nomina ? nomina.toString() : ""));
    this.configPage();
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  getPropertiesHeader(e: Empresa) {
    this.colorletra = localStorage.getItem('colorletra')!;
    this.fechaHora = e.fecha_actualiza +" "+ e.hora_actualiza;
    this.banner = localStorage.getItem('banner')!;

    this.iconoPerfil =  localStorage.getItem('iconoPerfil')!;
    this.colorperfil = localStorage.getItem('colorperfil')!;
    this.meimpulsa = localStorage.getItem('meimpulsa')!;    
    this.nombre= localStorage.getItem('nombre')!;
  }

  getHomeInfo(nomina: number) {
    let req: HomeRequest = new HomeRequest;
    req.nomina = nomina;
    req.empresa_id = 13;    
    this.services.home(req).subscribe(
      res => {
        console.log(res);
        this.getPropertiesHeader(res.data);
        let colaboradores = [{"nominaColaborador": String(nomina), "nominaJefe": "", "nombreColaborador": res.data.nombre}];
        localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
        this.incentivo = this.formatearMontos(res.data.incentivo_al_dia);
        this.micompromiso = this.formatearMontos(res.data.mi_compromiso);
        this.posts = res.data.posts;
        this.colorprimario = res.data.color_primario;
        this.colorsecundario = localStorage.getItem('colorSecundario')!;
        this.favoritos = res.data.favoritos;
        this.currentIndex = res.data.semaforo_activo - 1;
        this.shadowCard = "1.5px solid " + this.colorsecundario + '70';
        this.boxshadow = "2px 2px 3px 3px " + this.colorsecundario + '50';
        this.changeFavoritos();
        this.setCurrentIndex();
        this.showComponents = true;
        this.showProgressSpinner(false);
      });
  }

  formatearMontos(monto: string) {
    return monto == "" ? "0" : monto;
  }

  setCurrentIndex() {
    for (let i = 0; i < this.steps.length; i++) {
      if (i < this.currentIndex + 1)
        this.steps[i].status = true;
      else
        this.steps[i].class = "#747474";
    }
  }

  changeFavoritos() {
    let iG = 0;
    console.log(this.favoritos.length)
    for (let i = 0; i < this.favoritos.length; i += 3) {
      let array: Favorito[] = [];
      for (let j = i; j < i + 3; j++) {
        if (this.favoritos[j] !== undefined) {
          array.push(this.favoritos[j]);
        }

      }
      this.favoritosG[iG] = array;
      iG = iG + 1;
    }
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }


}
