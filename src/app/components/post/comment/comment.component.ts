import { Component, Input } from '@angular/core';
import { Services } from 'src/app/services/services';
import { CommonServiceService } from '../../../services/common.service'


@Component({
  selector: 'comment-template',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  showComentarios: boolean = false;
  respuesta: string = "";
  @Input() comentario: any = [];
  @Input() postid: number = 0;
  @Input() respuestas: boolean = false;

  constructor(public s: CommonServiceService, private services: Services) { }

  megustaComentario(id: number) {
    let body = {
      "comentario_id": id,
      "nomina": localStorage.getItem('nomina')
    }
    this.services.analitica('megustaComentarioPost').subscribe();
    this.megustaNomegusta('si/comentario/megusta/', body);
  }

  nomegustaComentario(id: number) {
    let body = {
      "comentario_id": id,
      "nomina": localStorage.getItem('nomina')
    }
    this.services.analitica('nomegustaComentarioPost').subscribe();
    this.megustaNomegusta('si/comentario/nomegusta/', body);
  }

  megustaNomegusta(service: string, body: any) {
    this.s.servicePost(service, body).subscribe((ok: any) => {
      if (!ok.error) {
        console.log(ok);
        this.comentario.me_gusta = ok.data.me_gusta;
        this.comentario.no_megusta = ok.data.no_megusta;
        this.comentario.total_megusta = ok.data.total_me_gusta;
        this.comentario.total_no_megusta = ok.data.total_no_megusta;
      }

    })
  }

  mostrarComentarios() {
    this.showComentarios = !this.showComentarios;
  }

  postComentarios() {
    if (this.respuesta !== "") {
      let body = {
        "post_id": this.postid,
        "nomina": localStorage.getItem('nomina'),
        "nombre": localStorage.getItem('nombre'),
        "id_respuesta": this.comentario.id,
        "comentario": this.respuesta
      }
      this.s.servicePost('si/comentario/', body).subscribe((ok: any) => {
        if (!ok.error) {
          this.services.analitica('publicarComentarioPost').subscribe();
          console.log(ok);
          this.respuesta = "";
          this.getComentario();
        }

      })
    }
  }

  getComentario() {
    let body = {
      "post_id": this.postid,
      "nomina": localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/comentarios/', body).subscribe((ok: any) => {
      if (!ok.error) {
        console.log(ok);
        this.getRespuestas(ok.data);
      }

    })
  }

  getRespuestas(allcomments: any[]) {
    this.comentario.respuestas = allcomments.filter((x => x.id_respuesta == this.comentario.id));
  }

}
