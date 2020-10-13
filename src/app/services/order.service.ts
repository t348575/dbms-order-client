import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartModel} from '../models/cart-model';
import {Constants} from '../../constants';
import {AddressModel} from '../models/address-model';
import * as qs from 'query-string';
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) { }
    placeOrder(
        products: CartModel[],
        payment: {
            name: string,
            cvc: number,
            card: string,
            exp: string
        },
        details: {
            name: string,
            phone: string,
            address: AddressModel
        }
        ) {
        return this.http.post(`${Constants.server}/order/placeOrder`, {
            products,
            payment,
            details
        });
    }
    getOrders(recent: boolean) {
        return this.http.get(`${Constants.server}/order/getOrders?recent=${+recent}`);
    }
    getOrder(id: string) {
        const query = qs.stringify({ id });
        return this.http.get(`${Constants.server}/order/getOrder?${query}`);
    }
    getShipmentStatus(ordId: string) {
        const query = qs.stringify({ ordId });
        return this.http.get(`${Constants.server}/order/getShipmentStatus?${query}`);
    }
}
