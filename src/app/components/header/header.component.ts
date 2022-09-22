import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'header-template',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderGeneralComponent implements OnInit {
  username: string = "";

  @Input() iconoPerfil = "";
  @Input() fechaHora = "";
  @Input() colorperfil = "";
  @Input() colorletra: string = "";
  @Input() meimpulsa: string = "";
  @Input() banner: string = "";
  @Input() nombre: string = "";

  borderColor = "";
  iconoDefault: boolean = false;
  seccionesPermitidas: any = [];

  ngOnInit() {
    if (this.iconoPerfil == "" || this.iconoPerfil == null || this.iconoPerfil == 'null') {
      this.iconoDefault = true;
    }
    this.getOnlyFirstName();
    this.borderColor = "4px solid " + this.colorperfil;
    this.configPage();
    this.meimpulsa = this.meimpulsa == null || this.meimpulsa == 'null' ? "" : this.meimpulsa;
  }

  configPage() {
    this.seccionesPermitidas = JSON.parse(String(localStorage.getItem("seccionesPermitidas")));
  }

  getOnlyFirstName() {
    let sUser = this.nombre.split(" ");
    this.username = sUser.length > 0 ? sUser[0] : "";
  }

}