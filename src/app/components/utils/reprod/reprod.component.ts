import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-reprod',
  templateUrl: './reprod.component.html',
  styleUrls: ['./reprod.component.css']
})
export class ReprodComponent implements OnInit {
  // @Input() id: string ;
  public id: string  = 'sfQH0Z6ezSg';
  private player: any;
  public ytEvent: any;
  playerVars = {
    cc_lang_pref: 'en',
  };
  
  constructor() { 
    // this.id = 'sfQH0Z6ezSg'
  }

  ngOnInit(): void {
    console.log(this.id)
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

}
