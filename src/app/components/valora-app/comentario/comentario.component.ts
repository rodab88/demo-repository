import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit {

  starRatingCom = 0;
  comentario:string ="";
  colorletra:string="";
  @ViewChild('modal') modal: ElementRef | undefined;

  constructor(private matDialog: MatDialog, public services: Services,  private modalService: NgbModal, private router: Router) {  }

  ngOnInit():void{
    this.colorletra = localStorage.getItem('colorletra')!;
    let nomina = localStorage.getItem('nomina');
    let objenviar = {
      nomina: nomina
    }
    
    this.services.getComentariosCalifica(objenviar).subscribe(datos => {
      if (!datos.error) {
        this.starRatingCom = datos.data.valor;
        this.comentario = datos.data.comentario;
      }else{
        console.log("error, no hay datos que mostrar.");
      }
    });
  }

  enviar(){
    let nomina = localStorage.getItem('nomina');
    let objenviar = {
      nomina: nomina,
      valor: this.starRatingCom,
      comentario: this.comentario
    }
    this.services.postComentariosCalifica(objenviar).subscribe(datos => {
      if (!datos.error) {
        this.services.analitica('publicarComentarioValorar').subscribe();
        console.log("registro exitoso");
              //modal exito
              this.modalService.open(this.modal, {
                centered: true,
                size: 'sm',
                backdrop: 'static', 
                keyboard: false          
              });
              this.matDialog.closeAll();
      }else{
        console.log("error");
      }
    });
  }

  cancela(){
    this.comentario = "";
  }

  cerrar(): void{
    this.matDialog.closeAll();
  }
  
  cerrarModal(){
    this.modalService.dismissAll();
    window.location.reload();
}


}
