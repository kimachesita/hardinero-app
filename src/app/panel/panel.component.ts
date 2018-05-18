import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { User } from '../_models/User';
import { Bed } from '../_models/Bed';
import { UserService } from '../_services/user.service';
import { BedService } from '../_services/bed.service';
 

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  currentUser: User;
  currentUserBeds: Bed[];
  currentUserBedsNum: number = 0;
  fetching = false;

  constructor(private bedService: BedService ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.fetching = true;
    this.getAllBeds();
  }

  getAllBeds(){
    this.bedService.getAll().subscribe((beds) => {
      this.currentUserBeds = beds;
      this.currentUserBeds.forEach(()=>{
          this.currentUserBedsNum++;
      });
      this.fetching = false;
     /* _.map(this.currentUserBeds,function(bed){ bed.bedMonitoringDevActive = true}) */
    });
  }
  

}
