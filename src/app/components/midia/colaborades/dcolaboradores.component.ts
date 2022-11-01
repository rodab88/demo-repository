import { Component, Input, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiDiaComponent } from '../midia.component';

@Component({
  selector: 'midia-colaborades',
  templateUrl: './dcolaboradores.component.html',
  styleUrls: ['./dcolaboradores.component.css'],
})
export class MiDiaColaboradoresComponent implements OnInit {
  showComponents: boolean = false;


  displayProgressSpinner = false;
  @Input() array: any;

  item: any;

  seleccionamenuCol: boolean = false;
  colorletra: string = "";
  
  constructor(public services: Services, public midia: MiDiaComponent) { }

  ngOnInit(): void {
    this.colorletra = localStorage.getItem('colorletra')!;
  }

  activarMenuCol(item: any) {
    this.item = item;
    this.seleccionamenuCol = !this.seleccionamenuCol;
  }

  nuevoperfil() {
    this.services.analitica('irPerfilMiDia').subscribe();
    let colaboradores: any[] = JSON.parse(localStorage.getItem('colaboradores')!);
    let colab = { "nominaColaborador": String(this.item.nomina), "nominaJefe": "", "nombreColaborador": this.item.nombre };
    colaboradores.push(colab);
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    this.midia.cargarDatos();
  }


}
