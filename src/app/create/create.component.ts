import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { BedService } from '../_services/bed.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  model: any = {};
  loading: boolean = false;
  returnUrl: string;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private bedService: BedService,
              private alertService: AlertService
            ){ }

  ngOnInit() {
    //get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  create(){
    this.loading = true;
    this.bedService.create(this.model)
    .subscribe(
      data =>{
        //creation succesful
        this.router.navigate(['/']);
      },
      error=>{
        this.alertService.error(error);
        this.loading = false; 
      }
    )
  }

  goBack(){
    this.router.navigate(['/']);
  }


}
