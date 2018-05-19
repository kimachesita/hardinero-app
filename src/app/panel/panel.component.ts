import { Component, OnInit, OnDestroy } from '@angular/core';

import * as _ from 'lodash';

import { User } from '../_models/User';
import { Bed } from '../_models/Bed';
import { UserService } from '../_services/user.service';
import { BedService } from '../_services/bed.service';
import { SocketService } from '../_services/socket.service';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {

  currentUser: User;
  currentUserBeds: Bed[];
  currentUserBedsNum: number = 0;
  fetching = false;
  connection;

  constructor(private bedService: BedService, private socketService: SocketService ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.fetching = true;
    this.getAllBeds();
    this.listenSocket();
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

  listenSocket(){
    this.connection = this.socketService.receiveData()
    .subscribe(data => {
      
    })
  }
  
  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
