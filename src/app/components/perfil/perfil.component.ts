import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Services } from 'src/app/services/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FotoPerfilComponent } from './fotoPerfil/foto-perfil.component';
import { DesempenioComponent } from '../desempenio/desempenio.component';

@Component({
  selector: 'portada-template',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})

export class PerfilComponent implements OnInit {

  @ViewChild(FotoPerfilComponent, { static: false }) componentFoto: FotoPerfilComponent | undefined;
  @ViewChild(DesempenioComponent, { static: false }) desempenioComponent: DesempenioComponent | undefined;

  username: string = "";
  puesto: string = "";
  nomina: string = "";
  ubicacion: string = "";
  verificado: boolean = false;
  iconoPerfil: string = "";
  colorPerfil: string = "";

  meimpulsa: string = "";
  editImpulsa: boolean = false;
  urlClara = "";

  showHeader: boolean = false;
  borderColor = "";

  iconPerfil: string | ArrayBuffer = "";
  iconPortada: string | ArrayBuffer = "";

  nominaLogin: string = "";
  public envairDatosPer: any = [];
  public colaborador: boolean = true;
  public perfilCol: boolean = false;
  public iconoDefault: boolean = false;
  seccionesPermitidas: any = [];

  pleca: string = "";

  uploadForm!: FormGroup;
  colorletra: string = "";
  constructor(public services: Services, private router: Router, public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.colorletra = localStorage.getItem('colorletra')!;
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.iconoPerfil = localStorage.getItem('iconoPerfil')!;
    this.nominaLogin = String(localStorage.getItem('nomina'));
    this.getDatos();
    this.obtenerDatosPeril();
    this.configPage();

  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  validaPerfil() {
    if (localStorage.getItem('boolColaborador') == 'false') {
      this.colaborador = false;
    } else {
      this.colaborador = true;
    }
    this.obtenerDatosPeril();
  }

  getDatos() {
    this.urlClara = environment.urlClara;
  }

  openFilePortada() {
    if (this.nominaLogin == this.nomina) {
      console.log("Portada")
      let input = document.querySelector('.portada');
      if (input !== null && input !== undefined) {
        if (input instanceof HTMLElement) {
          input.click();
        }
      }
    }
  }

  openFilePerfil() {
    if (this.nominaLogin == this.nomina) {
      console.log("Perfil")
      let input = document.querySelector('.filePerfil');
      if (input !== null && input !== undefined) {
        if (input instanceof HTMLElement) {
          input.click();
        }
      }
    }
  }

  readPortada(e: any) {
    if (e.target.files.length > 0) {
      const file: File = e.target.files[0];

      const formData = new FormData();
      formData.append('nombre_archivo', file);
      formData.append('nomina', this.nomina);
      formData.append('tipo', '2'); // perfil
      this.updatePhoto(formData);
      this.services.analitica('actualizarFotoPortada').subscribe();

      let myReader: FileReader = new FileReader();
      myReader.onloadend = () => {
        console.log(myReader.result)
        this.iconPortada = myReader.result == null ? '' : myReader.result.toString();
      }
      myReader.readAsDataURL(file);
    }
  }

  readPerfil(e: any) {
    if (e.target.files.length > 0) {
      const file: File = e.target.files[0];

      const formData = new FormData();
      formData.append('nombre_archivo', file);
      formData.append('nomina', this.nomina);
      formData.append('tipo', '1'); // perfil
      this.updatePhoto(formData);
      this.services.analitica('actualizarFotoPerfil').subscribe();
      let myReader: FileReader = new FileReader();
      myReader.onloadend = () => {
        console.log(myReader.result)
        this.iconoPerfil = myReader.result == null ? '' : myReader.result.toString();
      }
      myReader.readAsDataURL(file);
    }
  }

  updatePhoto(formData: FormData) {
    this.services.updatePhoto(formData).subscribe(datos => {
      if (!datos.error) {
        this.obtenerDatosPeril(false)
      }
    });
  }

  public obtenerDatosPeril(actualizaFoto: boolean = true) {

    this.envairDatosPer = {
      "nomina": localStorage.getItem('nominaColaborador')
    }

    this.services.postDatosPerfil(this.envairDatosPer).subscribe(datos => {
      if (!datos.error) {
        this.nomina = datos.data.nomina;
        if (this.nomina != localStorage.getItem('nomina'))
          localStorage.setItem('nominaJefe', datos.data.nom_jefe);
        console.log(datos);
        this.puesto = datos.data.puesto;
        this.ubicacion = datos.data.ubicacion;
        this.verificado = datos.data.verificado;
        this.meimpulsa = datos.data.me_impulsa;
        this.username = datos.data.nombre;
        this.colorPerfil = datos.data.color_categoria;
        this.borderColor = "4px solid" + this.colorPerfil;
        this.pleca = datos.data.pleca;
        this.iconPortada = datos.data.portada;
        localStorage.setItem('imgenFondo', datos.data.pleca);
        if (actualizaFoto) {
          this.iconoPerfil = datos.data.foto;
          if (this.iconoPerfil == null || this.iconoPerfil == 'null' || this.iconoPerfil == 'foto' || this.iconoPerfil == '') {
            this.iconoDefault = true;
          } else {
            this.iconoDefault = false;
          }
        }
        this.componentFoto?.update(this.iconoDefault, this.iconoPerfil, this.colorPerfil);
        this.desempenioComponent?.categoria();
      }

    });
  }

  public obtenerDatosPerilColaborador() {
    if (this.colaborador) {
      this.envairDatosPer = {
        "nomina": localStorage.getItem('NominaColaborador')
      }
    } else {
      this.envairDatosPer = {
        "nomina": localStorage.getItem('NominaColaboradorFin')
      }
    }


    this.services.postDatosPerfil(this.envairDatosPer).subscribe(datos => {
      if (!datos.error) {
        console.log(datos);

        this.puesto = datos.data.puesto;
        this.ubicacion = datos.data.ubicacion;
        this.verificado = datos.data.verificado;
        this.meimpulsa = datos.data.me_impulsa;
        this.iconoPerfil = datos.data.foto;
        this.nomina = datos.data.nomina;
        this.username = datos.data.nombre;

        if (this.colaborador) {
          localStorage.setItem('nombre', datos.data.nombre);
          localStorage.setItem('iconoPerfil', datos.data.foto);
        }


      }
    });
  }

  updatePerfil(meimpulsa: string) {
    let objenviar = {
      "nomina": this.nomina,
      "me_impulsa": meimpulsa,
      "foto": ''
    }
    this.services.postActualizarPerfil(objenviar).subscribe(datos => {
      if (!datos.error) {
        console.log(datos);
      }
    });
  }

  activeImpulsa() {
    if (this.editImpulsa) {
      this.services.analitica('cambiarMeImpulsa').subscribe();
      this.updatePerfil(this.meimpulsa);
    }
    this.editImpulsa = !this.editImpulsa;
  }

  convertEmojiToText() {
    let message = ""
  }


}