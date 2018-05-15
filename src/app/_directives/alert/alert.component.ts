import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnDestroy {

  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {
    //subscribe to alert messages
    this.subscription = alertService.getMessage().subscribe(message => {this.message = message});
  }

  ngOnDestroy() {
    // unsunscribe on destroy to prevent memory leak
    this.subscription.unsubscribe();
  }

}
