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

  title = "Raspberry Pi Based Crops and Soil Monitoring System";
  currentUser: User;
  currentUserBeds: Bed[];
  currentUserBedsNum: number = 0;
  fetching = false;
  connection;
  payloadStorageArr = [];
  _INTERNAL_UPDATE_RATE = 500;
  opened = true;
  selectedBedId;
  selectedBedName;
  selectedBedStatus = "Offline";

  //chart definitions
  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true
  };
  public barChartLabels: string[] = ['Water Tank', 'Temp degCel', '% Humidity', 'WM Prb 1', 'WM Prb 2'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;

  //initialize bar chart data
  public barChartData: any[] = [
    { data: [0, 0, 0, 0, 0] },
  ];


  //end of chart definitiona

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
      this.currentUserBeds.forEach((bed) => {
        //dynamically add classes property to object
        bed['classes'] = {
          'bed-card': true,
          'overdue': false
        }
        //for counting number of beds
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

  //routines for processing socket data  
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
      this.updateBarChart();

    }, this._INTERNAL_UPDATE_RATE);
  }

  getCropDaysOld(dpl) {
    let now = new Date();
    let date_planted = new Date(dpl);
    let days_old = Math.floor((now.getTime() - date_planted.getTime()) / (1000 * 60 * 60 * 24));
    if (days_old < 0) {
      days_old = 0;
    }
    return days_old;

  }

  getDaysToHarvest(dhr, bId) {
    let now = new Date();
    let date_harvest = new Date(dhr);
    let days_to_harvest = Math.ceil((date_harvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days_to_harvest <= 0) {
      days_to_harvest = 0;
      this.issueAlert(bId);
    }
    return days_to_harvest;
  }

  issueAlert(bId) {
    let bed = _.find(this.currentUserBeds, { '_id': bId });
    //console.log(bed);
    if (bed.classes) {
      bed.classes.overdue = true;
    }
  }

  selectBed() {
    this.selectedBedName = _.find(this.currentUserBeds, { _id: this.selectedBedId }).bedCommonName;
  }

  updateBarChart() {
    if (this.selectedBedId) {
      let currentBed = _.find(this.currentUserBeds, { _id: this.selectedBedId });
      if (currentBed.bedMonitoringDevActive) {
        this.selectedBedStatus = "Online";
        let data = [{
          data: [currentBed.bedReading.tankLevel,
          currentBed.bedReading.temperature,
          currentBed.bedReading.humidity,
          currentBed.bedReading.waterMoisture1,
          currentBed.bedReading.waterMoisture2
          ]
        }
        ];

        this.barChartData = data;
        
      } else {
        this.selectedBedStatus = "Offline";
        this.barChartData = [{ data: [0, 0, 0, 0, 0] }];
      }
    }


  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
