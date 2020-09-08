import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-user-icon',
    templateUrl: './user-icon.component.html',
    styleUrls: ['./user-icon.component.scss'],
})
export class UserIconComponent implements OnInit {

    constructor(private router: Router, private popover: PopoverController) { }

    ngOnInit() {}
    forward(location: string[]) {
        this.popover.dismiss();
        this.router.navigate(location).then().catch();
    }
}
