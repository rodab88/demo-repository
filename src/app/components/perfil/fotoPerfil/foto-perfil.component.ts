import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'fotoperfil-template',
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.css'],
})

export class FotoPerfilComponent implements OnInit {
  @Input() iconoPerfil: any;
  @Input() iconoDefault: any;
  @Input() colorPerfil: any;
  @Input() noRedirect: boolean = true;
  @Input() opacity: boolean = false;


  borderColor = "";
  //iconoDefault: boolean = false;
  seccionesPermitidas: any = [];

  constructor(private router: Router, private services: Services) {
  }


  ngOnInit() {
    this.configPage();
    if (this.iconoDefault == undefined) {
      if (this.iconoPerfil == null || this.iconoPerfil == 'null' || this.iconoPerfil == 'foto' || this.iconoPerfil == '') {
        this.iconoDefault = true;
      }
    }
    let color = this.colorPerfil !== undefined ? this.colorPerfil : localStorage.getItem('colorperfil');
    this.borderColor = "4px solid " + (this.opacity ? 'rgb(99 99 97)' : color);
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  perfil() {
    if (this.seccionesPermitidas.mi_perfil && this.noRedirect) {
      this.services.analitica('irPerfil').subscribe();
      this.router.navigate(['/perfil']);
    }
  }

  setImagenPerfil(img: string) {
    if (img == "")
      this.iconoDefault = true;
    else {
      this.iconoDefault = false;
      this.iconoPerfil = img;
    }
  }

  update(iconoDefault:boolean, iconoPerfil: any, colorPerfil: string): void {
    this.iconoDefault=iconoDefault;
    this.iconoPerfil=iconoPerfil;
    this.colorPerfil=colorPerfil;
    if (this.iconoDefault == undefined) {
      if (this.iconoPerfil == null || this.iconoPerfil == 'null' || this.iconoPerfil == 'foto' || this.iconoPerfil == '') {
        this.iconoDefault = true;
      }
    }
    let color = this.colorPerfil !== undefined ? this.colorPerfil : localStorage.getItem('colorperfil');
    this.borderColor = "4px solid " + (this.opacity ? 'rgb(99 99 97)' : color);    
  }


}