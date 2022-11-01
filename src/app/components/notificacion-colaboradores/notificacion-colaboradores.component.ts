import { Component } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';
import { AyudaComponent } from 'src/app/components/ayuda/ayuda.component';


@Component({
  selector: 'app-notificacion-colaboradores',
  templateUrl: './notificacion-colaboradores.component.html',
  styleUrls: ['./notificacion-colaboradores.component.css'],
})
export class NotificacionColaboradoresComponent {

  titulo: string = "";
  texto: string = "";
  audiencia: any[] = [];
  

  titulo_notificacion: string = "";
  texto_notificacion: string = "";

  constructor(private matDialog: MatDialog, public services: Services) {  }

  help(){
    this.matDialog.open(AyudaComponent, {
      width: '80%',
      height: '60%',
      autoFocus: false,
      disableClose: true
      // panelClass: 'custom-modalbox'
    });  
  }

  cerrarNotificacion(){
    this.matDialog.closeAll();
  }

  public envioNotificacion() {
    let nomina = localStorage.getItem('nominaColaboradorNotifica');
    let nomina2 = localStorage.getItem('nomina');
    let objenviar = {
      titulo: this.titulo_notificacion,
      texto: this.texto_notificacion,
      nomina: nomina2,
      audiencia: [nomina]
    }
    this.services.postNotificaColaboradorLiderazgo(objenviar).subscribe(datos => {
      if (!datos.error) {
        this.analitica('enviarMsjColaborador');
        console.log("notificación exitosa");
        this.cerrarNotificacion()

      }else{
        console.log("error al enviar la notificación");
      }
    });
  }

  analitica(selector: string){    
    this.services.analitica(selector).subscribe();
  }

}
