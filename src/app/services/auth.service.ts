import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userName = '';
    private userId = '';
    constructor(private http: HttpClient) {
        this.attemptAutoAuth();
    }
    attemptAutoAuth() {
        if (localStorage.getItem('loginToken')) {
            console.log('here');
        }
    }
    login(username: string, password: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.http.post(`${Constants.server}/users/login`, {
                username,
                password
            }).subscribe((data: { status: boolean, token: string}) => {
                observer.next(data.status);
                observer.complete();
                localStorage.setItem('loginToken', data.token);
            }, (err) => {
                observer.next(false);
                observer.complete();
            });
        });
    }
}
