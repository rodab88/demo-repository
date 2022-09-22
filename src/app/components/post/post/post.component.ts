import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { Post } from '../../../models/post'
import { CommonServiceService } from '../../../services/common.service'
import { MatDialog } from '@angular/material/dialog';
import { ShareComponent } from '../share/share.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public _favorito: string;

  playerVars = {
    cc_lang_pref: 'en',
  };
  public id: string = "";
  public id_youtube: string = "";
  public urlYou: any;
  private player: any;
  public ytEvent: any;

  showComentario: boolean = false;

  noComentarios: number = 0;
  comentariosIn: any = [];
  comentario: string = "";

  @Input() data: Post = {
    fecha_publicacion: new Date().toString(),
    post_id: 0
  };

  constructor(public s: CommonServiceService, private sanitizer: DomSanitizer, public dialog: MatDialog) {
    this._favorito = this.data.favoritos == null ? "0" : this.data.favoritos;
  }

  ngOnInit(): void {
    this._favorito = this.data.favoritos == null ? "0" : this.data.favoritos;
    try {

      this.id_youtube = (this.data.accion != undefined && this.data.accion != "") ? this.data.accion.split('v=')[1].split('&')[0] : "";
      // this.urlYou = 'https://www.youtube.com/embed/'+this.id_youtube+'?cc_lang_pref=en&amp;origin=http%3A%2F%2Flocalhost%3A4200;enablejsapi=1&amp;&amp;widgetid=1'

      let url = 'https://www.youtube.com/embed/' + this.id_youtube
      this.urlYou = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log(this.urlYou)
    }
    catch { }
  }


  getComentarios() {
    let body = {
      "post_id": this.data.post_id,
      "nomina": localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/comentarios/', body).subscribe((ok: any) => {
      if (!ok.error) {
        console.log(ok);
        this.getRespuestas(ok.data);
        this.noComentarios = this.comentariosIn.length;
      }

    })
  }

  getRespuestas(allcomments: any[]) {
    let comments = allcomments.filter(x => x.id_respuesta == null || x.id_respuesta == 0);
    comments.forEach(c => {
      c.respuestas = allcomments.filter((x => x.id_respuesta == c.id));
    });
    this.comentariosIn = comments;
  }

  abreAccion() {
    console.log(this.data.accion)
    window.open(this.data.accion, "_blank");
  }

  
  abreArchivo() {
    console.log(this.data.url)
    window.open(this.data.url, "_blank");
  }

  postComentarios() {
    if (this.comentario !== "") {
      let body = {
        "post_id": this.data.post_id,
        "nomina": localStorage.getItem('nomina'),
        "nombre": localStorage.getItem('nombre'),
        "comentario": this.comentario
      }
      this.s.servicePost('si/comentario/', body).subscribe((ok: any) => {
        if (!ok.error) {
          console.log(ok);
          this.getComentarios();
          this.comentario = "";
        }

      })
    }
  }

  marca() {
    if (this._favorito == "0") this._favorito = "1";
    else this._favorito = "0";
    let body = {
      "post_id": this.data.post_id,
      "nomina": localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/favorito/', body).subscribe((ok: any) => {
      console.log(ok)

    })
  }

  me_gusta() {
    let body = {
      "post_id": this.data.post_id,
      "nomina": localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/megusta/', body).subscribe((ok: any) => {
      console.log(ok)
      this.data.me_gusta = !this.data.me_gusta
      if (this.data.me_gusta) this.data.no_megusta = false;
    })
  }

  no_me_gusta() {
    let body = {
      "post_id": this.data.post_id,
      "nomina": localStorage.getItem('nomina'),
    }
    this.s.servicePost('si/nomegusta/', body).subscribe((ok: any) => {
      console.log(ok)
      this.data.no_megusta = !this.data.no_megusta
      if (this.data.no_megusta) this.data.me_gusta = false;
    })
  }

  mostrarComentario() {
    this.showComentario = !this.showComentario;
    if (this.showComentario)
      this.getComentarios();
  }

  onStateChange(event: any) {
    this.ytEvent = event.data;
  }
  savePlayer(player: any) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  openShareModal() {
    const dialogRef = this.dialog.open(ShareComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}
