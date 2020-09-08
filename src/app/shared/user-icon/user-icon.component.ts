import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-user-icon',
    templateUrl: './user-icon.component.html',
    styleUrls: ['./user-icon.component.scss'],
})
export class UserIconComponent implements OnInit {
    private loggedIn = false;
    constructor(private router: Router, private popover: PopoverController, private auth: AuthService) {
        this.loggedIn = auth.isLoggedIn();
    }
    ngOnInit() {}
    forward(location: string[]) {
        this.popover.dismiss();
        this.router.navigate(location).then().catch();
    }
    logout() {
        this.auth.logout();
    }
}
