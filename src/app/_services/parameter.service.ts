import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../app.config';
import { Parameter } from '../_models/Parameter';

@Injectable()
export class ParameterService {

  constructor(private http: HttpClient) {}

  add(parameter: Parameter) {
    return this.http.post(appConfig.apiUrl + '/parameters/add', parameter);
  }

  getAll() {
    return this.http.get<Parameter[]>(appConfig.apiUrl + '/parameters');
  }

  getById(_id: string) {
      return this.http.get<Parameter>(appConfig.apiUrl + '/parameters/' + _id);
  }

  getByName(name: string) {
    return this.http.get<Parameter>(appConfig.apiUrl + '/parameters/' + name);
 }

  delete(_id: string) {
      return this.http.delete(appConfig.apiUrl + '/parameters/' + _id);
  }
}
