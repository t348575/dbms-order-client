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
    updateDetails(details: { name: string, phone: string, email: string, dob: string, address: AddressModel }): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.http.post(`${Constants.server}/userData/updateBasic`, { details }).subscribe((data: {status: boolean}) => {
                observer.next(data.status);
                observer.complete();
            });
        });
    }
    updatePassword(oldPass: string, newPass: string): Observable<{ status: boolean, message: string }> {
        return new Observable<{status: boolean; message: string}>(observer => {
            this.http.post(`${Constants.server}/userData/changePass`,
                {
                    oldPass,
                    newPass
                }).subscribe((data: { status: boolean, message: string }) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
}
