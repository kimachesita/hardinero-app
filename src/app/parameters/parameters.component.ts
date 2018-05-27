import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Parameter } from '../_models/Parameter';
import { ParameterService } from '../_services/parameter.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  parameters: Parameter[];
  model: any = {};
  loading = false;

  constructor(private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private parameterService: ParameterService,
    private alertService: AlertService
  ){ }

  ngOnInit() {
      this.getAll();
      this.model = {};
  }

  getAll(){
      this.parameterService.getAll()
      .subscribe(
        data=>{
          this.parameters = data;
        },
        error=>{
          this.alertService.error(error);
        }
      )
  }

  add(){
    this.loading = true;
    console.log(this.model.cropLifeSpan);
    this.parameterService.add(this.model)
    .subscribe(
      data =>{
        //creation succesful
        this.alertService.success("Parameter Successfully Added"); 
        this.loading = false;
        this.ngOnInit();
        
      },
      error=>{
        this.alertService.error(error);
        this.loading = false; 
      }
    )
  }

  delete(id){
    this.parameterService.delete(id)
    .subscribe(
      data =>{
      //deletion successful
      this.alertService.success("Parameter Successfully Deleted"); 
      this.ngOnInit();
    },
    error=>{
      this.alertService.error(error); 
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
