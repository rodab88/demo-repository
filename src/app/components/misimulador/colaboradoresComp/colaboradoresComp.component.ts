import { Component, Input, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiSimuladorComponent } from '../misimulador.component';

@Component({
  selector: 'colaboradoresComp-template',
  templateUrl: './colaboradoresComp.component.html',
  styleUrls: ['./colaboradoresComp.component.css'],
})
export class MiSimuladorCopromisoComponent implements OnInit {
  showComponents: boolean = false;


  displayProgressSpinner = false;
  @Input() array: any;

  item:any;
  public actual: any = [];
  public historial: any = [];
  public activaActual: boolean = false;
  public activaHist: boolean = false;
  seleccionamenuCol: boolean = false;

  constructor(public services: Services, public miSimulador: MiSimuladorComponent) { }


  ngOnInit(): void {
    this.datosColaboradores(String(localStorage.getItem('nomina')));
  }

  activarMenuCol(item:any) {    
    this.item=item;
    this.seleccionamenuCol = !this.seleccionamenuCol;
  }

  nuevoperfil(){
    let colaboradores:any[]= JSON.parse(localStorage.getItem('colaboradores')!);
    let colab={"nominaColaborador": String(this.item.nomina), "nominaJefe": "", "nombreColaborador": this.item.nombre};
    colaboradores.push(colab);
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    this.miSimulador.cargarDatos();
  }

  public datosColaboradores(nomina: string) {
    let objEquipo: any = {
      nomina: nomina
    }
    this.services.postCompromisoHistorial(objEquipo).subscribe(datos=>{
      if(datos!==undefined){
        this.actual = datos.data.actual;
        this.historial = datos.data.historial;
        if(this.historial.length > 0){
          this.activaHist = true;
        }
        if(this.actual.length > 0){
          this.activaActual = true;
        }
      }
    });
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

}
