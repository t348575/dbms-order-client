import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../../constants';
import {AddressModel} from '../models/address-model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}
    addressDetails(): Observable<AddressModel> {
        return new Observable<AddressModel>(observer => {
            this.http.get(`${Constants.server}/userData/address`).subscribe((data: AddressModel) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
}
