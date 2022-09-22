import { Component, OnInit, OnDestroy } from '@angular/core';
import { getMessaging, onMessage } from "firebase/messaging";
import { ToastService } from './toast-service';
import { environment } from "../environments/environment";
import { Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NameSystem } from './models/originEnum';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit, OnDestroy {
  message: any = null;

  showComponents: boolean = false;
  completo: boolean = true;
  logosi: string = "";
  labelBack: string = "";
  urlClara: string = "";
  iconoClara: string = "";
  hayNotificacion: boolean = false;
  colorsecundario: string = "";
  cerrar: string = "Cerrar Sesión";
  sistema: string = "";
  back: string = "home";
  promedio_app: string = "";

  isMenuOpen: boolean = false;
  seccionesPermitidas: any = [];

  displayProgressSpinner = false;
  // Display progress spinner for 3 secs on click of button  

  constructor(
    public toastService: ToastService, 
    private router: Router, 
    public auth: AuthService, 
    public homeservice: Services,
    ) { }

  ngOnInit(): void {
    this.listen();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url == "/error" || event.url == "/" || event.url =="/tour") {
          this.showProgressSpinner(false);
          this.showComponents = false;
        } else {
          this.setLabelSite(event.url);
          this.showProgressSpinner(true);
          this.configPage();
          this.configLogAuto();
          this.getDatosConfig();
          this.getDatosDinamicos();
        }
      }
    });
    
    this.promedio_app = String(localStorage.getItem('promedio_app'));
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  configLogAuto() {
    if(this.seccionesPermitidas.accesoLeyendaCerrar){
      if (localStorage.getItem('sistema') !== null &&
        localStorage.getItem('sistema') !== undefined) {
        //this.cerrar = "Regresar a";
        let id = String(localStorage.getItem('sistema'));
        this.sistema = NameSystem[id as keyof typeof NameSystem];
        //this.cerrar = "Regresar a " + this.sistema;
      }
    } 
  }

  listen() {
    try {
      const messaging = getMessaging();
      onMessage(messaging, (payload: any) => {
        this.message = payload;
        console.log(this.message.notification)
        let not = {
          title: this.message.notification.title,
          body: this.message.notification.body,
          image: this.message.notification.image
        }
        this.toastService.show(not);
      });
    } catch { }
  }

  cerraSesion() {
    if (this.cerrar == "Cerrar Sesión") {
      this.auth.SignOut();
    } else {
      this.sistema = "";
      this.cerrar = "Cerrar Sesión";
      this.auth.SignOut();
      window.location.replace('Compartamos en tus Manos://');
    }
  }

  valoraApp() {
    this.router.navigate(['/encuesta']);
  }


  ngOnDestroy(): void {
    this.isMenuOpen = false;
    this.toastService.clear();
  }

  onSidenavClick(): void {
    this.isMenuOpen = false;
  }

  setLabelSite(urlActual: string) {
    this.completo = urlActual.includes('home') ? true : false;
    this.showComponents = urlActual == '/' ? false : true;
    this.back = 'home';
    switch (urlActual) {
      case "/notificaciones":
        this.labelBack = "Notificaciones";
        break;
      case "/perfil":
        this.labelBack = "Mi Perfil";
        if (localStorage.getItem('nominaJefe') !== undefined && localStorage.getItem('nominaJefe') !== null
          && localStorage.getItem('nominaJefe') !== "") {
          localStorage.setItem('nominaColaborador', String(localStorage.getItem('nominaJefe')));
          if (localStorage.getItem('nominaJefe') == localStorage.getItem('nomina')) {
            this.back = 'home'
          } else {
            this.back = 'perfil';
          }
        }
        break;
      case "/variables":
        this.labelBack = "Mis Variables";
        break;
      case "/favoritos":
        this.labelBack = "Favoritos";
        break;
      case "/midia":
        this.labelBack = "Mi Día";
        break;
      case "/miincentivo":
        this.labelBack = "Mi Incentivo";
        break;
      case "/misimulador":
        this.labelBack = "Mi Simulador";
        break;
      case "/misretos":
        this.labelBack = "Mis Retos";
        break;
      case "/error":
        this.showProgressSpinner(false);
        break;
      case "/encuesta":
        this.labelBack="Reseñas";
        break;
      default:
        this.labelBack = "";
        break;
    }

  }

  getDatosConfig() {
    if (localStorage.getItem('logosi') == undefined || localStorage.getItem('logosi') == null) {
      let req = {
        "empresa_id": 13
      };
      this.homeservice.empresa(req).subscribe(datos => {
        if (!datos.error) {
          console.log(datos.data);
          localStorage.setItem('logosi', datos.data.iconosi);
          localStorage.setItem('iconoClara', datos.data.icono_clara);
          localStorage.setItem('colorsecundario', datos.data.color_secundario);
          localStorage.setItem('banner', datos.data.banner);
          localStorage.setItem('colorletra', datos.data.color_letra);
          this.setDatosFijos();
        }
      });
    } else {
      this.setDatosFijos();
    }
  }

  setDatosFijos() {
    this.logosi = localStorage.getItem('logosi') == null ? "" : localStorage.getItem('logosi')!;
    this.urlClara = environment.urlClara;
    this.iconoClara = localStorage.getItem('iconoClara') == null ? "" : localStorage.getItem('iconoClara')!;
    this.colorsecundario = localStorage.getItem('colorsecundario') == null ? "" : localStorage.getItem('colorsecundario')!;
    this.showProgressSpinner(false);
  }

  getDatosDinamicos() {
    let req = {
      "nomina": Number(localStorage.getItem('nomina')),
      "empresa_id": 13
    }
    this.homeservice.homeperfil(req).subscribe(datos => {
      if (!datos.error) {
        console.log(datos.data);
        this.hayNotificacion = datos.data.notificacion_nueva;
        localStorage.setItem('iconoPerfil', datos.data.icono_perfil);
        localStorage.setItem('meimpulsa', datos.data.me_impulsa);
        localStorage.setItem('colorperfil', datos.data.color_categoria);
        localStorage.setItem('meimpulsa', datos.data.me_impulsa);
        localStorage.setItem('nombre', datos.data.nombre);
      }
      this.showProgressSpinner(false);
    });

  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
    this.isMenuOpen = false;
  }
}
