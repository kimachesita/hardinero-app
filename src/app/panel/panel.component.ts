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
  payloadStorageArr = [];
  _INTERNAL_UPDATE_RATE = 500;

  constructor(private bedService: BedService, private socketService: SocketService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.fetching = true;
    this.getAllBeds();
    this.listenSocket();
    this.processData();
  }

  getAllBeds() {
    this.bedService.getAll().subscribe((beds) => {
      this.currentUserBeds = beds;
      this.currentUserBeds.forEach(() => {
        this.currentUserBedsNum++;
      });
      this.fetching = false;
      /* _.map(this.currentUserBeds,function(bed){ bed.bedMonitoringDevActive = true}) */
    });
  }

  listenSocket() {
    this.connection = this.socketService.receiveData()
      .subscribe(payload => {
        this.payloadStorageArr.push(payload);
      });
  }

  processData() {
    setInterval(() => {
      if (this.payloadStorageArr.length > 0) {
        let payload = this.payloadStorageArr.shift();
        let status = payload.status;
        let data = payload.data;
        this.currentUserBeds.forEach((bed) => {
          if (status == 'live') {
            if (bed.bedMonitoringDevKey == data.device_key) {
              bed.bedMonitoringDevActive = true;
              bed.bedReading.weather = data.weather;
              bed.bedReading.temperature = data.temperature;
              bed.bedReading.humidity = data.humidity;
              bed.bedReading.waterMoisture1 = data.waterMoisture1;
              bed.bedReading.waterMoisture2 = data.waterMoisture2;
              bed.bedReading.waterPumpOn = data.waterPumpOn;
              bed.bedReading.tankLevel = data.tankLevel;
              bed.bedReading.lastWatering = data.lastWatering;
            }
          } else {
            if (bed.bedMonitoringDevKey == data)
              bed.bedMonitoringDevActive = false;
          }

        });
      }

    }, this._INTERNAL_UPDATE_RATE);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
