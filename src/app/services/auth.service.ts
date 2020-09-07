import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userName = '';
    private userId = '';
    private loggedIn = false;
    constructor(private http: HttpClient, private router: Router) {
        this.attemptAutoAuth();
    }
    attemptAutoAuth() {
        if (localStorage.getItem('loginToken')) {
            this.http.post(`${Constants.server}/users/autoLogin`, {
                loginToken: localStorage.getItem('loginToken'),
                apiToken: localStorage.getItem('apiToken')
            }).subscribe((data: { status: boolean, loginToken: string, apiToken: string }) => {
                localStorage.setItem('loginToken', data.loginToken);
                localStorage.setItem('apiToken', data.apiToken);
                if (data.status) {
                    this.loggedIn = true;
                }
            }, (err) => {
            });
        }
    }
    register(
        email: string,
        password: string,
        name: string,
        dob: string,
        phone: string,
        address: string
    ): Observable<{ status: boolean, message: string }> {
        return new Observable<{status: boolean; message: string}>(observer => {
            this.http.post(`${Constants.server}/users/register`, {
                email,
                password,
                name,
                dob,
                phone,
                address
            }).subscribe((data: {status: boolean; message: string}) => {
                observer.next(data);
                observer.complete();
                if (data.status) {
                    setTimeout(() => this.router.navigate(['/login']).then().catch(), 3000);
                }
            }, error => {
                observer.next({ message: 'http error', status: false });
                observer.complete();
            });
        });
    }
    login(username: string, password: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.http.post(`${Constants.server}/users/login`, {
                username,
                password
            }).subscribe((data: { status: boolean, loginToken: string, apiToken: string }) => {
                observer.next(data.status);
                observer.complete();
                localStorage.setItem('loginToken', data.loginToken);
                localStorage.setItem('apiToken', data.apiToken);
                if (data.status) {
                    this.loggedIn = true;
                }
            }, (err) => {
                observer.next(false);
                observer.complete();
            });
        });
    }
    isLoggedIn(): boolean {
        return this.loggedIn;
    }
}