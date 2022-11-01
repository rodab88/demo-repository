import { Component } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';
import { AyudaComponent } from 'src/app/components/ayuda/ayuda.component';


@Component({
  selector: 'app-notificacion-liderazgo',
  templateUrl: './notificacion-liderazgo.component.html',
  styleUrls: ['./notificacion-liderazgo.component.css']
})
export class NotificacionLiderazgoComponent {

  titulo: string = "";
  texto: string = "";
  audiencia: any[] = [];
  

  titulo_notificacion: string = "";
  texto_notificacion: string = "";


  constructor(private matDialog: MatDialog, public services: Services) { }

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
    let nomina = localStorage.getItem('nominaColaboradorLiderazgo');
    let nomina2 = localStorage.getItem('nomina');
    let objenviar = {
      titulo: this.titulo_notificacion,
      texto: this.texto_notificacion,
      nomina: nomina2,
      audiencia: [nomina]
    }
    this.services.postNotificaColaboradorLiderazgo(objenviar).subscribe(datos => {
      if (!datos.error) {
        console.log("notificación exitosa");
        this.services.analitica('enviarMsjIncentivo').subscribe();
        this.cerrarNotificacion()

      }else{
        console.log("error al enviar la notificación");
      }
    });
  }

}
