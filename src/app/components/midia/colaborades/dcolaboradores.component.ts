import { Component, Input } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiDiaComponent } from '../midia.component';

@Component({
  selector: 'midia-colaborades',
  templateUrl: './dcolaboradores.component.html',
  styleUrls: ['./dcolaboradores.component.css'],
})
export class MiDiaColaboradoresComponent {
  showComponents: boolean = false;


  displayProgressSpinner = false;
  @Input() array: any;

  item:any;

  seleccionamenuCol: boolean = false;

  constructor(public services: Services, public midia: MiDiaComponent) { }

  activarMenuCol(item:any) {    
    this.item=item;
    this.seleccionamenuCol = !this.seleccionamenuCol;
  }

  nuevoperfil(){
    let colaboradores:any[]= JSON.parse(localStorage.getItem('colaboradores')!);
    let colab={"nominaColaborador": String(this.item.nomina), "nominaJefe": "", "nombreColaborador": this.item.nombre};
    colaboradores.push(colab);
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    this.midia.cargarDatos();
  }


}
