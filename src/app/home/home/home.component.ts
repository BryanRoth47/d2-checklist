import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { MdTabChangeEvent, MdTabGroup } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ANIMATE_ON_ROUTE_ENTER } from '../../animations/router.transition';
import { Const, Platform } from "../../service/model";
import { StorageService } from '../../service/storage.service';
import { BungieService } from "../../service/bungie.service";
import { Challenge } from "../../service/model";
import {ChildComponent} from '../../shared/child.component';

@Component({
  selector: 'anms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  extends ChildComponent implements OnInit, OnDestroy {
  animateOnRouteEnter = ANIMATE_ON_ROUTE_ENTER;

  
  @ViewChild(MdTabGroup) tabs: MdTabGroup;

  platforms: Platform[];
  selectedPlatform: Platform;
  selectedTab: string;
  gamerTag: string;
  dontSearch: boolean;
  challenges: Challenge[] = [];

  navigation = [
    { link: 'checklist', label: 'Checklist' },
    { link: 'progress', label: 'Progress' }
  ];

  constructor(storageService: StorageService, private bungieService: BungieService, private router: Router) {
    super(storageService);
    this.platforms = Const.PLATFORMS_ARRAY;
    this.selectedPlatform = this.platforms[0];


    this.storageService.settingFeed
      .takeUntil(this.unsubscribe$)
      .subscribe(
      x => {
        if (x.defaultplatform != null) {
          this.setPlatform(x.defaultplatform);
        }
        if (x.defaultgt != null) {
          this.gamerTag = x.defaultgt;
        }
      });
    this.storageService.refresh();

  }

  private setPlatform(type: number) {
    //already set
    if (this.selectedPlatform != null && this.selectedPlatform.type === type) return;
    this.selectedPlatform = Const.PLATFORMS_DICT[""+type];
  }

  public routeSearch(): void{
    if (this.selectedPlatform == null) {
      return;
    }
    if (this.gamerTag == null || this.gamerTag.trim().length < 1) {
      return;
    }
    
    this.router.navigate([this.selectedPlatform.type, this.gamerTag]);
  }

  onPlatformChange() {
    this.storageService.setItem("defaultplatform", this.selectedPlatform.type);
  }

  onGtChange() {
    this.storageService.setItem("defaultgt", this.gamerTag);
  }

  ngOnInit() {
    this.bungieService.getChallenges().then(c=>{
      this.challenges = c;
    })

   
  }

}
