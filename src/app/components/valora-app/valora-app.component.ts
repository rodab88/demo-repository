import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from 'src/app/models/empresa';
import { Services } from 'src/app/services/services';
import { CommonServiceService } from 'src/app/services/common.service';
import { HomeRequest } from 'src/app/models/home-request';
import { ComentarioComponent } from 'src/app/components/valora-app/comentario/comentario.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-valora-app',
  templateUrl: './valora-app.component.html',
  styleUrls: ['./valora-app.component.css']
})
export class ValoraAppComponent implements OnInit {

  @Input() opacity: boolean = false;
  @Input() comentario: any = [];

  showComponents: boolean = false;
  iconoPerfil = "";
  fechaHora = "";
  colorperfil = "";
  colorletra: string = "";
  meimpulsa: string = "";
  banner: string = "";
  nombre_user: string = "";
  nombre_com: string = "";
  colorprimario = '';
  colorsecundario: string = '';
  shadowCard = "";
  boxshadow = "";
  displayProgressSpinner = false;
  starRatingCom = 5;
  seccionesPermitidas: any = [];
  comentarios: any = [];
  comentarios_conv: any = [];
  borderColor = "";
  valor1: any;
  valor2: any;
  valor3: any;
  valor4: any;
  valor5: any;
  promedio: number = 0;
  total: number = 0;
  index: number = 0;
  coment: any;
  estrellas: any[] = [];

  constructor(public services: Services, public s: CommonServiceService, private matDialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    /** perfil */
    let nomina = localStorage.getItem('nomina');
    localStorage.setItem('nominaJefe', '');
    localStorage.setItem('nominaColaborador', String(nomina));
    this.getHomeInfo(parseInt(nomina ? nomina.toString() : ""));
    /***calificacion */
    this.services.getCalificacion().subscribe(datos => {
      if (!datos.error) {
        this.valor1 = datos.data.uno;
        this.valor2 = datos.data.dos;
        this.valor3 = datos.data.tres;
        this.valor4 = datos.data.cuatro;
        this.valor5 = datos.data.cinco;
        this.promedio = datos.data.promedio;
        this.total = datos.data.total;

        for (let i = 0; i < 5; i++) {
          let decimal = this.promedio % 1;
          let entero = this.promedio - decimal;
          let ruta = "/assets/img/";
          ruta = ruta + (i < entero ? "fill" : (entero == i && decimal > 0 ? (decimal > 0.5 ? "cfill" : "half") : "empty")) + "_star.png";
          this.estrellas.push({ ruta: ruta });
        }
      } else {
        console.log("error, no hay datos que mostrar.");
      }
    });
    let body = {
      "nomina": nomina,
    }
    /*** comentarios */
    this.services.getComentariosApp(body).subscribe(datos => {
      this.setComentarios(datos);
    });
  }


  getPropertiesHeader(e: Empresa) {
    localStorage.setItem('iconoPerfil', e.icono_perfil);
    localStorage.setItem('colorperfil', e.color_categoria);
    localStorage.setItem('colorletra', e.color_letra);
    localStorage.setItem('meimpulsa', e.me_impulsa);
    localStorage.setItem('nombre', e.nombre);
    this.iconoPerfil = e.icono_perfil;
    this.fechaHora = e.fecha_actualiza + " " + e.hora_actualiza;
    this.colorperfil = e.color_categoria;
    this.colorletra = e.color_letra;
    this.meimpulsa = e.me_impulsa;
    this.banner = e.banner;
    let sUser = e.nombre.split(" ");
    this.nombre_user = sUser.length > 0 ? sUser[0] : "";
    this.nombre_com = e.nombre;
  }

  getHomeInfo(nomina: number) {
    let req: HomeRequest = new HomeRequest;
    req.nomina = nomina;
    req.empresa_id = 13;
    this.showProgressSpinner(true);
    this.services.home(req).subscribe(
      res => {
        this.getPropertiesHeader(res.data);
        this.colorprimario = res.data.color_primario;
        this.colorsecundario = res.data.color_secundario;
        localStorage.setItem('colorSecundario', res.data.color_secundario);
        this.shadowCard = "1.5px solid " + this.colorsecundario + '70';
        this.boxshadow = "2px 2px 3px 3px " + this.colorsecundario + '50';
        this.showComponents = true;
        this.showProgressSpinner(false);
      });
  }

  abreModalComentario() {
    this.matDialog.open(ComentarioComponent, {
      width: '100%',
      height: '80%',
      autoFocus: false
      // panelClass: 'custom-modalbox'
    });
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

  /** Para el megusta - nomegusta */

  megustaComentario(id: number) {
    let body = {
      "comentario_id": id,
      "nomina": localStorage.getItem('nomina')
    }
    this.services.analitica('megustaComentarioValorar').subscribe();
    this.megustaNomegusta('si/calificacion/megusta/', body);
  }

  nomegustaComentario(id: number) {
    let body = {
      "comentario_id": id,
      "nomina": localStorage.getItem('nomina')
    }
    this.services.analitica('nomegustaComentarioValorar').subscribe();
    this.megustaNomegusta('si/calificacion/nomegusta/', body);
  }

  megustaNomegusta(service: string, body: any) {
    this.s.servicePost(service, body).subscribe((ok: any) => {
      if (!ok.error) {
        console.log(ok);
        this.comentario.me_gusta = ok.data.me_gusta;
        this.comentario.no_megusta = ok.data.no_megusta;
        this.comentario.total_megusta = ok.data.total_me_gusta;
        this.comentario.total_no_megusta = ok.data.total_no_megusta;
        let bodysrv = {
          "nomina": ok.data.nomina,
        }
        this.services.getComentariosApp(bodysrv).subscribe(datos => {
          this.setComentarios(datos);
        });
      }
    })
  }

  setComentarios(datos: any) {
    if (!datos.error) {
      this.comentarios = datos.data;
      this.comentarios_conv = Object.values(this.comentarios.calificaciones)
    } else {
      console.log("error, no hay datos que mostrar.");
    }
  }

}
