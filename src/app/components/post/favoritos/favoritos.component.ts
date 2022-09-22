import { Component } from '@angular/core';
import { Post } from '../../../models/post'
import { CommonServiceService } from '../../../services/common.service'

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent {
  favoritos: Post[] = []
  showHeader: boolean = false;

  constructor(public s: CommonServiceService) {
    let body = {
      "empresa_id": 13 ,
      "nomina":  localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/favoritos/',body).subscribe((ok:any)=>{
      this.favoritos = ok.data.favoritos;
    })
  }

}
