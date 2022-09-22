import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fotoperfil-template',
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.css'],
})

export class FotoPerfilComponent implements OnInit {
  @Input() iconoPerfil: any;
  @Input() colorPerfil: any;
  @Input() noRedirect: boolean=true;
  @Input() opacity: boolean=false;
  
  
  borderColor = "";
  iconoDefault: boolean = false;
  seccionesPermitidas: any=[];

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.iconoPerfil == null || this.iconoPerfil == 'null' || this.iconoPerfil == 'foto' || this.iconoPerfil == '') {
     this.iconoDefault = true;
      
    }
    let color=this.colorPerfil!==undefined? this.colorPerfil : localStorage.getItem('colorperfil');
    this.borderColor = "4px solid " + (this.opacity? 'rgb(99 99 97)': color) ;
    this.configPage();
  }

  configPage(){
    this.seccionesPermitidas=JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  perfil(){
    if(this.seccionesPermitidas.mi_perfil && this.noRedirect){
      this.router.navigate(['/perfil']);
    }
  }

  setImagenPerfil(img:string){
    if(img=="")
      this.iconoDefault = true;
    else{
      this.iconoDefault=false;
      this.iconoPerfil=img;
    }
  }


}