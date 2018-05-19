import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {

  private url = '/';
  private socket;

  constructor() { }

  receiveData(){
    let observable = new Observable(observer =>{
        this.socket = io(this.url);
        this.socket.on('present',(data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
    }) 
    return observable;
  }

}
