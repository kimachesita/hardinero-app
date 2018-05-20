import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Bed } from '../_models/Bed';
import { BedService } from '../_services/bed.service';
import { SocketService } from '../_services/socket.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  currentBed: Bed;
  fetching = false;
  connection;
  payloadStorageArr = [];
  _INTERNAL_UPDATE_RATE = 500;

  constructor(private route: ActivatedRoute,
    private bedService: BedService,
    private location: Location,
    private socketService: SocketService) { }

  ngOnInit() {
    this.fetching = true;
    this.getBedById();
    this.listenSocket();
    this.processData();
  }

  getBedById() {
    const id = this.route.snapshot.paramMap.get('id');
    this.bedService.getById(id).subscribe((bed) => {
      this.currentBed = bed;
      this.fetching = false;
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

        if (status == 'live') {
          this.currentBed.bedMonitoringDevActive = true;
          this.currentBed.bedReading.weather = data.weather;
          this.currentBed.bedReading.temperature = data.temperature;
          this.currentBed.bedReading.humidity = data.humidity;
          this.currentBed.bedReading.waterMoisture1 = data.waterMoisture1;
          this.currentBed.bedReading.waterMoisture2 = data.waterMoisture2;
          this.currentBed.bedReading.waterPumpOn = data.waterPumpOn;
          this.currentBed.bedReading.tankLevel = data.tankLevel;
          this.currentBed.bedReading.lastWatering = data.lastWatering;
        } else {
          this.currentBed.bedMonitoringDevActive = false;
        }
      }

    }, this._INTERNAL_UPDATE_RATE);
  }


  goBack() {
    this.location.back();
  }

}
