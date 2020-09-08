import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    constructor(private popover: PopoverController) { }
    ngOnInit() {}

}
