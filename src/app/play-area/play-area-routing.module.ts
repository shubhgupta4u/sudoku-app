import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayZoneComponent } from './components/play-zone/play-zone.component';

const routes: Routes = [
    {
      path: '',
      component:PlayZoneComponent
    }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class PlayAreaRoutingModule { }
  