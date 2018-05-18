import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Bed } from '../_models/Bed';
import { BedService } from '../_services/bed.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  currentBed: Bed;
  fetching = false;

  constructor(private route: ActivatedRoute,
              private bedService: BedService,
              private location: Location) { }

  ngOnInit() {
    this.fetching = true;
    this.getBedById();
  }

  getBedById(){
      const id = this.route.snapshot.paramMap.get('id');
      this.bedService.getById(id).subscribe((bed) => {
        this.currentBed = bed; 
        this.fetching = false;
      });
  }

  goBack(){
    this.location.back();
  }

}
