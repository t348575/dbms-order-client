import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../models/order-model';
import {toMysqlFormat} from '../../constants';

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
    toMysqlFormat(val) {
        return toMysqlFormat(val);
    }
    ngOnInit() {
    }
    getOrders() {
        this.orderService.getOrders(!this.oldOrders).subscribe((data: OrderModel[]) => {
            this.orders = data;
        });
    }
    change() {
        this.oldOrders = !this.oldOrders;
        this.getOrders();
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
