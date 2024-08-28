import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Complexity } from '../../services/sudoku-board-generator.service';
import { AlertController, IonMenu, IonModal, Platform } from '@ionic/angular';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { EventName, GameEvent, NewGameEventData } from '../../models/game-event';
import { Subscription } from 'rxjs';
import { faEraser, faCircleInfo, faWandSparkles} from '@fortawesome/free-solid-svg-icons';
import { SudokuBoardComponent } from '../sudoku-board/sudoku-board.component';
import { ActivatedRoute } from '@angular/router';
import {NativeAudio} from '@capacitor-community/native-audio'

@Component({
  selector: 'app-play-zone',
  templateUrl: './play-zone.component.html',
  styleUrls: ['./play-zone.component.scss'],
})
export class PlayZoneComponent implements OnInit, OnDestroy {
  isActionSheetOpen = false;
  routerSubscription: Subscription|undefined;
  gameEventSubscription: Subscription|undefined;
  gameComplexity:Complexity = Complexity.Medium;
  gameComplexityName:string = Complexity[Complexity.Medium];
  time: string = '30:00';
  timer: any;
  seconds: number = 30*60;

  faEraser=faEraser;
  faCircleInfo=faCircleInfo;
  faWandSparkles=faWandSparkles;

  @ViewChildren(IonModal) modals: QueryList<IonModal>|undefined;
  @ViewChildren(SudokuBoardComponent) boards: QueryList<SudokuBoardComponent>|undefined;
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
    private alertController: AlertController,
    private route: ActivatedRoute) { 
      this.routerSubscription = this.route.params.subscribe(params => {
        if(+params['mode'] && Complexity[+params['mode']]){
          this.gameComplexity = +params['mode']; 
          this.gameComplexityName=Complexity[this.gameComplexity]; 
        }              
      });
  }

  registerEventSubscription(){
    this.startTimer();
    this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
      if(event){
        switch(event.name){
          case EventName.NewGame:
            if(event.data && event.data instanceof NewGameEventData){
              this.gameComplexity = event.data.complexity;
              this.gameComplexityName = Complexity[event.data.complexity];
              this.startTimer();
              this.gameEventNotifierService.clearLastPickerNumber();
              this.gameEventNotifierService.clearLastSelectedEmptyCell();
            }
            break;
          case EventName.GameOver:
            this.markGameOver();
            this.gameEventNotifierService.clearLastPickerNumber();
            this.gameEventNotifierService.clearLastSelectedEmptyCell();
            this.playGameWonSound();
            break;
          case EventName.TimeOver:
            this.playGameOverSound();
          break;
          case EventName.cellClicked:
            this.playClickSound();
            break;
        }
      }
    });
    setTimeout(()=>{
      this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.NewGame,new NewGameEventData(this.gameComplexity)));
    },200);
  }

  ngOnInit() { 
    this.registerEventSubscription();  
    setTimeout(()=>{
      this.loadAudio();
    },100) ;    
  }

  loadAudio(){
    let clickaudioFilePath="click.mp3";
    let gameOveraudioFilePath="game_over.mp3";
    let gameWinaudioFilePath="game_win.mp3";
    if(this.platform.is('android')){
      clickaudioFilePath="public/assets/sounds/click.mp3";
      gameOveraudioFilePath="public/assets/sounds/game_over.mp3";
      gameWinaudioFilePath="public/assets/sounds/game_win.mp3";
    }
    NativeAudio.preload({
      assetId: "click",
      assetPath: clickaudioFilePath,
      audioChannelNum: 1,
      isUrl: false
    });
    NativeAudio.preload(
    {
      assetId: "game-over",
      assetPath: gameOveraudioFilePath,
      audioChannelNum: 1,
      isUrl: false
    });
    NativeAudio.preload(
    {
      assetId: "game-win",
      assetPath: gameWinaudioFilePath,
      audioChannelNum: 1,
      isUrl: false
    });
  }
  ngOnDestroy() { 
    if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
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
      this.presentConfirmAlert(new GameEvent(EventName.NewGame, new NewGameEventData(event.detail.data.action)),"Current game progress will be lost. Are you sure you want to start a new game?");
    }
  }

  menuItemClickHandler(menuName:string){
    if(menuName == "NewGame"){
      this.isActionSheetOpen = true;
    }else if(menuName == "RestartGame" && this.gameComplexity !== undefined){
      this.presentConfirmAlert(new GameEvent(EventName.NewGame,new NewGameEventData(this.gameComplexity)),"Current game progress will be lost. Are you sure you want to restart game?");
    }else if(menuName == "Exit"){
      this.presentConfirmAlert(new GameEvent(EventName.Exit),"Are you sure you want to exit?");
    }
    this.menu?.setOpen(false,true);
  }

  cancel() {
    if(this.modals){
      this.modals.forEach((modal)=>{
        modal.dismiss(null, 'cancel');
      })
     
    }    
  }

  anyCellSelected():boolean{
    if(this.boards && this.boards.length >=1 && this.boards.filter(s=> (s.readonly == undefined || s.readonly == false) && s.anyCellSelected())?.length >= 1)
      return true;
    else
      return false
  }

  isMobilePlatform():boolean{
    return this.platform.is('android') || this.platform.is('ios');
  }
  clearSelection(){
    if(this.anyCellSelected()){
      this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.ClearSelection));
    }else{
      this.presentConfirmAlert(new GameEvent(EventName.ClearAll),"Current game progress will be lost. Are you sure you want to reset the sudoku board?");
    }   
  }

  private exit(){
    this.isActionSheetOpen = false;
    (navigator as any)['app'].exitApp();   
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
      if(gameEvent.name == EventName.NewGame || gameEvent.name == EventName.ClearAll ){
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
    this.seconds = 30*60;
    this.timer = setInterval(() => {
      this.seconds--;
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
    if(this.time =="00:00"){
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
    this.presentGameOverAlert();
  }

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  private playClickSound() {
    NativeAudio.play({
      assetId: 'click',
    });
  }
  
  private playGameWonSound() {
    NativeAudio.play({
      assetId: 'game-win',
    });
  }
  
  private playGameOverSound() {
    NativeAudio.play({
      assetId: 'game-over',
    });
  }
}
