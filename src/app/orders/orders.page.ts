import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../models/order-model';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    oldOrders = false;
    orders: OrderModel[] = [];
    constructor(private orderService: OrderService) {
        this.getOrders();
    }
    ngOnInit() {
    }
    getOrders() {
        this.orderService.getOrders(this.oldOrders).subscribe((data: OrderModel[]) => {
            this.orders = data;
        });
    }
    formatDate(date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }
    toMysqlFormat(date) {
        date = new Date(date);
        return this.formatDate(date) + ' ' + date.toTimeString().split(' ')[0];
    }
    getStatus(state: number) {
        switch (state) {
            case 0: {
                return 'Awaiting confirmation';
            }
            case 1: {
                return 'Order being packaged';
            }
            case 2: {
                return 'Shipment has been sent out';
            }
            case 3: {
                return 'Shipment has reached final destination';
            }
            case 4: {
                return 'Order has been delivered';
            }
            case -1: {
                return 'Order cancelled';
            }
        }
    }
}
