import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mode:number=45;

  constructor(private platform: Platform,private router: Router) {}

  exit(){
    (navigator as any)['app'].exitApp();   
  }

  isMobilePlatform():boolean{
    return this.platform.is('android') || this.platform.is('ios');
  }
  onGameModeChange(event:any){
    if(event && event.detail && event.detail.value){
      this.mode = event.detail.value;
    }    
  }
  startGame(){
    this.router.navigate(['/play-zone', this.mode]);
  }
}
