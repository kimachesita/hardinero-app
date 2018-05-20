import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {

  private url = '/';
  private socket;

  constructor() { }

  receiveData() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('present', (data) => {
        observer.next({ 'status': 'live', 'data': data });
      });
      this.socket.on('absent', (device_key) => {
        observer.next({ 'status': 'dead', 'data': device_key });
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  writeData(data) {
    this.socket.emit('overwriteReq', data);
  }
}
