import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../app.config';
import { Bed } from '../_models/Bed';

@Injectable()
export class BedService {

  constructor(private http: HttpClient) { }

  create(bed: Bed) {
    return this.http.post(appConfig.apiUrl + '/beds/register', bed);
  }

  getAll() {
    return this.http.get<Bed[]>(appConfig.apiUrl + '/beds');
  }

  getById(_id: string) {
    return this.http.get<Bed>(appConfig.apiUrl + '/beds/' + _id);
  }

  harvest(bed: Bed) {
    return this.http.put(appConfig.apiUrl + '/beds/harvest/' + bed._id,bed);
  }

  update(bed: Bed) {
    return this.http.put(appConfig.apiUrl + '/beds/' + bed._id, bed);
  }

  delete(_id: string) {
    return this.http.delete(appConfig.apiUrl + '/beds/' + _id);
  }

}
