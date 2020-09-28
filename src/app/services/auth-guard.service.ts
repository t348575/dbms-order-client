import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
    constructor(private auth: AuthService, private router: Router) { }
    canActivate(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            if (this.auth.isLoggedIn()) {
                observer.next(true);
                observer.complete();
            } else {
                this.auth.attemptAutoAuth().then(loggedIn => {
                    observer.next(loggedIn);
                    observer.complete();
                    if (!loggedIn) {
                        this.router.navigate(['']).then().catch();
                    }
                });
            }
        });
    }
}
