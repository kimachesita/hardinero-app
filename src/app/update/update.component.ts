import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';


import { Bed } from '../_models/Bed';
import { Parameter } from '../_models/Parameter';
import { BedService } from '../_services/bed.service';
import { AlertService } from '../_services/alert.service';
import { ParameterService } from '../_services/parameter.service';
import { SocketService } from '../_services/socket.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit, OnDestroy {

  currentBed: Bed;
  parameters: Parameter[];
  selectedParameter: Parameter;
  selectedParameterCropName;
  selectedParameterId;
  loading: boolean = false;
  fetching = false;
  connection;
  minDate = new Date();
  maxDate = new Date();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private bedService: BedService,
    private alertService: AlertService,
    private parameterService: ParameterService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.fetching = true;
    this.currentBed = new Bed();
    this.getAllParameters();
    this.getBedById();
    this.listenSocket();
  }

  update() {
    this.loading = true;
    this.bedService.update(this.currentBed)
      .subscribe(data => {
        //creation succesful
        this._socketUpdate();
        this.alertService.success("Bed Updated");
        this.router.navigate(['/']);
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  getBedById() {
    const id = this.route.snapshot.paramMap.get('id');
    this.bedService.getById(id)
      .subscribe(
        (bed) => {
          if (bed.bedCrop) {
            this.currentBed = bed;
            if (this.parameters) {
              this.selectedParameter = this.parameters.find((parameter) => {
                return parameter.cropName == bed.bedCrop.cropName;
              })
            }

          } else {
            this.currentBed._id = bed._id;
            this.currentBed.bedCommonName = bed.bedCommonName;
            this.currentBed.bedLocation = bed.bedLocation;
            this.currentBed.bedOwner = bed.bedOwner;
            this.currentBed.bedIPCamURI = bed.bedIPCamURI;
            this.currentBed.bedMonitoringDevKey = bed.bedMonitoringDevKey;
            this.currentBed.bedMonitoringDevActive = bed.bedMonitoringDevActive;
          }
        }
      )
    this.fetching = false;
  }

  getAllParameters() {
    this.parameterService.getAll()
      .subscribe(params => {
        this.parameters = params;
      });
  }

  getParameterByID(id) {
    this.parameterService.getById(id)
      .subscribe((param) => {

        this.selectedParameter = param;
        if (!this.currentBed.bedCrop) {
          this.currentBed.bedCrop = {
            cropName: this.selectedParameter.cropName,
            cropSpecie: this.selectedParameter.cropSpecie,
            cropMoistureLimit: this.selectedParameter.cropMoistureLimit,
            cropHumidityLimit: this.selectedParameter.cropHumidityLimit,
            cropWateringFrequency: this.selectedParameter.cropWateringFrequency,
            cropPlantDate: new Date(Date.now()),
            cropHarvestDate: new Date(Date.now())
          }
          let computed_date = new Date();
          computed_date.setDate(this.currentBed.bedCrop.cropPlantDate.getDate() + this.selectedParameter.cropLifeSpan);
          this.currentBed.bedCrop.cropHarvestDate = computed_date;
        } else {
          this.currentBed.bedCrop.cropName = this.selectedParameter.cropName;
          this.currentBed.bedCrop.cropSpecie = this.selectedParameter.cropSpecie;
          this.currentBed.bedCrop.cropMoistureLimit = this.selectedParameter.cropMoistureLimit;
          this.currentBed.bedCrop.cropHumidityLimit = this.selectedParameter.cropHumidityLimit;
          this.currentBed.bedCrop.cropWateringFrequency = this.selectedParameter.cropWateringFrequency;
          this.currentBed.bedCrop.cropPlantDate = new Date(this.currentBed.bedCrop.cropPlantDate);
          this.currentBed.bedCrop.cropHarvestDate = new Date();
          //this.currentBed.bedCrop.cropHarvestDate
          let computed_date = new Date();
          computed_date.setDate(this.currentBed.bedCrop.cropPlantDate.getDate() + this.selectedParameter.cropLifeSpan);
          this.currentBed.bedCrop.cropHarvestDate = computed_date;
        }
      })
  }

  getParameterByName(name) {
    this.parameterService.getByName(name)
      .subscribe((param) => {
        console.log(param);
      });
  }

  selectCropName() {

    if (this.selectedParameterId) {
      //console.log(this.selectedParameterId);
      this.getParameterByID(this.selectedParameterId);
    }
  }

  delete() {
    this.bedService.delete(this.currentBed._id)
      .subscribe((res) => {
        this.alertService.success("Bed Succesfully Deleted");
        this.router.navigate(['/']);
      }, (err) => {
        this.alertService.error("Error Deleting Bed" + err);
      })
  }

  listenSocket() {
    this.connection = this.socketService.receiveData()
      .subscribe();
  }

  _socketUpdate() {
    //console.log('_socketUpdate');
    if(this.currentBed.bedCrop){
      let data = {
        device_key: this.currentBed.bedMonitoringDevKey,
        cropMoistureLimit: this.currentBed.bedCrop.cropMoistureLimit,
        cropHumidityLimit: this.currentBed.bedCrop.cropHumidityLimit,
        cropWateringFrequency: this.currentBed.bedCrop.cropWateringFrequency
      }
      this.socketService.writeData(data);
    }
    //console.log(data);
    
  }

  changeDate() {
    if (this.parameters) {
      this.selectedParameter = this.parameters.find((parameter) => {
        return parameter.cropName == this.currentBed.bedCrop.cropName;
      })
    }
    this.getParameterByID(this.selectedParameter._id);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  harvest(){
    this.loading = true;
    this.bedService.harvest(this.currentBed)
    .subscribe(data => {
      //creation succesful
      this._socketUpdate();
      this.alertService.success("Crop Harvested");
      this.router.navigate(['/']);
    },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
