import { Component, Input } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiIncentivoComponent } from '../miincentivo.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionLiderazgoComponent } from 'src/app/components/notificacion-liderazgo/notificacion-liderazgo.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'miincentivo-colaborades',
  templateUrl: './icolaboradores.component.html',
  styleUrls: ['./icolaboradores.component.css'],
})
export class MiIncentivoColaboradoresComponent {
  showComponents: boolean = false;


  displayProgressSpinner = false;
  @Input() array: any;

  item:any;
  user: string = "";

  seleccionamenuCol: boolean = false;

  constructor(public services: Services, public miIncentivo: MiIncentivoComponent, private matDialog: MatDialog, public auth: AuthService) { }

  activarMenuCol(item:any) {    
    this.item=item;
    this.seleccionamenuCol = !this.seleccionamenuCol;
  }

  nuevoperfil(){
    let colaboradores:any[]= JSON.parse(localStorage.getItem('colaboradores')!);
    let colab={"nominaColaborador": String(this.item.nomina), "nominaJefe": "", "nombreColaborador": this.item.nombre};
    colaboradores.push(colab);
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    this.miIncentivo.cargarDatos();
  }

    //Para notificaciones al colaborador

    modalNotificacion(){
      this.seleccionamenuCol= false;
      localStorage.setItem('nominaColaboradorLiderazgo', String(this.item.nomina))
      this.matDialog.open(NotificacionLiderazgoComponent, {
        width: '80%',
        height: '60%',
        autoFocus: false,
        disableClose: true
        // panelClass: 'custom-modalbox'
      });
    }
  
  //Para abrir chat de Teams

  chatTeams(){
    this.seleccionamenuCol= false;
    let nominaTipo = {
      "nominas": [String(this.item.nomina)]
    }
    //Mandar a llamar un segundo servicio para obtener el ID de la empresa para la url de TEAMS
      this.auth.idTipoEmpresa(nominaTipo).subscribe(resp => {
        if(resp[0].empresaId == 1){
         this.user = resp[0].nombreUsuario+"@gentera.com.mx";
        }else if(resp[0].empresaId == 4){
         this.user = resp[0].nombreUsuario+"@compartamos.com";
        }
        window.open(environment.urlTeams+this.user)
      });
  }

}
