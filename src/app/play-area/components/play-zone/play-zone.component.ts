import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Complexity } from '../../services/sudoku-board-generator.service';
import { AlertController, IonMenu, IonModal, Platform } from '@ionic/angular';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { EventName, GameEvent } from '../../models/game-event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play-zone',
  templateUrl: './play-zone.component.html',
  styleUrls: ['./play-zone.component.scss'],
})
export class PlayZoneComponent implements OnInit, OnDestroy {
  isActionSheetOpen = false;
  gameEventSubscription: Subscription|undefined;
  gameComplexity:string|undefined;
  time: string = '00:00';
  timer: any;
  seconds: number = 0;

  @ViewChild(IonModal) modal: IonModal|undefined;
  @ViewChild(IonMenu) menu: IonMenu|undefined;
  public actionSheetButtons = [
    {
      text: 'Easy',
      data: {
        action: Complexity.Easy,
      },
    },
    {
      text: 'Medium',
      data: {
        action: Complexity.Medium,
      },
    },
    {
      text: 'Hard',
      data: {
        action: Complexity.Hard,
      },
    },
    {
      text: 'Master',
      data: {
        action: Complexity.Master,
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  constructor(private platform: Platform,
    private gameEventNotifierService: GameEventNotifierService,
    private alertController: AlertController) { 
      this.startTimer();
      this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
        if(event){
          switch(event.name){
            case EventName.NewGame:
              if(event.data){
                this.gameComplexity = Complexity[event.data];
                this.startTimer();
              }
              break;
            case EventName.GameOver:
              this.markGameOver();
              break;
          }
        }
      });
    }

  ngOnInit() { 
    this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.NewGame,Complexity.Master));
  }

  ngOnDestroy() { 
	  if (this.gameEventSubscription) {
      this.gameEventSubscription.unsubscribe();
    }
  }

  showNewGameOptions(){
    this.isActionSheetOpen = true;
  }

  startNewGame(event:any) {
    this.isActionSheetOpen = false;
    if(event.detail.data != undefined && event.detail.data.action != undefined && event.detail.data.action != "cancel"){
      console.log(event.detail.data.action);
      this.presentConfirmAlert(new GameEvent(EventName.NewGame, event.detail.data.action),"Current game progress will be lost. Are you sure you want to start a new game?");
    }
  }

  menuItemClickHandler(menuName:string){
    if(menuName == "NewGame"){
      this.isActionSheetOpen = true;
    }else if(menuName == "RestartGame"){
      this.presentConfirmAlert(new GameEvent(EventName.RestartGame),"Current game progress will be lost. Are you sure you want to restart game?");
    }else if(menuName == "Exit"){
      this.presentConfirmAlert(new GameEvent(EventName.Exit),"Are you sure you want to exit?");
    }
    this.menu?.setOpen(false,true);
  }

  cancel() {
    if(this.modal){
      this.modal.dismiss(null, 'cancel');
    }    
  }

  private exit(){
    this.isActionSheetOpen = false;
    if(this.platform.is('android') || this.platform.is('ios')){
      (navigator as any)['app'].exitApp();
    }else{
      window.self.close(); 
    }    
  }

  private async presentConfirmAlert(gameEvent:GameEvent, message="Are you sure you want to proceed?") {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        }, {
          text: 'Yes',
          cssClass: 'alert-button-confirm',
          handler: () => this.confirmAlertHandler(gameEvent)
        }
      ]
    });

    await alert.present();
  }
  private async presentGameOverAlert(header="Great Job!", message="You’ve successfully completed the Sudoku puzzle. Well done!") {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      cssClass: 'custom-alert',
      buttons: [{
          text: 'Ok',
          cssClass: 'alert-button-confirm',
        }
      ]
    });

    await alert.present();
  }
  private confirmAlertHandler(gameEvent:GameEvent){
    if(gameEvent){
      if((gameEvent.name == EventName.NewGame || gameEvent.name == EventName.RestartGame)){
        this.gameEventNotifierService.raiseEvent(gameEvent);
      }else{
        this.exit();
      }              
    }
  }
  private startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.seconds = 0;
    this.timer = setInterval(() => {
      this.seconds++;
      this.updateTime();
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private updateTime() {
    const minutes = Math.floor((this.seconds % 3600) / 60);
    const seconds = this.seconds % 60;

    this.time = `${this.pad(minutes)}:${this.pad(seconds)}`;
    if(this.time =="30:00"){
      this.markTimeOver();
    }
  }

  private markTimeOver(){
    this.stopTimer();
    this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.TimeOver));
    this.presentGameOverAlert("Time's Up!","Your time is up. Great effort! Review your puzzle and see how you did. Try again to beat your time!");
  }

  private markGameOver(){
    this.stopTimer();
    this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.GameOver));
    this.presentGameOverAlert();
  }

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
