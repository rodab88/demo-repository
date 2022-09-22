import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common.service'
import { environment } from "src/environments/environment";
import { getMessaging, getToken } from "firebase/messaging";
import { AuthService } from 'src/app/services/auth.service';
import { Services } from 'src/app/services/services';

declare let $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],

})
export class AuthComponent implements OnInit {
  public myForm!: FormGroup;
  public usuarioObj: any;
  public objRespuestaLogin: any;
  public tamanio: number = 0;
  public avtivaBot: boolean = false;
  public error: string = '';
  public params: any = {};
  public nomina = 0;
  public sistema = ''
  public permisos: string = '';
  public seccionesPermitidas: any = [];

  displayProgressSpinner = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.tamanio = event.target.innerWidth;
  }


  constructor(private rute: ActivatedRoute, public formBuilder: FormBuilder, private routerPrd: Router, public auth: AuthService, public s: CommonServiceService,  public services: Services) {
    let obj = {};
    this.myForm = this.createMyForm(obj);
    this.params = this.rute.snapshot.queryParams;
    try {
      if (this.params['Sistema'] !== undefined) {

        let nominaEnc = this.params['Sistema'].toString().split('Nomina=')[1]
        let nomina3 = atob(nominaEnc), num = '';
        for (let i = 0; i <= nomina3.length; i++) {
          num = num + this.valNum(nomina3.substring(i, i + 1))
        }
        if (this.valNumber(num))
          this.nomina = parseInt(num);
        this.sistema = 'C'
      }else{
        this.nomina=Number(atob(this.params['Nomina']));
        this.sistema='G';
      }
    } catch { }
  }

  public valNumber(n: any): boolean {
    return Number(n) == n && isFinite(n);
  }

  valNum(x: any): string {
    let v=parseInt(x).toString() != 'NaN' ? parseInt(x).toString() : '';
    return this.valNumber(x) ? v : '';
  }

  ngOnInit(): void {
    this.showProgressSpinner(true);
    this.auth.SignOutInit();
    if (this.nomina > 0) {
      localStorage.setItem('nomina', this.nomina.toString());
      localStorage.setItem('sistema', this.sistema);
      this.configurarPermisos(this.nomina.toString());
    } else {
      this.showProgressSpinner(false);
    }
  }

  public createMyForm(_obj: any) {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public enviarformulario() {
    this.showProgressSpinner(true);
    this.myForm.value.username = this.myForm.value.username?.toLowerCase();
    let obj = this.myForm.value;
    let b64U = btoa(obj.username)
    let b64P = btoa(obj.password)

    let objEnviar = {
      Nombre: b64U,
      Password: b64P
    }

    this.auth.AuthLogin(objEnviar).subscribe(datos => {
      if (!datos.error) {
        localStorage.setItem('nombre', datos.data.Nombre);
        localStorage.setItem('nomina', datos.data.Nomina);
        localStorage.setItem('token', datos.data.token);
        this.services.getCalificacion().subscribe(promedio => {
          if (!promedio.error) {
            localStorage.setItem('promedio_app', promedio.data.promedio);
          }else{
            console.log("error, no hay datos que mostrar.");
          }
        });
        this.requestPermission(datos.data.Nomina);
        this.configurarPermisos(datos.data.Nomina);
      } else {
        this.showProgressSpinner(false);
        this.error = datos.message;
      }
    });
  }

  public mostrarContrasena() {

    let elemento: any = document.getElementById("txtPassword");
    let image: any = document.getElementById('imgContrasena');
    if (elemento.type == "password") {
      elemento.type = "text";
      $(image.innerHTML).attr('src', 'https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-10-256.png');
      $("#txtPassword").attr('type', 'text');
    } else {
      elemento.type = "password";
      $(image.innerHTML).attr('src', 'https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-09-256.png');
      $("#txtPassword").attr('type', 'password');
    }
  }

  public validaBoton() {
    if (this.myForm.value.username != '' && this.myForm.value.password != '') {
      this.avtivaBot = true;
    } else {
      this.avtivaBot = false;
    }
  }

  public get f() {
    return this.myForm.controls;
  }

  requestPermission(nomina: any) {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey }).then(
        (currentToken: any) => {
          if (currentToken) {
            let body = {
              "nomina": nomina,
              "empresa_id": 1,
              "token": currentToken
            }
            this.s.servicePost('si/suscripcion/', body).subscribe((resp: any) => {
              console.log(resp)
            })

          } else {
            console.log('No permisos.');
          }
        }).catch((err: any) => {
          console.log('Error: . ', err);
        });
  }

  configurarPermisos(nomina: string) {
    let body = {
      "Nomina": nomina
    }
    this.auth.permisos(body).subscribe(response => {
      console.log(response)
      if (!response.error) {
        let seccionesPermitidas = "{";
        response.data.secciones.forEach((s: { nombre: any; }) => {
          seccionesPermitidas += "\"" + s.nombre + "\": true,";
        });
        seccionesPermitidas = seccionesPermitidas.slice(0, -1)
        seccionesPermitidas += "}";
        localStorage.setItem("seccionesPermitidas", seccionesPermitidas);
        this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
        this.configTour(Number(nomina));
      }else{
        this.showProgressSpinner(false);
        this.permisos=response.message;
      }
    });
  }

  configTour(nomina: number){
    let obj = {
      "nomina": nomina,
      "empresa_id": 13
    }
    this.services.getTour(obj).subscribe(response => {
      this.showProgressSpinner(false);
      if(!response.error){
        if(this.seccionesPermitidas.tour){
          localStorage.setItem("tours", JSON.stringify(response.data));
          console.log(response);  
                
          this.routerPrd.navigate(['/tour']);
        }else{
          this.routerPrd.navigate(['/home']);
        }  
      }else{
        this.routerPrd.navigate(['/home']);
      }
    });
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }
}
