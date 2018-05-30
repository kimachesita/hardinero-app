import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Bed } from '../_models/Bed';
import { BedService } from '../_services/bed.service';
import { SocketService } from '../_services/socket.service';
import { appConfig } from '../app.config';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {

  currentBed: Bed;
  fetching = false;
  connection;
  payloadStorageArr = [];
  _INTERNAL_UPDATE_RATE = 500;
  bedImage;

  constructor(private route: ActivatedRoute,
    private bedService: BedService,
    private location: Location,
    private socketService: SocketService,
    private router: Router) { }

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
      //this.bedImage = appConfig.rootUrl + '/images/' + this.currentBed.bedMonitoringDevKey + '.jpg';
      this.bedImage = this.location.path().split('/',3)[0] + 'images/' + this.currentBed.bedMonitoringDevKey + '.jpg';
      
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

  ngOnDestroy() {
    this.connection.unsubscribe();
  }  

  goBack() {
    this.router.navigate(['/']);
  }

}
