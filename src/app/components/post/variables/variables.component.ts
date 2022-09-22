import { Component, OnInit } from '@angular/core';
import { Post } from '../../../models/post'
import { CommonServiceService } from '../../../services/common.service'

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.css']
})
export class VariablesComponent implements OnInit {
  planes: Post[] = []
  campanias: Post[] = []
  podcasts: Post[] = []
  showHeader: boolean = false;

  seccionesPermitidas: any=[];

  constructor(public s: CommonServiceService) {

    let body = {
      "empresa_id": 13 ,
      "nomina":  localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/variables/',body).subscribe((ok:any)=>{
      this.planes = ok.data.planes;
      this.campanias = ok.data.campanias;
      this.podcasts = ok.data.podcast;
    })
  }

  ngOnInit(): void {
    this.configPage();
  }

  configPage(){
    this.seccionesPermitidas=JSON.parse(String(localStorage.getItem("seccionesPermitidas")));        
  }

}
