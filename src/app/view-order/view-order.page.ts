import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrderModel} from '../models/order-model';
import {OrderService} from '../services/order.service';
import {CartModel} from '../models/cart-model';

@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.page.html',
    styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
    id = '';
    order: OrderModel = {
        ord_id: '',
        ord_prod: [],
        cust_id: '',
        ord_date: '',
        state: 0,
        ord_summ: {
            items: [],
            total: 0,
            details: {
                name: '',
                phone: '',
                address: {
                    country: '',
                    region: '',
                    city: '',
                    pinCode: 0,
                    address: ''
                }
            }
        }
    };
    items: CartModel[] = [];
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
    constructor(private activateRoute: ActivatedRoute, private orderService: OrderService) {
        this.activateRoute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id');
            this.orderService.getOrder(this.id).subscribe((data: any) => {
                this.order = data[0];
                this.items = data.slice(1);
            });
        });
    }
    ngOnInit() {
    }
}
