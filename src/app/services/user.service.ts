import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../../constants';
import {AddressModel} from '../models/address-model';
import {UserBasicModel} from '../models/user-basic-model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}
    addressDetails(): Observable<UserBasicModel> {
        return new Observable<UserBasicModel>(observer => {
            this.http.get(`${Constants.server}/userData/basic`).subscribe((data: UserBasicModel) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
}
