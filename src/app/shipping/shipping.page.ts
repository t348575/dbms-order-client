import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {ActivatedRoute} from '@angular/router';
import {toMysqlFormat} from '../../constants';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.page.html',
    styleUrls: ['./shipping.page.scss'],
})
export class ShippingPage implements OnInit {
    status: { time: string, value: string }[] = [];
    estDelivery = '';
    constructor(private activatedRoute: ActivatedRoute, private order: OrderService) {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            this.order.getShipmentStatus(paramMap.get('id'))
                .subscribe((data: { ship_status: { time: string, value: string }[], ship_est_date: string }) => {
                this.status = data.ship_status;
                this.estDelivery = data.ship_est_date;
            });
        });
    }
    toMysqlFormat(val) {
        return toMysqlFormat(val);
    }
    ngOnInit() {
    }

}
